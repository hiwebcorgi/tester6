import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

interface BlogPost {
    id: string;
    title: string;
    date: string;
    excerpt: string;
    content: string;
    tags: string[];
    author: string;
    category?: string;
    image?: string;
}

interface BlogData {
    posts: BlogPost[];
}

const octokit = new Octokit({
    auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
});

const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO!;
const branch = process.env.GITHUB_BRANCH || 'master';
const lang = process.env.DEPLOY_LANGUAGE || 'ko';
const filePath = `content/${lang}/blog.json`;

// GET: 블로그 포스트 목록 조회
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
            const posts = JSON.parse(content);
            return NextResponse.json(posts);
        }

        return NextResponse.json({ posts: [] });
    } catch (error: any) {
        console.error('[Blog API] GET error:', error);

        // If file not found, just return empty list instead of 500 error
        if (error.status === 404) {
            return NextResponse.json({ posts: [] });
        }

        return NextResponse.json({ posts: [] }, { status: 500 });
    }
}

// POST: 새 포스트 추가
export async function POST(request: NextRequest) {
    const session = request.cookies.get('admin-session');
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const newPost = await request.json();

        let fileData: any = {};
        try {
            const { data } = await octokit.repos.getContent({
                owner,
                repo,
                path: filePath,
                ref: branch,
            });
            fileData = data;
        } catch (e: any) {
            if (e.status !== 404) throw e;
            // File doesn't exist, will be created
        }

        let posts: BlogData = { posts: [] };
        let sha = '';

        if (fileData && 'content' in fileData) {
            try {
                const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
                posts = JSON.parse(content);
                sha = fileData.sha;
            } catch (parseError) {
                console.error('[Blog API] JSON Parse error:', parseError);
                // If JSON is invalid, start with empty posts but keep SHA to overwrite
                posts = { posts: [] };
                sha = fileData.sha;
            }
        }

        // Ensure posts.posts is an array
        if (!Array.isArray(posts.posts)) {
            posts.posts = [];
        }

        const maxId = posts.posts.reduce((max: number, p: BlogPost) => {
            const id = parseInt(p.id);
            return isNaN(id) ? max : (id > max ? id : max);
        }, 0);
        newPost.id = (maxId + 1).toString();
        // newPost.date is already set by client or we can set it here if missing
        if (!newPost.date) {
            newPost.date = new Date().toISOString().split('T')[0];
        }

        posts.posts.unshift(newPost); // 최신 포스트를 맨 앞에

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: `Add blog post: ${newPost.title}`,
            content: Buffer.from(JSON.stringify(posts, null, 2)).toString('base64'),
            branch,
            sha: sha || undefined, // undefined sha means create new file
        });

        return NextResponse.json({ success: true, post: newPost });
    } catch (error: any) {
        console.error('[Blog API] POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: 포스트 수정
export async function PUT(request: NextRequest) {
    const session = request.cookies.get('admin-session');
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const updatedPost = await request.json();

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
        const posts = JSON.parse(content);

        const index = posts.posts.findIndex((p: BlogPost) => p.id === updatedPost.id);
        if (index === -1) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        posts.posts[index] = updatedPost;

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: `Update blog post: ${updatedPost.title}`,
            content: Buffer.from(JSON.stringify(posts, null, 2)).toString('base64'),
            branch,
            sha: fileData.sha,
        });

        return NextResponse.json({ success: true, post: updatedPost });
    } catch (error: any) {
        console.error('[Blog API] PUT error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: 포스트 삭제
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
        const posts = JSON.parse(content);

        const filtered = posts.posts.filter((p: BlogPost) => p.id !== id);

        if (filtered.length === posts.posts.length) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        posts.posts = filtered;

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: `Delete blog post: ${id}`,
            content: Buffer.from(JSON.stringify(posts, null, 2)).toString('base64'),
            branch,
            sha: fileData.sha,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[Blog API] DELETE error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
