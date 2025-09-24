import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import { createD1Db } from '@/lib/db';
import { createLocalDb } from '@/lib/db/local';
import { bookings, services, tenants } from '@/lib/db/schema';

import { eq, sql } from 'drizzle-orm';

let db: any;
const d1 = (globalThis as any).D1;
if (d1) {
    db = createD1Db(d1);
} else {
    db = createLocalDb();
}

export async function GET(request: NextRequest) {
    const session = await auth.api.getSession(request.headers);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if ((session.user as any).role !== 'superadmin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');

    try {
        let query = db
            .select({
                id: bookings.id,
                tenantSubdomain: tenants.subdomain,
                customerName: bookings.customerName,
                serviceName: services.name,
                date: bookings.date,
                time: bookings.time,
                status: bookings.status,
                amount: services.price
            })
            .from(bookings)
            .leftJoin(tenants, eq(bookings.tenantId, tenants.id))
            .leftJoin(services, eq(bookings.serviceId, services.id));

        if (tenantId) {
            query = query.where(eq(bookings.tenantId, tenantId));
        }

        if (status) {
            query = query.where(eq(bookings.status, status));
        }

        if (startDate) {
            query = query.where(sql`${bookings.date} >= ${Number(startDate)}`);
        }

        if (endDate) {
            query = query.where(sql`${bookings.date} <= ${Number(endDate)}`);
        }

        if (search) {
            query = query.where(sql`${bookings.customerName} LIKE ${'%' + search + '%'}`);
        }

        query = query.orderBy(sql`${bookings.createdAt} desc`).limit(100);

        const allBookings = await query;

        return NextResponse.json(allBookings);
    } catch (error) {
        console.error('Bookings query error', error);

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
