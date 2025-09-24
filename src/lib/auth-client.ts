import { auth } from '@/lib/firebase/client';

import { GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

interface AuthResponse {
    data?: any;
    error?: {
        message: string;
    };
}

interface EmailSignInData {
    email: string;
    password: string;
}

// Client-side auth service that wraps Firebase auth
export const authClient = {
    signIn: {
        email: async ({ email, password }: EmailSignInData): Promise<AuthResponse> => {
            try {
                const result = await signInWithEmailAndPassword(auth, email, password);
                const idToken = await result.user.getIdToken();

                // Send token to your API to create session
                const response = await fetch('/api/auth/callback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${idToken}`
                    },
                    body: JSON.stringify({
                        user: {
                            id: result.user.uid,
                            email: result.user.email,
                            name: result.user.displayName
                        }
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to create session');
                }

                const sessionData = await response.json();

                return { data: sessionData };
            } catch (error: any) {
                return { error: { message: error.message } };
            }
        },
        social: async ({ provider }: { provider: 'google' }): Promise<AuthResponse> => {
            try {
                let result;

                if (provider === 'google') {
                    const googleProvider = new GoogleAuthProvider();
                    result = await signInWithPopup(auth, googleProvider);
                } else {
                    throw new Error(`Provider ${provider} not implemented`);
                }

                const idToken = await result.user.getIdToken();

                // Send token to your API to create session
                const response = await fetch('/api/auth/callback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${idToken}`
                    },
                    body: JSON.stringify({
                        user: {
                            id: result.user.uid,
                            email: result.user.email,
                            name: result.user.displayName
                        },
                        provider
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to create session');
                }

                const sessionData = await response.json();

                return { data: sessionData };
            } catch (error: any) {
                return { error: { message: error.message } };
            }
        }
    },
    signOut: async (): Promise<void> => {
        try {
            await auth.signOut();
            // Clear any local sessions
            document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }
};
