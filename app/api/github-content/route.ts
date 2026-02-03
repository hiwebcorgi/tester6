import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const file = searchParams.get('file') || 'content/home.json';

        const owner = process.env.GITHUB_OWNER;
        const repo = process.env.GITHUB_REPO;
        const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
        const branch = process.env.GITHUB_BRANCH || 'master';

        if (!owner || !repo || !token) {
            console.error('[GitHub Content API] Missing environment variables');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const githubUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${file}?ref=${branch}`;

        const response = await fetch(githubUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('[GitHub Content API] GitHub API error:', response.status, error);
            return NextResponse.json(
                { error: 'Failed to fetch from GitHub', details: error },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Decode base64 content
        const decodedContent = Buffer.from(data.content, 'base64').toString('utf-8');
        const jsonData = JSON.parse(decodedContent);

        return NextResponse.json(jsonData);
    } catch (error: any) {
        console.error('[GitHub Content API] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
