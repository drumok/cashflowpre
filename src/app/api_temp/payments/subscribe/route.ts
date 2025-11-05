import { NextRequest, NextResponse } from 'next/server';
import { createCustomer, createSubscription, SUBSCRIPTION_PLANS } from '@/lib/braintree';
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
    const { paymentMethodNonce, planId, userInfo } = body;

    if (!paymentMethodNonce || !planId) {
      return NextResponse.json(
        { error: 'Payment method and plan ID are required' },
        { status: 400 }
      );
    }

    // Validate plan
    const plan = Object.values(SUBSCRIPTION_PLANS).find(p => p.id === planId);
    if (!plan || planId === 'free') {
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

    // Create or update Braintree customer
    let customer;
    try {
      customer = await createCustomer({
        id: userId,
        firstName: userData.displayName?.split(' ')[0] || 'User',
        lastName: userData.displayName?.split(' ').slice(1).join(' ') || '',
        email: userData.email,
      });
    } catch (error) {
      // Customer might already exist, that's okay
      console.log('Customer creation note:', error);
    }

    // Create subscription
    const subscription = await createSubscription({
      paymentMethodToken: paymentMethodNonce,
      planId: plan.braintreePlanId!,
      customerId: userId,
    });

    // Update user subscription in Firestore
    await db.collection('users').doc(userId).update({
      subscription: {
        planId: planId,
        braintreeSubscriptionId: subscription.id,
        status: subscription.status,
        nextBillingDate: subscription.nextBillingDate,
        price: plan.price,
        currency: plan.currency,
        limits: plan.limits,
        updatedAt: new Date(),
      },
      updatedAt: new Date(),
    });

    // Reset usage counters for new subscription
    await db.collection('users').doc(userId).update({
      usage: {
        analyticsRuns: 0,
        leadsGenerated: 0,
        dataUploadedMB: 0,
        lastResetDate: new Date(),
      }
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        planId: planId,
        nextBillingDate: subscription.nextBillingDate,
      }
    });

  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}