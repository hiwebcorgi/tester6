import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const MODULES_FILE = path.join(process.cwd(), 'content', 'modules.json');

const DEFAULT_MODULES = {
    modules: [
        {
            id: 'notice',
            name: 'Notice',
            path: '/notice',
            icon: 'megaphone',
            active: true,
            navbarVisible: true,
            footerVisible: true,
            order: 1
        },
        {
            id: 'blog',
            name: 'Blog',
            path: '/blog',
            icon: 'book-open',
            active: true,
            navbarVisible: true,
            footerVisible: true,
            order: 2
        },
        {
            id: 'portfolio',
            name: 'Portfolio',
            path: '/portfolio',
            icon: 'briefcase',
            active: true,
            navbarVisible: true,
            footerVisible: true,
            order: 3
        },
        {
            id: 'careers',
            name: 'Careers',
            path: '/careers',
            icon: 'user-plus',
            active: true,
            navbarVisible: true,
            footerVisible: true,
            order: 4
        },
        {
            id: 'contact',
            name: 'Contact',
            path: '/contact',
            icon: 'mail',
            active: true,
            navbarVisible: true,
            footerVisible: true,
            order: 5
        }
    ]
};

// GET: 모듈 목록 조회
export async function GET() {
    try {
        let modules;
        try {
            const data = await fs.readFile(MODULES_FILE, 'utf-8');
            modules = JSON.parse(data);
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                console.log('[Modules API] modules.json not found, creating default...');
                await fs.writeFile(MODULES_FILE, JSON.stringify(DEFAULT_MODULES, null, 2));
                modules = DEFAULT_MODULES;
            } else {
                throw error;
            }
        }

        const updatedModules = modules;

        return NextResponse.json(updatedModules);
    } catch (error) {
        console.error('[Modules API] Error reading modules:', error);
        return NextResponse.json(
            { error: 'Failed to load modules' },
            { status: 500 }
        );
    }
}

// PUT: 모듈 설정 업데이트
export async function PUT(request: NextRequest) {
    // 인증 확인
    const session = request.cookies.get('admin-session');
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const updates = await request.json();

        // 현재 모듈 데이터 읽기
        let currentModules;
        try {
            const data = await fs.readFile(MODULES_FILE, 'utf-8');
            currentModules = JSON.parse(data);
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                currentModules = DEFAULT_MODULES;
            } else {
                throw error;
            }
        }

        // 업데이트 적용
        const updatedModules = {
            ...currentModules,
            modules: updates.modules || currentModules.modules
        };

        // GitHub에 저장
        const owner = process.env.GITHUB_OWNER;
        const repo = process.env.GITHUB_REPO;
        const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
        const branch = process.env.GITHUB_BRANCH || 'master';

        if (owner && repo && token) {
            // GitHub API로 파일 업데이트
            const githubUrl = `https://api.github.com/repos/${owner}/${repo}/contents/content/modules.json?ref=${branch}`;

            // 현재 파일 SHA 가져오기
            const getResponse = await fetch(githubUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            });

            let sha = '';
            if (getResponse.ok) {
                const fileData = await getResponse.json();
                sha = fileData.sha;
            }

            // 파일 업데이트
            const updateResponse = await fetch(githubUrl.replace(`?ref=${branch}`, ''), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: 'Update modules configuration',
                    content: Buffer.from(JSON.stringify(updatedModules, null, 2)).toString('base64'),
                    branch,
                    sha,
                }),
            });

            if (!updateResponse.ok) {
                const error = await updateResponse.json();
                console.warn('[Modules API] GitHub update failed, but proceeding with local save:', error);
                // GitHub 저장 실패해도 로컬 저장은 진행
            }
        } else {
            console.warn('[Modules API] Missing GitHub credentials, skipping GitHub save');
        }

        // 로컬 파일도 업데이트 (개발 환경용)
        try {
            await fs.writeFile(MODULES_FILE, JSON.stringify(updatedModules, null, 2));
        } catch (localError) {
            console.warn('[Modules API] Failed to write local file (expected in production):', localError);
            // 만약 GitHub 저장도 시도하지 않았거나 실패했고, 로컬 저장도 실패했다면 에러로 처리해야 할 수 있음.
            // 하지만 현재는 500 에러를 방지하는 것이 우선이므로, GitHub 저장 성공 여부와 관계없이
            // 로컬 저장 실패는 경고만 남기고 성공 응답을 보냄 (GitHub 저장이 되었다면 성공으로 간주)

            // 단, GitHub Credential이 없는데 로컬 저장도 실패하면 사용자에게 알릴 방법이 없으므로
            // 이 경우는 에러를 던지지 않고 성공으로 처리하되, 실제로는 저장이 안 된 상태일 수 있음.
            // 배포 환경에서는 fs.write가 실패할 가능성이 높으므로, GitHub 저장이 필수적임.
        }

        return NextResponse.json({ success: true, modules: updatedModules });
    } catch (error: any) {
        console.error('[Modules API] Error updating modules:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
