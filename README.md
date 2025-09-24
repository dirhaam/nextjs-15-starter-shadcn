# Next.js 15 Starter with Shadcn and Firebase Auth

This is a Next.js 15 starter template with Shadcn UI components and Firebase Authentication.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nextjs-15-starter-shadcn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase Authentication**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Email/Password and Google authentication methods in Firebase
   - Create a Web App in Firebase and get your configuration details

4. **Configure environment variables**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Firebase configuration details:
     ```bash
     NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
     NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
     ```
   - For Firebase Admin SDK (server-side), you'll also need:
     ```bash
     FIREBASE_PROJECT_ID=your-project-id
     FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
     FIREBASE_PRIVATE_KEY=\"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n\"
     ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## Firebase Setup

### For Authentication:
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable Email/Password and Google sign-in methods
3. Add your domain (e.g., localhost) to Authorized domains

### For Firebase Admin (Server-side):
1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate a new private key and add it to your environment variables as FIREBASE_PRIVATE_KEY

## Key Features

- Firebase Authentication (Email/Password and Google Sign-In)
- Shadcn UI components
- Next.js 15 with App Router
- Drizzle ORM with SQLite
- Multi-tenant support
- Responsive design

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## Project Structure

- `src/app/` - Next.js 13+ App Router pages
- `src/components/` - Reusable React components
- `src/lib/` - Utility functions and libraries
  - `src/lib/firebase/` - Firebase client and server initialization
  - `src/lib/auth-service.ts` - Firebase-based auth service
- `src/registry/` - Shadcn UI components