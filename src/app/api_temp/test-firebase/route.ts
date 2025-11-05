import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test Firebase REST API
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    
    if (!apiKey || !projectId) {
      return NextResponse.json({
        error: 'Firebase configuration missing',
        apiKey: !!apiKey,
        projectId: !!projectId
      }, { status: 500 });
    }

    // Test Firebase Auth REST API
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: `test${Date.now()}@example.com`,
          password: 'testpassword123',
          returnSecureToken: true
        })
      }
    );

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Firebase REST API is working',
        userId: data.localId
      });
    } else {
      return NextResponse.json({
        error: 'Firebase REST API error',
        details: data,
        status: response.status
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    config: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Missing',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Missing',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Set' : 'Missing',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? 'Set' : 'Missing',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? 'Set' : 'Missing',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'Set' : 'Missing',
    },
    values: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    }
  });
}