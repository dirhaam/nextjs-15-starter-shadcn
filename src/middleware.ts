import { NextRequest, NextResponse } from 'next/server';

import { createD1Db } from '@/lib/db';
import { tenants, user } from '@/lib/db/schema';

import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || '';
    const url = request.nextUrl;
    const authHeader = request.headers.get('authorization');

    // Handle localhost development
    const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

    if (isLocalhost) {
        const response = NextResponse.next();
        response.headers.set('x-tenant-id', 'global'); // For localhost admin

        // For localhost, allow direct access to admin and tenant routes
        if (url.pathname.startsWith('/admin')) {
            // Check auth for admin routes
            if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') {
                // In development, we'll allow access without validating token
                // In production, you'd verify the Firebase token
                response.headers.set('x-user-role', 'admin');
                response.headers.set('x-user-id', 'dev-user');
            }

            return response;
        }

        // Check for tenant routes on localhost (e.g., localhost/tenant/subdomain)
        if (url.pathname.startsWith('/tenant/')) {
            const subdomain = url.pathname.split('/')[2]; // Extract subdomain from /tenant/subdomain
            if (subdomain) {
                // In local dev, assume all subdomains are valid; no DB query to avoid Edge runtime issues
                response.headers.set('x-tenant-id', `local-${subdomain}`);
                response.headers.set('x-tenant-subdomain', subdomain);

                return response;
            }
        }

        // For localhost, allow access to the main landing page
        if (url.pathname === '/' || url.pathname === '') {
            return response;
        }

        return response;
    }

    // Production logic for booqing.my.id
    if (hostname === 'booqing.my.id' || hostname.startsWith('booqing.')) {
        // For admin paths, check authentication
        if (url.pathname.startsWith('/admin')) {
            if (url.pathname === '/admin/login' || url.pathname === '/admin') {
                // Allow access to login page without authentication
                const response = NextResponse.next();

                return response;
            }

            // Verify Firebase token for protected admin routes
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }

            const token = authHeader.substring(7); // Remove 'Bearer ' prefix

            // Edge-compatible Firebase ID token verification
            let decodedToken: any = null;
            try {
                const header = jwt.decode(token, { complete: true }) as any;
                if (!header || !header.header || !header.header.kid) {
                    throw new Error('Invalid token header');
                }

                const kid = header.header.kid;
                const keysResponse = await fetch(
                    'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
                );
                if (!keysResponse.ok) {
                    throw new Error('Failed to fetch public keys');
                }
                const keys = await keysResponse.json();
                const publicKey = keys[kid];
                if (!publicKey) {
                    throw new Error('Public key not found');
                }

                decodedToken = (await jwt.verify(token, publicKey, {
                    audience: process.env.FIREBASE_PROJECT_ID,
                    issuer: `https://securetoken.google.com/${process.env.FIREBASE_PROJECT_ID}`,
                    maxAge: '1h', // Adjust as needed
                    algorithms: ['RS256']
                })) as any;
            } catch (error) {
                console.error('Token verification failed:', error);

                return NextResponse.redirect(new URL('/admin/login', request.url));
            }

            if (!decodedToken) {
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }

            // Get user role from database using D1 (edge-compatible)
            const d1 = (globalThis as any).D1;
            if (!d1) {
                // In dev/local, D1 not available, but since isLocalhost already handled, this shouldn't reach here
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }
            const db = createD1Db(d1);
            const dbUser = await db
                .select({ role: user.role, tenantId: user.tenantId })
                .from(user)
                .where(eq(user.id, decodedToken.uid))
                .limit(1);

            if (!dbUser.length) {
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }

            const response = NextResponse.next();
            response.headers.set('x-tenant-id', dbUser[0].tenantId || 'global');
            response.headers.set('x-user-role', dbUser[0].role);
            response.headers.set('x-user-id', decodedToken.uid);

            return response;
        }

        const response = NextResponse.next();
        response.headers.set('x-tenant-id', 'global'); // For admin/global access
        if (url.pathname === '/') {
            return response;
        }
        // Redirect to admin if not admin path

        return NextResponse.redirect(new URL('/admin', request.url));
    }

    // For tenant subdomains: tenant.booqing.my.id
    const subdomain = hostname.split('.')[0];
    if (subdomain && subdomain !== 'www' && subdomain !== 'booqing') {
        const d1 = (globalThis as any).D1;
        if (!d1) {
            return NextResponse.redirect(new URL('https://booqing.my.id/admin', request.url));
        }
        const db = createD1Db(d1);
        // Query tenant by subdomain
        const tenantRecord = await db.select().from(tenants).where(eq(tenants.subdomain, subdomain)).limit(1);
        if (tenantRecord.length === 0) {
            return NextResponse.redirect(new URL('https://booqing.my.id/admin', request.url));
        }
        const tenantId = tenantRecord[0].id;

        // Rewrite to tenant page
        const tenantUrl = request.nextUrl.clone();
        tenantUrl.pathname = `/tenant/${subdomain}${url.pathname}`;
        const response = NextResponse.rewrite(tenantUrl);
        response.headers.set('x-tenant-subdomain', subdomain);
        response.headers.set('x-tenant-id', tenantId);

        return response;
    }

    // Default: redirect to admin
    return NextResponse.redirect(new URL('https://booqing.my.id', request.url));
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
};
