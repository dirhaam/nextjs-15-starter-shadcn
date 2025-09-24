import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { createLocalDb } from '@/lib/db/local';
import { user } from '@/lib/db/schema';
import { auth } from '@/lib/firebase/server';

import { and, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// Helper to create database instance
function getDb() {
    const d1 = (globalThis as any).D1;
    if (d1) {
        // TODO: Implement D1 connection when needed
        // For now, using local DB
        return createLocalDb();
    } else {
        return createLocalDb();
    }
}

// Create session token
export async function createSession(userId: string, tenantId: string = 'global') {
    const db = getDb();
    const sessionId = nanoid();

    // In a real implementation, you'd store session data in your database
    // For Firebase auth, we primarily rely on Firebase's ID tokens
    return sessionId;
}

// Verify Firebase ID token
export async function verifyIdToken(token: string) {
    try {
        const decodedToken = await auth.verifyIdToken(token);

        return decodedToken;
    } catch (error) {
        console.error('Error verifying Firebase ID token:', error);

        return null;
    }
}

// Get current session
export async function getSession(request: NextRequest) {
    const token = request.headers.get('authorization')?.split(' ')[1] || request.cookies.get('session')?.value;

    if (!token) {
        return null;
    }

    const decodedToken = await verifyIdToken(token);
    if (!decodedToken) {
        return null;
    }

    // Fetch user from database to get additional fields like tenantId, role
    const db = getDb();
    const dbUser = await db.select().from(user).where(eq(user.id, decodedToken.uid)).limit(1);

    if (!dbUser.length) {
        return null;
    }

    return {
        user: {
            ...decodedToken,
            id: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name,
            role: dbUser[0].role,
            tenantId: dbUser[0].tenantId
        },
        sessionId: decodedToken.uid // Use uid as session identifier
    };
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
    // Note: For actual Firebase email/password auth, you'd handle this on the client side
    // and then verify the token on the server. This is a placeholder for integration purposes.
    throw new Error('Email/password sign-in needs to be handled on the client side with Firebase SDK');
}

// Sign in with Google (handled via Firebase UI or client SDK)
export async function signInWithGoogle(credential: string) {
    // Google sign-in would normally be handled via Firebase client SDK
    // This function would verify the credential on the server
    try {
        const decodedToken = await auth.verifyIdToken(credential);
        const db = getDb();

        // Check if user exists in database, if not create one
        let dbUser = await db.select().from(user).where(eq(user.id, decodedToken.uid)).limit(1);

        if (!dbUser.length) {
            // Create user in database if doesn't exist
            const newUser = {
                id: decodedToken.uid,
                email: decodedToken.email as string,
                name: decodedToken.name as string,
                password: null,
                role: 'user',
                tenantId: 'global', // Default tenant
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await db.insert(user).values(newUser);
            dbUser = [newUser];
        }

        return {
            user: dbUser[0],
            token: credential
        };
    } catch (error) {
        console.error('Error signing in with Google:', error);

        throw error;
    }
}

// Sign out
export async function signOut(token: string) {
    try {
        // In Firebase, you typically just revoke the client token
        // Server-side cleanup would involve blacklisting tokens if needed
        return true;
    } catch (error) {
        console.error('Error signing out:', error);

        return false;
    }
}
