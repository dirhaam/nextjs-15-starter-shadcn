import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import { createD1Db } from '@/lib/db';
import { createLocalDb } from '@/lib/db/local';
import { tenants, userRoles, user as userTable } from '@/lib/db/schema';

import { randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm';

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
        let query = db.select().from(userTable);
        if (tenantId) {
            query = query.where(eq(userTable.tenantId, tenantId));
        }

        const allUsers = await query;

        return NextResponse.json(allUsers);
    } catch (error) {
        console.error('Users query error', error);

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
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
    const { email, password, name, tenantId, role = 'user' } = body;

    if (!email || !tenantId) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existing = await db.select().from(userTable).where(eq(userTable.email, email));
    if (existing.length > 0) {
        return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Check if tenant exists
    const tenant = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
    if (tenant.length === 0) {
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Create user via Better Auth
    const user = await (auth as any).user.create({
        email,
        password,
        name,
        tenantId,
        role
    });

    // Add to user_roles if not superadmin tenant
    if (role !== 'superadmin') {
        await db.insert(userRoles).values({
            id: randomUUID(),
            userId: user.id,
            tenantId,
            role,
            permissions: JSON.stringify([]), // Default empty permissions
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    return NextResponse.json(user, { status: 201 });
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
    const { id, email, name, role, tenantId } = body;

    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    // Update user via Better Auth
    const updatedUser = await (auth as any).user.update({
        id,
        email,
        name,
        role
    });

    // Update user_roles if tenantId changed
    if (tenantId) {
        await db
            .update(userRoles)
            .set({
                tenantId,
                role,
                updatedAt: new Date()
            })
            .where(eq(userRoles.userId, id));
    }

    return NextResponse.json(updatedUser, { status: 200 });
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

    // Delete user via Better Auth
    await (auth as any).user.delete({
        id
    });

    // Delete from user_roles
    await db.delete(userRoles).where(eq(userRoles.userId, id));

    return NextResponse.json({ message: 'User deleted' }, { status: 200 });
}
