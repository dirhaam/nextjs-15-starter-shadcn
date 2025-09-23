import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, subdomain, ownerName, ownerEmail, ownerPhone, businessType, description } = body;

        // Basic validation
        if (!name || !subdomain || !ownerName || !ownerEmail || !ownerPhone || !businessType) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
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
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // TODO: Check if subdomain already exists in database
        // const existingTenant = await db.select().from(tenants).where(eq(tenants.subdomain, subdomain));
        // if (existingTenant.length > 0) {
        //     return NextResponse.json(
        //         { error: 'Subdomain already exists' },
        //         { status: 409 }
        //     );
        // }

        // TODO: Create tenant in database
        const tenantId = `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Mock tenant creation
        const newTenant = {
            id: tenantId,
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
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Mock owner user creation
        const newUser = {
            id: userId,
            email: ownerEmail,
            name: ownerName,
            role: 'owner',
            tenantId: tenantId,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Mock landing page creation
        const newLandingPage = {
            id: `landing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            tenantId: tenantId,
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
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // TODO: Save to database
        // await db.transaction(async (tx) => {
        //     await tx.insert(tenants).values(newTenant);
        //     await tx.insert(users).values(newUser);
        //     await tx.insert(landingPages).values(newLandingPage);
        // });

        // TODO: Send welcome email
        // await sendWelcomeEmail(ownerEmail, {
        //     tenantName: name,
        //     subdomain: subdomain,
        //     ownerName: ownerName
        // });

        console.log('Mock tenant registration:', {
            tenant: newTenant,
            user: newUser,
            landingPage: newLandingPage
        });

        return NextResponse.json({
            success: true,
            tenant: {
                id: tenantId,
                name,
                subdomain,
                url: `https://${subdomain}.booqing.my.id`
            },
            message: 'Tenant registered successfully'
        });

    } catch (error) {
        console.error('Tenant registration error:', error);

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}