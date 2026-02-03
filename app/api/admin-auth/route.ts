import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        // Get admin password from environment variable
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (password === adminPassword) {
            // Create a simple session token
            const sessionToken = Buffer.from(
                `${Date.now()}-${Math.random()}`
            ).toString('base64');

            // Set cookie with session token - using NextResponse.cookies API
            const response = NextResponse.json({ success: true });

            response.cookies.set('admin-session', sessionToken, {
                httpOnly: true,
                secure: true, // Always use secure in production (Vercel uses HTTPS)
                sameSite: 'none', // Required for cross-site requests in Vercel
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
            });

            return response;
        } else {
            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        // Read cookie directly from request
        const session = request.cookies.get('admin-session');
        
        // Debug logging for production
        console.log('[Admin Auth GET] Cookie check:', {
            hasCookie: !!session,
            cookieValue: session?.value ? 'exists' : 'missing',
            allCookies: request.cookies.getAll().map(c => c.name),
        });

        if (session && session.value) {
            return NextResponse.json({ authenticated: true });
        } else {
            return NextResponse.json({ authenticated: false }, { status: 401 });
        }
    } catch (error) {
        console.error('[Admin Auth GET] Error:', error);
        return NextResponse.json({ authenticated: false }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const response = NextResponse.json({ success: true });
        
        // Delete cookie with same settings as when it was set
        response.cookies.set('admin-session', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 0,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Logout failed' },
            { status: 500 }
        );
    }
}
