import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // ── Admin routes (existing logic, unchanged) ──
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

    // ── Portal routes: Supabase session refresh ──
    if (path.startsWith('/portal')) {
        let supabaseResponse = NextResponse.next({ request });

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) =>
                            request.cookies.set(name, value)
                        );
                        supabaseResponse = NextResponse.next({ request });
                        cookiesToSet.forEach(({ name, value, options }) =>
                            supabaseResponse.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        // Use getSession() instead of getUser() — reads JWT from cookie locally
        // (instant, no network call). getUser() calls Supabase Auth API on every
        // navigation which adds 200-500ms per page switch.
        const {
            data: { session },
        } = await supabase.auth.getSession();

        const isPublicPortalRoute =
            path === '/portal/login' || path === '/portal/signup';

        if (!session && !isPublicPortalRoute) {
            // Not logged in → redirect to portal login
            const url = request.nextUrl.clone();
            url.pathname = '/portal/login';
            return NextResponse.redirect(url);
        }

        if (session && isPublicPortalRoute) {
            // Already logged in → redirect to portal entry
            const url = request.nextUrl.clone();
            url.pathname = '/portal';
            return NextResponse.redirect(url);
        }

        return supabaseResponse;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/portal/:path*'],
};
