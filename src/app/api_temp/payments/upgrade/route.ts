import { NextRequest, NextResponse } from 'next/server';
import { updateSubscription, SUBSCRIPTION_PLANS } from '@/lib/braintree';
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

    // Get request body
    const body = await request.json();
    const { newPlanId } = body;

    if (!newPlanId) {
      return NextResponse.json(
        { error: 'New plan ID is required' },
        { status: 400 }
      );
    }

    // Validate new plan
    const newPlan = Object.values(SUBSCRIPTION_PLANS).find(p => p.id === newPlanId);
    if (!newPlan || newPlanId === 'free') {
      return NextResponse.json(
        { error: 'Invalid subscription plan' },
        { status: 400 }
      );
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
    const currentSubscription = userData.subscription;

    if (!currentSubscription?.braintreeSubscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      );
    }

    // Update subscription in Braintree
    const updatedSubscription = await updateSubscription(
      currentSubscription.braintreeSubscriptionId,
      newPlan.braintreePlanId!
    );

    // Update user subscription in Firestore
    await db.collection('users').doc(userId).update({
      subscription: {
        ...currentSubscription,
        planId: newPlanId,
        status: updatedSubscription.status,
        nextBillingDate: updatedSubscription.nextBillingDate,
        price: newPlan.price,
        currency: newPlan.currency,
        limits: newPlan.limits,
        updatedAt: new Date(),
      },
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        planId: newPlanId,
        nextBillingDate: updatedSubscription.nextBillingDate,
      }
    });

  } catch (error) {
    console.error('Subscription upgrade error:', error);
    return NextResponse.json(
      { error: 'Failed to upgrade subscription' },
      { status: 500 }
    );
  }
}