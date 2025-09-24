import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import { createD1Db } from '@/lib/db';
import { tenantFeatures, tenants } from '@/lib/db/schema';

import crypto from 'crypto';
import { eq } from 'drizzle-orm';

let db: any;
const d1 = (globalThis as any).D1;
if (d1) {
    db = createD1Db(d1);
} else {
    const { createLocalDb } = await import('@/lib/db/local');
    db = await createLocalDb();
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if ((session.user as any).role !== 'superadmin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if tenant exists
    const tenant = await db.select().from(tenants).where(eq(tenants.id, id)).limit(1);
    if (tenant.length === 0) {
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const features = await db.select().from(tenantFeatures).where(eq(tenantFeatures.tenantId, id));

    return NextResponse.json(features);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if ((session.user as any).role !== 'superadmin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { featureName, isEnabled } = body;

    if (!featureName) {
        return NextResponse.json({ error: 'Missing featureName' }, { status: 400 });
    }

    // Check if tenant exists
    const tenant = await db.select().from(tenants).where(eq(tenants.id, id)).limit(1);
    if (tenant.length === 0) {
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Check if feature already exists for this tenant
    const existing = await db
        .select()
        .from(tenantFeatures)
        .where(eq(tenantFeatures.tenantId, id))
        .where(eq(tenantFeatures.featureName, featureName))
        .limit(1);

    if (existing.length > 0) {
        // Update existing
        const updated = await db
            .update(tenantFeatures)
            .set({
                isEnabled,
                updatedAt: new Date()
            })
            .where(eq(tenantFeatures.id, existing[0].id))
            .returning();

        return NextResponse.json(updated[0], { status: 200 });
    } else {
        // Create new
        const newFeature = await db
            .insert(tenantFeatures)
            .values({
                tenantId: id,
                featureName,
                isEnabled,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            .returning();

        return NextResponse.json(newFeature[0], { status: 201 });
    }
}
