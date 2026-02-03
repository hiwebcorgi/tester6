import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 1. 인증 확인
  const session = request.cookies.get('admin-session');
  if (!session) {
    console.error('[Save API] Unauthorized: No admin session cookie');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { file, content, message } = await request.json();

    // 2. 입력 검증
    if (!file || !content) {
      console.error('[Save API] Missing required fields:', { file: !!file, content: !!content });
      return NextResponse.json(
        { error: 'Missing required fields: file, content' },
        { status: 400 }
      );
    }

    // 3. GitHub API 설정
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
    const branch = process.env.GITHUB_BRANCH || 'master';

    if (!owner || !repo || !token) {
      console.error('[Save API] Missing environment variables:', {
        owner: !!owner,
        repo: !!repo,
        token: !!token,
        branch
      });
      return NextResponse.json(
        { error: 'Server configuration error: Missing GitHub credentials' },
        { status: 500 }
      );
    }

    console.log('[Save API] Attempting to save file:', { file, owner, repo, branch });

    // 4. 현재 파일 SHA 가져오기
    const getFileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${file}?ref=${branch}`;
    console.log('[Save API] Fetching file SHA from:', getFileUrl);

    const getResponse = await fetch(getFileUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    let sha = '';
    if (getResponse.ok) {
      const fileData = await getResponse.json();
      sha = fileData.sha;
      console.log('[Save API] File SHA retrieved:', sha);
    } else {
      const errorData = await getResponse.text();
      console.log('[Save API] File not found or error getting SHA:', {
        status: getResponse.status,
        statusText: getResponse.statusText,
        error: errorData
      });
    }

    // 5. 파일 업데이트 또는 생성
    const updateUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${file}`;
    const updatePayload: any = {
      message: message || 'Update content via Visual Editor',
      content: Buffer.from(content).toString('base64'),
      branch,
    };

    if (sha) {
      updatePayload.sha = sha;
    }

    console.log('[Save API] Updating file:', { url: updateUrl, hasSha: !!sha });

    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatePayload),
    });

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      console.error('[Save API] GitHub API Error:', {
        status: updateResponse.status,
        statusText: updateResponse.statusText,
        error
      });
      return NextResponse.json(
        { error: 'Failed to save to GitHub', details: error },
        { status: 500 }
      );
    }

    const result = await updateResponse.json();
    console.log('[Save API] File saved successfully:', result.commit.sha);

    // 6. 로컬 환경인 경우 파일 시스템에도 저장 (개발 편의성)
    if (process.env.NODE_ENV === 'development' || !process.env.VERCEL) {
      try {
        const fs = require('fs/promises');
        const path = require('path');
        const localPath = path.join(process.cwd(), file);

        // Ensure directory exists
        await fs.mkdir(path.dirname(localPath), { recursive: true });
        await fs.writeFile(localPath, content);
        console.log('[Save API] Local file updated:', localPath);
      } catch (localError) {
        console.error('[Save API] Failed to update local file:', localError);
        // GitHub 저장은 성공했으므로 에러를 반환하지는 않음
      }
    }

    // 7. 성공 응답
    return NextResponse.json({
      success: true,
      commitSha: result.commit.sha,
      commitUrl: result.commit.html_url,
    });

  } catch (error: any) {
    console.error('[Save API] Unexpected error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
