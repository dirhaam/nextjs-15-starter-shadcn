// Firebase-based auth utility functions
import { auth } from '@/lib/firebase/server';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createLocalDb } from '@/lib/db/local';
import { user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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
  const token = request.headers.get('authorization')?.split(' ')[1] ||
                cookies().get('session')?.value;

  if (!token) {
    return null;
  }

  const decodedToken = await verifyIdToken(token);
  if (!decodedToken) {

    return null;
  }

  // Fetch user from database to get additional fields like tenantId, role
  const db = getDb();
  const dbUser = await db
    .select()
    .from(user)
    .where(eq(user.id, decodedToken.uid))
    .limit(1);

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
      tenantId: dbUser[0].tenantId,
    },
    sessionId: decodedToken.uid, // Use uid as session identifier
  };
}

// Alternative getSession for API routes using headers
export async function getSessionFromHeaders(headers: Headers) {
  const token = headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return null;
  }

  const decodedToken = await verifyIdToken(token);
  if (!decodedToken) {

    return null;
  }

  // Fetch user from database to get additional fields like tenantId, role
  const db = getDb();
  const dbUser = await db
    .select()
    .from(user)
    .where(eq(user.id, decodedToken.uid))
    .limit(1);

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
      tenantId: dbUser[0].tenantId,
    },
    sessionId: decodedToken.uid,
  };
}

// Named API object for consistency with original usage
export const auth = {
  api: {
    getSession: getSessionFromHeaders,
  }
};
