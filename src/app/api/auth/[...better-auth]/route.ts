// This route is no longer used with Firebase Auth
// All auth operations are handled directly through Firebase SDK
// and the new auth callback endpoint

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Firebase Auth API' });
}

export async function POST() {
  return NextResponse.json({ message: 'Firebase Auth API' });
}
