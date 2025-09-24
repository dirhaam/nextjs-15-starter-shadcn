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
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if ((session.user as any).role !== 'superadmin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    try {
        let revenueQuery = db
            .select({
                total: sql<number>`sum(${services.price})`,
                count: sql<number>`count(*)`
            })
            .from(bookings)
            .innerJoin(services, eq(bookings.serviceId, services.id))
            .where(sql`${bookings.status} = 'completed'`);

        let bookingsQuery = db
            .select()
            .from(bookings)
            .where(sql`${bookings.status} = 'completed'`);

        if (tenantId) {
            revenueQuery = revenueQuery.where(eq(bookings.tenantId, tenantId));
            bookingsQuery = bookingsQuery.where(eq(bookings.tenantId, tenantId));
        }

        const revenueResult = await revenueQuery;
        const bookingsResult = await bookingsQuery;

        const totalRevenue = Number(revenueResult[0]?.total) || 0;
        const totalBookings = bookingsResult.length;

        // Monthly breakdown (group by month)
        const monthlyRevenue = await db
            .select({
                month: sql<string>`strftime('%Y-%m', datetime(${bookings.date}))`,
                total: sql<number>`sum(${services.price})`
            })
            .from(bookings)
            .innerJoin(services, eq(bookings.serviceId, services.id))
            .where(sql`${bookings.status} = 'completed'`)
            .groupBy(sql`strftime('%Y-%m', datetime(${bookings.date}))`)
            .orderBy(sql`strftime('%Y-%m', datetime(${bookings.date}))`);

        const data = {
            totalRevenue,
            totalBookings,
            averageRevenuePerBooking: totalBookings > 0 ? totalRevenue / totalBookings : 0,
            monthlyRevenue: monthlyRevenue.map((row: any) => ({
                month: row.month,
                total: Number(row.total) || 0
            })),
            bookings: bookingsResult
        };

        return NextResponse.json(data);
    } catch (error) {
        console.error('Reports query error', error);

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
