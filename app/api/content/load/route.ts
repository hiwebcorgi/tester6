import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const file = searchParams.get('file');
        const lang = process.env.DEPLOY_LANGUAGE || 'ko';

        if (!file) {
            return NextResponse.json(
                { error: 'Missing file parameter' },
                { status: 400 }
            );
        }

        // Security: only allow files in the content directory
        if (!file.startsWith('content/')) {
            return NextResponse.json(
                { error: 'Invalid file path' },
                { status: 400 }
            );
        }

        // Adjust path to include language
        // e.g. content/home.json -> content/ko/home.json
        const relativePath = file.replace('content/', `content/${lang}/`);

        // Read the file from the file system
        const filePath = path.join(process.cwd(), relativePath);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Load error:', error);

        if (error.code === 'ENOENT') {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
