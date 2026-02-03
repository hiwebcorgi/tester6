import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
    auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
});

const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO!;
const branch = process.env.GITHUB_BRANCH || 'master';
const lang = process.env.DEPLOY_LANGUAGE || 'ko';
const filePath = `content/${lang}/categories.json`;

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
            return NextResponse.json(JSON.parse(content));
        }

        return NextResponse.json([]);
    } catch (error: any) {
        if (error.status === 404) {
            return NextResponse.json([]);
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = request.cookies.get('admin-session');
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const categories = await request.json(); // Expects array of strings

        const { data: fileData } = await octokit.repos.getContent({
            owner,
            repo,
            path: filePath,
            ref: branch,
        }).catch(() => ({ data: { sha: undefined } })); // Handle file not found

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: 'Update blog categories',
            content: Buffer.from(JSON.stringify(categories, null, 2)).toString('base64'),
            branch,
            sha: (fileData as any).sha,
        });

        return NextResponse.json({ success: true, categories });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
