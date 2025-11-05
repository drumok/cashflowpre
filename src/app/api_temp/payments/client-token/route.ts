import { NextRequest, NextResponse } from 'next/server';
import { generateClientToken } from '@/lib/braintree';
import { auth, isFirebaseAvailable } from '@/lib/firebase-admin';

// Static export compatible

export async function GET(request: NextRequest) {
  try {
    // Check if Firebase is available
    if (!isFirebaseAvailable()) {
      return NextResponse.json(
        { error: 'Authentication service unavailable' },
        { status: 503 }
      );
    }

    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify Firebase token
    const token = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await auth.verifyIdToken(token);
      const userId = decodedToken.uid;

      // Generate Braintree client token
      const clientToken = await generateClientToken(userId);

      return NextResponse.json({ 
        clientToken,
        success: true 
      });
    } catch (authError) {
      console.error('Firebase token verification failed:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

  } catch (error) {
    console.error('Client token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate client token' },
      { status: 500 }
    );
  }
}