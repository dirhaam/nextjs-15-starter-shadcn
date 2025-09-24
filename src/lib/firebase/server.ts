import admin from 'firebase-admin';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

// Check if Firebase Admin is already initialized to prevent multiple initializations
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/^"|"$/g, '')
            })
        });
    } catch (error) {
        console.error('Firebase Admin initialization error:', error);
    }
}

export const auth = getAdminAuth();
export { admin };
