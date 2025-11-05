// Firebase Setup Verification Script
// Run this with: node firebase-setup-check.js

const https = require('https');

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCgEeS4Zm6n7ZvaUp4tKDKMfBPXOo7cePs',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'ocrcsvcap',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'ocrcsvcap.firebaseapp.com'
};

console.log('🔥 Firebase Setup Verification');
console.log('================================');
console.log(`Project ID: ${config.projectId}`);
console.log(`Auth Domain: ${config.authDomain}`);
console.log(`API Key: ${config.apiKey.substring(0, 20)}...`);
console.log('');

// Test Firebase Auth REST API
const testData = JSON.stringify({
  email: `test${Date.now()}@example.com`,
  password: 'testpassword123',
  returnSecureToken: true
});

const options = {
  hostname: 'identitytoolkit.googleapis.com',
  port: 443,
  path: `/v1/accounts:signUp?key=${config.apiKey}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': testData.length
  }
};

console.log('Testing Firebase Auth REST API...');

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (res.statusCode === 200) {
        console.log('✅ SUCCESS: Firebase Auth is working!');
        console.log(`User ID: ${response.localId}`);
        console.log('');
        console.log('🎉 Your Firebase setup is correct!');
        console.log('The issue might be with authorized domains.');
        console.log('');
        console.log('Next steps:');
        console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
        console.log(`2. Select project: ${config.projectId}`);
        console.log('3. Go to Authentication > Settings > Authorized domains');
        console.log('4. Add: localhost');
        console.log('5. Add: localhost:3000');
        console.log('6. Save and try again');
      } else {
        console.log('❌ ERROR: Firebase Auth failed');
        console.log(`Status: ${res.statusCode}`);
        console.log('Response:', response);
        
        if (response.error && response.error.message) {
          console.log(`Error: ${response.error.message}`);
          
          if (response.error.message.includes('API key not valid')) {
            console.log('');
            console.log('🔧 Fix: Check your Firebase API key');
            console.log('1. Go to Firebase Console');
            console.log('2. Project Settings > General');
            console.log('3. Copy the correct API key');
            console.log('4. Update your .env.local file');
          }
        }
      }
    } catch (error) {
      console.log('❌ ERROR: Invalid JSON response');
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ ERROR: Network request failed');
  console.log(error.message);
});

req.write(testData);
req.end();