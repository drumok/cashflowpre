import { NextRequest, NextResponse } from 'next/server';
import getGateway from '@/lib/braintree';
import { db, isFirebaseAvailable } from '@/lib/firebase-admin';

// Static export compatible

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase is available
    if (!isFirebaseAvailable()) {
      console.warn('Firebase not available - webhook processing skipped');
      return NextResponse.json({ success: true, message: 'Firebase unavailable' });
    }

    // Get webhook notification from Braintree
    const body = await request.text();
    const gateway = getGateway();
    const webhookNotification = gateway.webhookNotification.parse(
      body,
      request.headers.get('bt-signature') || ''
    );

    console.log('Webhook received:', webhookNotification.kind);

    // Handle different webhook events
    switch (webhookNotification.kind) {
      case 'subscription_charged_successfully':
        await handleSubscriptionCharged(webhookNotification.subscription);
        break;

      case 'subscription_charged_unsuccessfully':
        await handleSubscriptionChargedUnsuccessfully(webhookNotification.subscription);
        break;

      case 'subscription_canceled':
        await handleSubscriptionCanceled(webhookNotification.subscription);
        break;

      case 'subscription_expired':
        await handleSubscriptionExpired(webhookNotification.subscription);
        break;

      case 'subscription_went_past_due':
        await handleSubscriptionPastDue(webhookNotification.subscription);
        break;

      default:
        console.log('Unhandled webhook event:', webhookNotification.kind);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCharged(subscription: any) {
  try {
    if (!isFirebaseAvailable()) {
      console.warn('Firebase not available - skipping subscription charged handling');
      return;
    }

    // Find user by Braintree subscription ID
    const usersSnapshot = await db.collection('users')
      .where('subscription.braintreeSubscriptionId', '==', subscription.id)
      .get();

    if (usersSnapshot.empty) {
      console.error('User not found for subscription:', subscription.id);
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;

    // Reset usage counters for new billing period
    await db.collection('users').doc(userId).update({
      'subscription.status': 'active',
      'subscription.nextBillingDate': subscription.nextBillingDate,
      'subscription.updatedAt': new Date(),
      'usage.analyticsRuns': 0,
      'usage.leadsGenerated': 0,
      'usage.dataUploadedMB': 0,
      'usage.lastResetDate': new Date(),
      updatedAt: new Date(),
    });

    console.log('Subscription charged successfully for user:', userId);

  } catch (error) {
    console.error('Error handling subscription charged:', error);
  }
}

async function handleSubscriptionChargedUnsuccessfully(subscription: any) {
  try {
    if (!isFirebaseAvailable()) {
      console.warn('Firebase not available - skipping subscription charge failure handling');
      return;
    }

    // Find user by Braintree subscription ID
    const usersSnapshot = await db.collection('users')
      .where('subscription.braintreeSubscriptionId', '==', subscription.id)
      .get();

    if (usersSnapshot.empty) {
      console.error('User not found for subscription:', subscription.id);
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;

    // Update subscription status
    await db.collection('users').doc(userId).update({
      'subscription.status': 'past_due',
      'subscription.updatedAt': new Date(),
      updatedAt: new Date(),
    });

    console.log('Subscription charge failed for user:', userId);

  } catch (error) {
    console.error('Error handling subscription charge failure:', error);
  }
}

async function handleSubscriptionCanceled(subscription: any) {
  try {
    if (!isFirebaseAvailable()) {
      console.warn('Firebase not available - skipping subscription cancellation handling');
      return;
    }

    // Find user by Braintree subscription ID
    const usersSnapshot = await db.collection('users')
      .where('subscription.braintreeSubscriptionId', '==', subscription.id)
      .get();

    if (usersSnapshot.empty) {
      console.error('User not found for subscription:', subscription.id);
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;

    // Update subscription to canceled and revert to free plan
    await db.collection('users').doc(userId).update({
      'subscription.status': 'canceled',
      'subscription.planId': 'free',
      'subscription.canceledAt': new Date(),
      'subscription.updatedAt': new Date(),
      updatedAt: new Date(),
    });

    console.log('Subscription canceled for user:', userId);

  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

async function handleSubscriptionExpired(subscription: any) {
  try {
    if (!isFirebaseAvailable()) {
      console.warn('Firebase not available - skipping subscription expiration handling');
      return;
    }

    // Find user by Braintree subscription ID
    const usersSnapshot = await db.collection('users')
      .where('subscription.braintreeSubscriptionId', '==', subscription.id)
      .get();

    if (usersSnapshot.empty) {
      console.error('User not found for subscription:', subscription.id);
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;

    // Update subscription to expired and revert to free plan
    await db.collection('users').doc(userId).update({
      'subscription.status': 'expired',
      'subscription.planId': 'free',
      'subscription.expiredAt': new Date(),
      'subscription.updatedAt': new Date(),
      updatedAt: new Date(),
    });

    console.log('Subscription expired for user:', userId);

  } catch (error) {
    console.error('Error handling subscription expiration:', error);
  }
}

async function handleSubscriptionPastDue(subscription: any) {
  try {
    if (!isFirebaseAvailable()) {
      console.warn('Firebase not available - skipping subscription past due handling');
      return;
    }

    // Find user by Braintree subscription ID
    const usersSnapshot = await db.collection('users')
      .where('subscription.braintreeSubscriptionId', '==', subscription.id)
      .get();

    if (usersSnapshot.empty) {
      console.error('User not found for subscription:', subscription.id);
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;

    // Update subscription status to past due
    await db.collection('users').doc(userId).update({
      'subscription.status': 'past_due',
      'subscription.updatedAt': new Date(),
      updatedAt: new Date(),
    });

    console.log('Subscription past due for user:', userId);

  } catch (error) {
    console.error('Error handling subscription past due:', error);
  }
}