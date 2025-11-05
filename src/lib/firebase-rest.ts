// Firebase REST API fallback for authentication
// Use this if the Firebase SDK has domain authorization issues

interface SignUpData {
  email: string;
  password: string;
  displayName?: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface FirebaseAuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const BASE_URL = 'https://identitytoolkit.googleapis.com/v1/accounts';

export class FirebaseRestAuth {
  static async signUp({ email, password, displayName }: SignUpData): Promise<FirebaseAuthResponse> {
    const response = await fetch(`${BASE_URL}:signUp?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        displayName,
        returnSecureToken: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to create account');
    }

    return data;
  }

  static async signIn({ email, password }: SignInData): Promise<FirebaseAuthResponse> {
    const response = await fetch(`${BASE_URL}:signInWithPassword?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to sign in');
    }

    return data;
  }

  static async resetPassword(email: string): Promise<void> {
    const response = await fetch(`${BASE_URL}:sendOobCode?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestType: 'PASSWORD_RESET',
        email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to send reset email');
    }
  }

  static async refreshToken(refreshToken: string): Promise<FirebaseAuthResponse> {
    const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to refresh token');
    }

    return {
      idToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      localId: data.user_id,
      email: '',
    };
  }
}