import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let firebaseApp: App | null = null;
let firebaseAuth: Auth | null = null;
let firebaseDb: Firestore | null = null;

function initializeFirebaseAdmin() {
  if (!firebaseApp && !getApps().length) {
    // Check if we have the required environment variables
    if (!process.env.FIREBASE_ADMIN_PROJECT_ID || 
        !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || 
        !process.env.FIREBASE_ADMIN_PRIVATE_KEY ||
        process.env.FIREBASE_ADMIN_PROJECT_ID === 'placeholder') {
      console.warn('Firebase Admin configuration is missing or incomplete - Firebase features will be disabled');
      return false;
    }

    try {
      const serviceAccount = {
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };

      firebaseApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      });
    } catch (error) {
      console.error('Failed to initialize Firebase Admin:', error);
      return false;
    }
  } else if (!firebaseApp) {
    firebaseApp = getApps()[0];
  }
  
  if (firebaseApp && !firebaseAuth) {
    try {
      firebaseAuth = getAuth(firebaseApp);
    } catch (error) {
      console.error('Failed to initialize Firebase Auth:', error);
      return false;
    }
  }
  
  if (firebaseApp && !firebaseDb) {
    try {
      firebaseDb = getFirestore(firebaseApp);
    } catch (error) {
      console.error('Failed to initialize Firestore:', error);
      return false;
    }
  }
  
  return true;
}

export const auth = new Proxy({} as Auth, {
  get(target, prop) {
    const initialized = initializeFirebaseAdmin();
    if (!initialized || !firebaseAuth) {
      if (prop === 'verifyIdToken') {
        return () => Promise.reject(new Error('Firebase Auth not available'));
      }
      return undefined;
    }
    return (firebaseAuth as any)[prop];
  }
});

export const db = new Proxy({} as Firestore, {
  get(target, prop) {
    const initialized = initializeFirebaseAdmin();
    if (!initialized || !firebaseDb) {
      if (prop === 'collection') {
        return () => {
          throw new Error('Firebase Firestore not available');
        };
      }
      return undefined;
    }
    return (firebaseDb as any)[prop];
  }
});

// Helper function to check if Firebase is available
export function isFirebaseAvailable(): boolean {
  return initializeFirebaseAdmin() && firebaseAuth !== null && firebaseDb !== null;
}

// User subscription management functions
export async function createUserProfile(userId: string, userData: {
  email: string;
  displayName?: string;
  photoURL?: string;
}) {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase is not available');
  }
  
  const userRef = db.collection('users').doc(userId);
  
  const userProfile = {
    email: userData.email,
    displayName: userData.displayName || '',
    photoURL: userData.photoURL || '',
    subscription: {
      planId: 'free',
      status: 'active',
      braintreeSubscriptionId: null,
      nextBillingDate: null,
      price: 0,
      currency: 'USD',
      limits: {
        maxDataUploadMB: 5,
        maxAnalysisRuns: 5,
        maxUsers: 1,
        maxStorageGB: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    usage: {
      analyticsRuns: 0,
      leadsGenerated: 0,
      dataUploadedMB: 0,
      storageUsedGB: 0,
      activeUsers: 1,
      lastResetDate: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await userRef.set(userProfile, { merge: true });
  return userProfile;
}

export async function getUserProfile(userId: string) {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase is not available');
  }
  
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();
  
  if (!userDoc.exists) {
    return null;
  }
  
  return { id: userDoc.id, ...userDoc.data() } as any;
}

export async function updateUserSubscription(userId: string, subscriptionData: {
  planId: string;
  braintreeSubscriptionId?: string;
  status: string;
  nextBillingDate?: any;
  price: number;
  currency: string;
  limits: any;
}) {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase is not available');
  }
  
  const userRef = db.collection('users').doc(userId);
  
  await userRef.update({
    'subscription.planId': subscriptionData.planId,
    'subscription.braintreeSubscriptionId': subscriptionData.braintreeSubscriptionId,
    'subscription.status': subscriptionData.status,
    'subscription.nextBillingDate': subscriptionData.nextBillingDate,
    'subscription.price': subscriptionData.price,
    'subscription.currency': subscriptionData.currency,
    'subscription.limits': subscriptionData.limits,
    'subscription.updatedAt': new Date(),
    updatedAt: new Date(),
  });
}

export async function incrementUsage(userId: string, usageType: 'analyticsRuns' | 'leadsGenerated' | 'dataUploadedMB' | 'storageUsedGB', amount: number = 1) {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase is not available');
  }
  
  const userRef = db.collection('users').doc(userId);
  
  // Get current usage
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    throw new Error('User not found');
  }
  
  const userData = userDoc.data()!;
  const currentUsage = userData.usage || {};
  const newUsage = {
    ...currentUsage,
    [usageType]: (currentUsage[usageType] || 0) + amount,
  };
  
  await userRef.update({
    usage: newUsage,
    updatedAt: new Date(),
  });
  
  return newUsage;
}

export async function checkUsageLimit(userId: string, usageType: 'analyticsRuns' | 'leadsGenerated' | 'dataUploadedMB' | 'storageUsedGB', requestedAmount: number = 1) {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase is not available');
  }
  
  const userProfile = await getUserProfile(userId);
  
  if (!userProfile) {
    throw new Error('User not found');
  }
  
  const currentUsage = userProfile.usage?.[usageType] || 0;
  const limit = userProfile.subscription?.limits?.[`max${usageType.charAt(0).toUpperCase() + usageType.slice(1)}`] || 0;
  
  // If limit is 0, it means unlimited
  if (limit === 0) {
    return { allowed: true, currentUsage, limit, remaining: Infinity };
  }
  
  const remaining = limit - currentUsage;
  const allowed = remaining >= requestedAmount;
  
  return { allowed, currentUsage, limit, remaining };
}

export async function resetMonthlyUsage(userId: string) {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase is not available');
  }
  
  const userRef = db.collection('users').doc(userId);
  
  await userRef.update({
    'usage.analyticsRuns': 0,
    'usage.leadsGenerated': 0,
    'usage.dataUploadedMB': 0,
    'usage.lastResetDate': new Date(),
    updatedAt: new Date(),
  });
}

// Analytics and leads data storage
export async function saveAnalyticsResult(userId: string, analysisData: {
  type: string;
  results: any;
  dataSize: number;
  timestamp: Date;
}) {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase is not available');
  }
  
  const resultRef = db.collection('analytics_results').doc();
  
  await resultRef.set({
    userId,
    type: analysisData.type,
    results: analysisData.results,
    dataSize: analysisData.dataSize,
    timestamp: analysisData.timestamp,
    createdAt: new Date(),
  });
  
  // Increment usage
  await incrementUsage(userId, 'analyticsRuns');
  await incrementUsage(userId, 'dataUploadedMB', analysisData.dataSize);
  
  return resultRef.id;
}

export async function saveLeadsResult(userId: string, leadsData: {
  type: string;
  leads: any[];
  totalRevenuePotential: number;
  timestamp: Date;
}) {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase is not available');
  }
  
  const resultRef = db.collection('leads_results').doc();
  
  await resultRef.set({
    userId,
    type: leadsData.type,
    leads: leadsData.leads,
    totalRevenuePotential: leadsData.totalRevenuePotential,
    timestamp: leadsData.timestamp,
    createdAt: new Date(),
  });
  
  // Increment usage
  await incrementUsage(userId, 'leadsGenerated', leadsData.leads.length);
  
  return resultRef.id;
}

export async function getUserAnalyticsHistory(userId: string, limit: number = 10) {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase is not available');
  }
  
  const resultsSnapshot = await db.collection('analytics_results')
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .get();
  
  return resultsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getUserLeadsHistory(userId: string, limit: number = 10) {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase is not available');
  }
  
  const resultsSnapshot = await db.collection('leads_results')
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .limit(limit)
    .get();
  
  return resultsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}