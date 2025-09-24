import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import { createD1Db } from '@/lib/db';
import { createLocalDb } from '@/lib/db/local';
import { tenants } from '@/lib/db/schema';

import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

let db: any;
const d1 = (globalThis as any).D1;
if (d1) {
    db = createD1Db(d1);
} else {
    db = createLocalDb();
}

export async function GET() {
    const session = await auth.api.getSession({ headers: new Headers() });
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if ((session.user as any).role !== 'superadmin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const allTenants = await db.select().from(tenants);

    return NextResponse.json(allTenants);
}

export async function POST(request: NextRequest) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if ((session.user as any).role !== 'superadmin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, subdomain, description, currency = 'USD', language = 'en' } = body;

    if (!name || !subdomain) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if subdomain exists
    const existing = await db.select().from(tenants).where(eq(tenants.subdomain, subdomain));
    if (existing.length > 0) {
        return NextResponse.json({ error: 'Subdomain already exists' }, { status: 409 });
    }

    const newTenant = await db
        .insert(tenants)
        .values({
            id: randomUUID(),
            name,
            subdomain,
            description,
            currency,
            language,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        .returning();

    // Create superadmin user for the tenant? Or handle separately. For now, just tenant.

    return NextResponse.json(newTenant[0], { status: 201 });
}

export async function PUT(request: NextRequest) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if ((session.user as any).role !== 'superadmin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, subdomain, description, currency, language } = body;

    if (!id || !name || !subdomain) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if subdomain exists for other tenant
    const existing = await db.select().from(tenants).where(eq(tenants.subdomain, subdomain));
    if (existing.length > 0 && existing[0].id !== id) {
        return NextResponse.json({ error: 'Subdomain already exists' }, { status: 409 });
    }

    const updatedTenant = await db
        .update(tenants)
        .set({
            name,
            subdomain,
            description,
            currency,
            language,
            updatedAt: new Date()
        })
        .where(eq(tenants.id, id))
        .returning();

    if (updatedTenant.length === 0) {
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTenant[0], { status: 200 });
}

export async function DELETE(request: NextRequest) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if ((session.user as any).role !== 'superadmin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const deletedTenant = await db.delete(tenants).where(eq(tenants.id, id)).returning();

    if (deletedTenant.length === 0) {
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Tenant deleted' }, { status: 200 });
}
