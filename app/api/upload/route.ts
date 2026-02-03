import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Optimize image with sharp (convert to WebP)
        const optimizedBuffer = await sharp(buffer)
            .resize({ width: 800, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

        // Generate filename
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').replace(/\.[^/.]+$/, '');
        const filename = `${timestamp}-${safeName}.webp`;

        // Upload to Vercel Blob
        const blob = await put(filename, optimizedBuffer, {
            access: 'public',
            contentType: 'image/webp',
        });

        return NextResponse.json({
            success: true,
            url: blob.url,
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({
            error: 'Upload failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
