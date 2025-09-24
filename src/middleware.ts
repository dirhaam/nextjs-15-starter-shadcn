import { NextRequest, NextResponse } from 'next/server';

import { createD1Db } from '@/lib/db';
import { tenants } from '@/lib/db/schema';

import { eq } from 'drizzle-orm';

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || '';
    const url = request.nextUrl;

    // Handle localhost development
    const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

    if (isLocalhost) {
        const response = NextResponse.next();
        response.headers.set('x-tenant-id', 'global'); // For localhost admin

        // For localhost, allow direct access to admin and tenant routes
        if (url.pathname.startsWith('/admin')) {
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
        const response = NextResponse.next();
        response.headers.set('x-tenant-id', 'global'); // For admin/global access
        if (url.pathname.startsWith('/admin') || url.pathname === '/') {
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
