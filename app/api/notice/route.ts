import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';

interface Notice {
    id: string;
    title: string;
    date: string;
    important: boolean;
    content: string;
}

interface NoticeData {
    notices: Notice[];
}

const octokit = new Octokit({
    auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
});

const owner = process.env.GITHUB_OWNER || '';
const repo = process.env.GITHUB_REPO || '';
const branch = process.env.GITHUB_BRANCH || 'master';
const filePath = 'content/notices.json';
const localFilePath = path.join(process.cwd(), 'content', 'notices.json');

// Check if we should use local file (for development)
const useLocalFile = () => process.env.NODE_ENV === 'development' || !owner || !repo || !process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

// Helper: Load from local file
const loadLocalNotices = (): NoticeData => {
    try {
        if (!fs.existsSync(localFilePath)) {
            // Create default file if missing
            const defaultData = { notices: [] };
            fs.writeFileSync(localFilePath, JSON.stringify(defaultData, null, 2), 'utf-8');
            return defaultData;
        }
        const content = fs.readFileSync(localFilePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.error('Error reading local notices file:', error);
    }
    return { notices: [] };
};

// Helper: Save to local file
const saveLocalNotices = (data: NoticeData) => {
    fs.writeFileSync(localFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

// GET: 공지사항 목록 조회
export async function GET() {
    try {
        let notices: NoticeData;

        if (useLocalFile()) {
            // Local development: read from local file
            notices = loadLocalNotices();
        } else {
            // Production: read from GitHub
            const { data } = await octokit.repos.getContent({
                owner,
                repo,
                path: filePath,
                ref: branch,
            });

            if ('content' in data) {
                const content = Buffer.from(data.content, 'base64').toString('utf-8');
                notices = JSON.parse(content);
            } else {
                notices = { notices: [] };
            }
        }

        // Sort: important first, then by date
        notices.notices.sort((a: Notice, b: Notice) => {
            if (a.important && !b.important) return -1;
            if (!a.important && b.important) return 1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        return NextResponse.json(notices);
    } catch (error: any) {
        console.error('[Notice API] GET error:', error);

        // Fallback to local file on error
        const notices = loadLocalNotices();
        return NextResponse.json(notices);
    }
}

// POST: 새 공지사항 추가
export async function POST(request: NextRequest) {
    const session = request.cookies.get('admin-session');
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const newNotice = await request.json();
        let notices: NoticeData;
        let sha = '';

        if (useLocalFile()) {
            notices = loadLocalNotices();
        } else {
            const { data: fileData } = await octokit.repos.getContent({
                owner,
                repo,
                path: filePath,
                ref: branch,
            });

            notices = { notices: [] };

            if ('content' in fileData) {
                const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
                notices = JSON.parse(content);
                sha = fileData.sha;
            }
        }

        // ID 생성
        const maxId = notices.notices.reduce((max: number, n: Notice) => {
            const id = parseInt(n.id);
            return id > max ? id : max;
        }, 0);
        newNotice.id = (maxId + 1).toString();
        newNotice.date = new Date().toISOString().split('T')[0];

        notices.notices.unshift(newNotice);

        if (useLocalFile()) {
            saveLocalNotices(notices);
        } else {
            await octokit.repos.createOrUpdateFileContents({
                owner,
                repo,
                path: filePath,
                message: `Add notice: ${newNotice.title}`,
                content: Buffer.from(JSON.stringify(notices, null, 2)).toString('base64'),
                branch,
                sha,
            });
        }

        return NextResponse.json({ success: true, notice: newNotice });
    } catch (error: any) {
        console.error('[Notice API] POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: 공지사항 수정
export async function PUT(request: NextRequest) {
    const session = request.cookies.get('admin-session');
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const updatedNotice = await request.json();
        let notices: NoticeData;
        let sha = '';

        if (useLocalFile()) {
            notices = loadLocalNotices();
        } else {
            const { data: fileData } = await octokit.repos.getContent({
                owner,
                repo,
                path: filePath,
                ref: branch,
            });

            if (!('content' in fileData)) {
                return NextResponse.json({ error: 'File not found' }, { status: 404 });
            }

            const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
            notices = JSON.parse(content);
            sha = fileData.sha;
        }

        const index = notices.notices.findIndex((n: Notice) => n.id === updatedNotice.id);
        if (index === -1) {
            return NextResponse.json({ error: 'Notice not found' }, { status: 404 });
        }

        notices.notices[index] = updatedNotice;

        if (useLocalFile()) {
            saveLocalNotices(notices);
        } else {
            await octokit.repos.createOrUpdateFileContents({
                owner,
                repo,
                path: filePath,
                message: `Update notice: ${updatedNotice.title}`,
                content: Buffer.from(JSON.stringify(notices, null, 2)).toString('base64'),
                branch,
                sha,
            });
        }

        return NextResponse.json({ success: true, notice: updatedNotice });
    } catch (error: any) {
        console.error('[Notice API] PUT error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: 공지사항 삭제
export async function DELETE(request: NextRequest) {
    const session = request.cookies.get('admin-session');
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        let notices: NoticeData;
        let sha = '';

        if (useLocalFile()) {
            notices = loadLocalNotices();
        } else {
            const { data: fileData } = await octokit.repos.getContent({
                owner,
                repo,
                path: filePath,
                ref: branch,
            });

            if (!('content' in fileData)) {
                return NextResponse.json({ error: 'File not found' }, { status: 404 });
            }

            const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
            notices = JSON.parse(content);
            sha = fileData.sha;
        }

        const filtered = notices.notices.filter((n: Notice) => n.id !== id);

        if (filtered.length === notices.notices.length) {
            return NextResponse.json({ error: 'Notice not found' }, { status: 404 });
        }

        notices.notices = filtered;

        if (useLocalFile()) {
            saveLocalNotices(notices);
        } else {
            await octokit.repos.createOrUpdateFileContents({
                owner,
                repo,
                path: filePath,
                message: `Delete notice: ${id}`,
                content: Buffer.from(JSON.stringify(notices, null, 2)).toString('base64'),
                branch,
                sha,
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[Notice API] DELETE error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
