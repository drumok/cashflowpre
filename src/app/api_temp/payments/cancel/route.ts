import { NextRequest, NextResponse } from 'next/server';
import { cancelSubscription } from '@/lib/braintree';
import { auth, db, isFirebaseAvailable } from '@/lib/firebase-admin';

// Static export compatible

export async function POST(request: NextRequest) {
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
    let userId: string;
    try {
      const decodedToken = await auth.verifyIdToken(token);
      userId = decodedToken.uid;
    } catch (authError) {
      console.error('Firebase token verification failed:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data()!;
    const subscription = userData.subscription;

    if (!subscription?.braintreeSubscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      );
    }

    // Cancel subscription in Braintree
    const canceledSubscription = await cancelSubscription(subscription.braintreeSubscriptionId);

    // Update user subscription in Firestore
    await db.collection('users').doc(userId).update({
      subscription: {
        ...subscription,
        status: 'canceled',
        canceledAt: new Date(),
        updatedAt: new Date(),
      },
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: canceledSubscription.id,
        status: canceledSubscription.status,
      }
    });

  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}