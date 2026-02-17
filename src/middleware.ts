import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // ── Admin routes ──
    if (path.startsWith('/admin')) {
        const isProtectedPath = path !== '/admin/login';

        if (isProtectedPath) {
            const token = request.cookies.get('flo-admin-token')?.value;
            if (token !== 'authenticated') {
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }
        }

        if (path === '/admin/login') {
            const token = request.cookies.get('flo-admin-token')?.value;
            if (token === 'authenticated') {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
        }

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
