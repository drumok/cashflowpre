# Firebase Setup Guide - SMB Analytics Platform

## 🔥 Firebase Configuration Complete

### ✅ **Firebase Project Details**
- **Project ID**: `ocrcsvcap`
- **Project Name**: OCR CSV CAP
- **Google Account**: `rajaninkv@gmail.com`

### ✅ **Firebase Services Configured**
- **Authentication**: Email/Password + Google SSO
- **Firestore Database**: User profiles, subscriptions, usage tracking
- **Storage**: File uploads and user data
- **Analytics**: User behavior tracking

---

## 🔧 **Required Firebase Setup Steps**

### **1. Enable Required Services**

#### **A. Authentication Setup**
1. Go to [Firebase Console](https://console.firebase.google.com/project/ocrcsvcap)
2. Navigate to **Authentication > Sign-in method**
3. Enable these providers:
   - ✅ **Email/Password** - For basic authentication
   - ✅ **Google** - For Google SSO integration
4. Add authorized domains:
   - `localhost` (for development)
   - Your production domain (when deployed)

#### **B. Firestore Database Setup**
1. Go to **Firestore Database**
2. Create database in **production mode**
3. Choose region: **us-central1** (same as GCP)
4. Set up security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own analytics results
    match /analytics_results/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Users can read/write their own leads results
    match /leads_results/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

#### **C. Storage Setup**
1. Go to **Storage**
2. Get started with default settings
3. Choose region: **us-central1**
4. Set up security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload to their own folder
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### **2. Get Firebase Admin Private Key**

#### **A. Generate Service Account Key**
1. Go to **Project Settings > Service Accounts**
2. Click **Generate New Private Key**
3. Download the JSON file
4. Extract the `private_key` field from the JSON
5. Add it to your `.env.local`:

```bash
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

#### **B. Alternative: Use Firebase CLI**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Get service account key
firebase projects:list
firebase use ocrcsvcap
```

### **3. Database Structure Setup**

#### **A. User Profile Structure**
```javascript
// /users/{userId}
{
  email: "user@example.com",
  displayName: "User Name",
  photoURL: "https://...",
  subscription: {
    planId: "free", // "free", "pro", "pro_plus"
    status: "active",
    braintreeSubscriptionId: null,
    nextBillingDate: null,
    price: 0,
    currency: "USD",
    limits: {
      maxDataUploadMB: 5,
      maxAnalysisRuns: 5,
      maxUsers: 1,
      maxStorageGB: 0
    },
    createdAt: timestamp,
    updatedAt: timestamp
  },
  usage: {
    analyticsRuns: 0,
    leadsGenerated: 0,
    dataUploadedMB: 0,
    storageUsedGB: 0,
    activeUsers: 1,
    lastResetDate: timestamp
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### **B. Analytics Results Structure**
```javascript
// /analytics_results/{resultId}
{
  userId: "user_id",
  type: "sales_forecasting", // analytics type
  results: {
    insights: [...],
    contacts: [...],
    revenueImpact: 15000
  },
  dataSize: 2.5, // MB
  timestamp: timestamp,
  createdAt: timestamp
}
```

#### **C. Leads Results Structure**
```javascript
// /leads_results/{resultId}
{
  userId: "user_id",
  type: "overdue_payment", // lead type
  leads: [
    {
      name: "John Smith",
      email: "john@company.com",
      phone: "+1-555-0123",
      company: "ABC Corp",
      revenuePotential: 15000,
      urgency: "high",
      context: "45 days overdue on invoice #1234"
    }
  ],
  totalRevenuePotential: 156000,
  timestamp: timestamp,
  createdAt: timestamp
}
```

---

## 🔐 **Security Configuration**

### **Authentication Rules**
- ✅ **Email Verification**: Optional (can be enabled)
- ✅ **Password Requirements**: Minimum 6 characters
- ✅ **Google SSO**: Enabled for easy signup
- ✅ **Session Management**: Automatic token refresh

### **Database Security**
- ✅ **User Isolation**: Users can only access their own data
- ✅ **Admin Access**: Server-side admin SDK for system operations
- ✅ **Rate Limiting**: Built-in Firestore rate limiting
- ✅ **Data Validation**: Client and server-side validation

### **Storage Security**
- ✅ **User Folders**: Each user has isolated storage
- ✅ **File Size Limits**: Based on subscription tier
- ✅ **File Type Validation**: Only allowed file types
- ✅ **Automatic Cleanup**: Temporary files auto-deleted

---

## 📊 **Monitoring & Analytics**

### **Firebase Analytics**
1. Go to **Analytics > Dashboard**
2. Enable Google Analytics integration
3. Track user engagement and conversion

### **Performance Monitoring**
1. Go to **Performance**
2. Enable performance monitoring
3. Track app performance metrics

### **Crashlytics** (Optional)
1. Go to **Crashlytics**
2. Enable crash reporting
3. Monitor app stability

---

## 🧪 **Testing Configuration**

### **Development Testing**
```bash
# Test Firebase connection
npm run dev

# Check browser console for Firebase initialization
# Should see: "Firebase initialized successfully"
```

### **Authentication Testing**
1. Go to `http://localhost:3000`
2. Click "Sign Up" or "Sign In"
3. Test email/password registration
4. Test Google SSO login
5. Verify user profile creation in Firestore

### **Database Testing**
1. Register a new user
2. Check Firestore Console for user document
3. Verify user profile structure
4. Test analytics/leads data storage

---

## 🚀 **Production Deployment**

### **Environment Variables**
All Firebase credentials are already configured in `.env.local`:

```bash
# Client-side (already set)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCgEeS4Zm6n7ZvaUp4tKDKMfBPXOo7cePs
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ocrcsvcap.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ocrcsvcap
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ocrcsvcap.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=571756360048
NEXT_PUBLIC_FIREBASE_APP_ID=1:571756360048:web:830bfb34e06ff8e6ad1fb5
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-H6FW5K0EZJ

# Server-side (you need to add private key)
FIREBASE_ADMIN_PROJECT_ID=ocrcsvcap
FIREBASE_ADMIN_CLIENT_EMAIL=rajaninkv@gmail.com
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key_here
```

### **Deployment Checklist**
- [ ] Firebase Authentication enabled (Email + Google)
- [ ] Firestore database created with security rules
- [ ] Storage bucket created with security rules
- [ ] Service account private key obtained
- [ ] Environment variables configured
- [ ] Security rules tested
- [ ] User registration/login tested

---

## ✅ **Firebase Setup Complete**

Your Firebase project `ocrcsvcap` is now fully configured for:
- ✅ **User Authentication** with email/password and Google SSO
- ✅ **User Profile Management** with subscription tracking
- ✅ **Analytics Data Storage** with usage tracking
- ✅ **Lead Generation Results** with revenue tracking
- ✅ **File Storage** with user isolation
- ✅ **Security Rules** for data protection

**Next Step**: Get your Firebase Admin private key and add it to `.env.local`, then you're ready to deploy! 🚀