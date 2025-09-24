import { NextRequest, NextResponse } from 'next/server';

import { createD1Db } from '@/lib/db';
import { landingPages, tenants, user } from '@/lib/db/schema';

import bcryptjs from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, subdomain, ownerName, ownerEmail, ownerPhone, ownerPassword, businessType, description } = body;

        // Basic validation
        if (!name || !subdomain || !ownerName || !ownerEmail || !ownerPhone || !ownerPassword || !businessType) {
            return NextResponse.json({ error: 'Missing required fields (including ownerPassword)' }, { status: 400 });
        }

        // Validate subdomain format
        if (!/^[a-z0-9]+$/.test(subdomain)) {
            return NextResponse.json(
                { error: 'Subdomain can only contain lowercase letters and numbers' },
                { status: 400 }
            );
        }

        // Validate email format
        if (!/\S+@\S+\.\S+/.test(ownerEmail)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Database setup - require D1 for registration
        const d1 = (globalThis as any).D1;
        if (!d1) {
            return NextResponse.json(
                { error: 'Database not available. D1 binding required for tenant registration.' },
                { status: 500 }
            );
        }
        const db = createD1Db(d1);

        // Check if subdomain already exists
        const existingTenant = await db.select().from(tenants).where(eq(tenants.subdomain, subdomain));
        if (existingTenant.length > 0) {
            return NextResponse.json({ error: 'Subdomain already exists' }, { status: 409 });
        }

        const now = new Date().getTime();
        const hashedPassword = bcryptjs.hashSync(ownerPassword, 10);

        // Insert tenant without id (auto-generate)
        const [tenantRecord] = await db
            .insert(tenants)
            .values({
                name,
                subdomain,
                description: description || null,
                logo: null,
                primaryColor: '#3b82f6',
                secondaryColor: '#6366f1',
                fontFamily: 'Inter',
                currency: 'USD',
                language: 'en',
                timezone: 'UTC',
                createdAt: now,
                updatedAt: now
            } as any)
            .returning({ id: tenants.id });

        const tenantId = tenantRecord.id;

        // Insert user and landing page in transaction (omit ids for auto-generate)
        await db.transaction(async (tx) => {
            // Insert user with hashed password and tenantId
            await tx.insert(user).values({
                email: ownerEmail,
                password: hashedPassword,
                name: ownerName,
                role: 'owner',
                tenantId,
                isActive: true,
                createdAt: now,
                updatedAt: now
            } as any);

            // Insert landing page
            await tx.insert(landingPages).values({
                tenantId,
                template: 'default',
                title: `Book with ${name}`,
                subtitle: 'Professional Services at Your Convenience',
                description: description || 'Schedule your appointments easily with our flexible booking system.',
                images: null,
                videos: null,
                address: null,
                phone: ownerPhone,
                email: ownerEmail,
                isActive: true,
                createdAt: now,
                updatedAt: now
            } as any);
        });

        // TODO: Send welcome email with login credentials

        return NextResponse.json({
            success: true,
            tenant: {
                id: tenantId,
                name,
                subdomain,
                url: `https://${subdomain}.booqing.my.id`
            },
            message: 'Tenant registered successfully. Owner account created.'
        });
    } catch (error) {
        console.error('Tenant registration error:', error);

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
