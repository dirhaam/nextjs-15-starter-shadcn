import { NextRequest, NextResponse } from 'next/server';

import { verifyIdToken } from '@/lib/auth-service';
import { auth } from '@/lib/firebase/client';

import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

// This API route will handle different auth operations
export async function POST(request: NextRequest) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const operation = pathParts[pathParts.length - 1]; // Get the last part of the path

    try {
        switch (operation) {
            case 'sign-in':
                return await handleSignIn(request);
            case 'sign-out':
                return await handleSignOut(request);
            default:
                return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
        }
    } catch (error) {
        console.error('Auth API error:', error);

        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}

async function handleSignIn(request: NextRequest) {
    const body = await request.json();
    const { method, ...params } = body;

    switch (method) {
        case 'email': {
            const { email, password } = params;
            if (!email || !password) {
                return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
            }

            // Email/password sign in needs to be handled on the client side with Firebase

            return NextResponse.json(
                {
                    error: 'Email/password sign-in must be handled on the client side with Firebase SDK'
                },
                { status: 400 }
            );
        }

        case 'google': {
            // Google sign-in would be handled on the client side too

            return NextResponse.json(
                {
                    error: 'Social sign-in must be handled on the client side with Firebase SDK'
                },
                { status: 400 }
            );
        }

        default: {
            return NextResponse.json({ error: 'Invalid sign-in method' }, { status: 400 });
        }
    }
}

async function handleSignOut(request: NextRequest) {
    // Handle sign out logic
    // For Firebase, typically just clear the client token
    return NextResponse.json({ success: true });
}
