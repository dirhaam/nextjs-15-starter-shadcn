import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import { createD1Db } from '@/lib/db';
import { createLocalDb } from '@/lib/db/local';
import { bookings, services, tenantFeatures, tenants } from '@/lib/db/schema';

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

    try {
        // Total tenants
        const totalTenantsResult = await db.select({ count: sql<number>`count(*)` }).from(tenants);
        const totalTenants = Number(totalTenantsResult[0].count);

        // Active bookings (status not cancelled)
        const activeBookingsResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(bookings)
            .where(sql`${bookings.status} != 'cancelled'`);
        const activeBookings = Number(activeBookingsResult[0].count);

        // Total revenue (sum of services.price for completed bookings)
        const totalRevenueResult = await db
            .select({ sum: sql<number>`sum(${services.price})` })
            .from(bookings)
            .innerJoin(services, eq(bookings.serviceId, services.id))
            .where(sql`${bookings.status} = 'completed'`);
        const totalRevenue = Number(totalRevenueResult[0].sum) || 0;

        // Premium tenants (have at least one enabled premium feature)
        const premiumTenantsResult = await db
            .select({ count: sql<number>`count(distinct tf.tenant_id)` })
            .from(tenantFeatures)
            .where(sql`${tenantFeatures.isEnabled} = 1`);
        const premiumTenants = Number(premiumTenantsResult[0].count);

        // Monthly growth (tenants created this month vs last month)
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const thisMonthTenantsResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(tenants)
            .where(sql`${tenants.createdAt} >= ${Math.floor(thisMonthStart.getTime() / 1000)}`);
        const thisMonthTenants = Number(thisMonthTenantsResult[0].count);
        const lastMonthTenantsResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(tenants)
            .where(
                sql`${tenants.createdAt} >= ${Math.floor(lastMonthStart.getTime() / 1000)} AND ${tenants.createdAt} < ${Math.floor(thisMonthStart.getTime() / 1000)}`
            );
        const lastMonthTenants = Number(lastMonthTenantsResult[0].count);
        const monthlyGrowth =
            lastMonthTenants > 0 ? ((thisMonthTenants - lastMonthTenants) / lastMonthTenants) * 100 : 0;

        // Avg bookings per tenant
        const avgBookingsPerTenant = totalTenants > 0 ? activeBookings / totalTenants : 0;

        // Recent bookings (last 10, with joins)
        const recentBookings = await db
            .select({
                id: bookings.id,
                tenantSubdomain: tenants.subdomain,
                customerName: bookings.customerName,
                serviceName: services.name,
                amount: services.price,
                date: bookings.date,
                status: bookings.status
            })
            .from(bookings)
            .leftJoin(tenants, eq(bookings.tenantId, tenants.id))
            .leftJoin(services, eq(bookings.serviceId, services.id))
            .orderBy(sql`${bookings.createdAt} desc`)
            .limit(10);

        return NextResponse.json({
            totalTenants,
            activeBookings,
            totalRevenue,
            premiumTenants,
            monthlyGrowth,
            avgBookingsPerTenant,
            recentBookings
        });
    } catch (error) {
        console.error('Dashboard query error', error);

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
