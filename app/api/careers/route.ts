import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

interface Job {
    id: string;
    title: string;
    type: string;
    location: string;
    department: string;
    description: string;
    requirements: string[];
    benefits: string[];
    deadline: string;
    active: boolean;
    postedDate: string;
}

interface Jobs {
    jobs: Job[];
}

const octokit = new Octokit({
    auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
});

const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO!;
const branch = process.env.GITHUB_BRANCH || 'master';
const filePath = 'content/careers.json';

// GET: 채용 공고 목록 조회
export async function GET() {
    try {
        const { data } = await octokit.repos.getContent({
            owner,
            repo,
            path: filePath,
            ref: branch,
        });

        if ('content' in data) {
            const content = Buffer.from(data.content, 'base64').toString('utf-8');
            const jobs = JSON.parse(content);
            return NextResponse.json(jobs);
        }

        return NextResponse.json({ jobs: [] });
    } catch (error: any) {
        console.error('[Careers API] GET error:', error);

        // If file not found, just return empty list instead of 500 error
        if (error.status === 404) {
            return NextResponse.json({ jobs: [] });
        }

        return NextResponse.json({ jobs: [] }, { status: 500 });
    }
}

// POST: 새 채용 공고 추가
export async function POST(request: NextRequest) {
    const session = request.cookies.get('admin-session');
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const newJob = await request.json();

        // 현재 데이터 가져오기
        let jobs: Jobs = { jobs: [] };
        let sha = '';

        try {
            const { data: fileData } = await octokit.repos.getContent({
                owner,
                repo,
                path: filePath,
                ref: branch,
            });

            if ('content' in fileData) {
                const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
                jobs = JSON.parse(content);
                sha = fileData.sha;
            }
        } catch (error: any) {
            // 파일이 없으면 (404) 무시하고 새로 생성
            if (error.status !== 404) {
                throw error;
            }
            console.log('[Careers API] File not found, will create new one');
        }

        const maxId = jobs.jobs.reduce((max: number, j: Job) => {
            const id = parseInt(j.id);
            return isNaN(id) ? max : (id > max ? id : max);
        }, 0);
        newJob.id = (maxId + 1).toString();
        newJob.postedDate = new Date().toISOString().split('T')[0];
        newJob.active = true;

        jobs.jobs.unshift(newJob);

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: `Add job posting: ${newJob.title}`,
            content: Buffer.from(JSON.stringify(jobs, null, 2)).toString('base64'),
            branch,
            sha: sha || undefined,
        });

        return NextResponse.json({ success: true, job: newJob });
    } catch (error: any) {
        console.error('[Careers API] POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: 채용 공고 수정
export async function PUT(request: NextRequest) {
    const session = request.cookies.get('admin-session');
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const updatedJob = await request.json();

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
        const jobs = JSON.parse(content);

        const index = jobs.jobs.findIndex((j: Job) => j.id === updatedJob.id);
        if (index === -1) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        jobs.jobs[index] = updatedJob;

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: `Update job posting: ${updatedJob.title}`,
            content: Buffer.from(JSON.stringify(jobs, null, 2)).toString('base64'),
            branch,
            sha: fileData.sha,
        });

        return NextResponse.json({ success: true, job: updatedJob });
    } catch (error: any) {
        console.error('[Careers API] PUT error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: 채용 공고 삭제
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
        const jobs = JSON.parse(content);

        const filtered = jobs.jobs.filter((j: Job) => j.id !== id);

        if (filtered.length === jobs.jobs.length) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        jobs.jobs = filtered;

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: `Delete job posting: ${id}`,
            content: Buffer.from(JSON.stringify(jobs, null, 2)).toString('base64'),
            branch,
            sha: fileData.sha,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[Careers API] DELETE error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
