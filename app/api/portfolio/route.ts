import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

// Portfolio 타입 정의
interface Portfolio {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    tags: string[];
    link: string;
    date: string;
    content?: string;
}

interface PortfolioData {
    portfolios: Portfolio[];
}

const octokit = new Octokit({
    auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
});

const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO!;
const branch = process.env.GITHUB_BRANCH || 'master';
const filePath = 'content/portfolio.json';

// GET: 포트폴리오 목록 조회
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
            const portfolios = JSON.parse(content);
            return NextResponse.json(portfolios);
        }

        return NextResponse.json({ portfolios: [] });
    } catch (error: any) {
        console.error('[Portfolio API] GET error:', error);

        // If file not found, just return empty list instead of 500 error
        if (error.status === 404) {
            return NextResponse.json({ portfolios: [] });
        }

        return NextResponse.json({ portfolios: [] }, { status: 500 });
    }
}

// POST: 새 포트폴리오 추가
export async function POST(request: NextRequest) {
    // 인증 확인
    const session = request.cookies.get('admin-session');
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const newPortfolio = await request.json();

        // 현재 데이터 가져오기
        let portfolios: PortfolioData = { portfolios: [] };
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
                portfolios = JSON.parse(content);
                sha = fileData.sha;
            }
        } catch (error: any) {
            // 파일이 없으면 (404) 무시하고 새로 생성
            if (error.status !== 404) {
                throw error;
            }
            console.log('[Portfolio API] File not found, will create new one');
        }

        // ID 생성
        const maxId = portfolios.portfolios.reduce((max: number, p: Portfolio) => {
            const id = parseInt(p.id);
            return isNaN(id) ? max : (id > max ? id : max);
        }, 0);
        newPortfolio.id = (maxId + 1).toString();

        // 추가
        portfolios.portfolios.push(newPortfolio);

        // GitHub에 저장
        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: `Add portfolio: ${newPortfolio.title}`,
            content: Buffer.from(JSON.stringify(portfolios, null, 2)).toString('base64'),
            branch,
            sha: sha || undefined,
        });

        return NextResponse.json({ success: true, portfolio: newPortfolio });
    } catch (error: any) {
        console.error('[Portfolio API] POST error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: 포트폴리오 수정
export async function PUT(request: NextRequest) {
    const session = request.cookies.get('admin-session');
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const updatedPortfolio = await request.json();

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
        const portfolios = JSON.parse(content);

        const index = portfolios.portfolios.findIndex((p: Portfolio) => p.id === updatedPortfolio.id);
        if (index === -1) {
            return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
        }

        portfolios.portfolios[index] = updatedPortfolio;

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: `Update portfolio: ${updatedPortfolio.title}`,
            content: Buffer.from(JSON.stringify(portfolios, null, 2)).toString('base64'),
            branch,
            sha: fileData.sha,
        });

        return NextResponse.json({ success: true, portfolio: updatedPortfolio });
    } catch (error: any) {
        console.error('[Portfolio API] PUT error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: 포트폴리오 삭제
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
        const portfolios = JSON.parse(content);

        const filtered = portfolios.portfolios.filter((p: Portfolio) => p.id !== id);

        if (filtered.length === portfolios.portfolios.length) {
            return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
        }

        portfolios.portfolios = filtered;

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: `Delete portfolio: ${id}`,
            content: Buffer.from(JSON.stringify(portfolios, null, 2)).toString('base64'),
            branch,
            sha: fileData.sha,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[Portfolio API] DELETE error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
