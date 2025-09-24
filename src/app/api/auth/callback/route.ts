import { NextRequest, NextResponse } from 'next/server';

import { signInWithGoogle, verifyIdToken } from '@/lib/auth-service';
import { createLocalDb } from '@/lib/db/local';
import { user } from '@/lib/db/schema';

import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
        }

        const idToken = authHeader.substring(7); // Remove 'Bearer ' prefix
        const decodedToken = await verifyIdToken(idToken);

        if (!decodedToken) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // Get database instance
        const db = createLocalDb();

        // Check if user exists in database, if not create one
        const dbUser = await db.select().from(user).where(eq(user.id, decodedToken.uid)).limit(1);

        let userData;
        if (!dbUser.length) {
            // Create user in database if doesn't exist
            const newUser = {
                id: decodedToken.uid,
                email: decodedToken.email || '',
                name: decodedToken.name || '',
                role: 'user',
                tenantId: 'global', // Default tenant
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await db.insert(user).values(newUser);
            userData = newUser;
        } else {
            userData = dbUser[0];
        }

        // Create a session response with user data

        return NextResponse.json({
            user: userData,
            token: idToken,
            sessionId: nanoid() // Create session identifier
        });
    } catch (error) {
        console.error('Auth callback error:', error);

        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}
