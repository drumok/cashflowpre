'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseAvailable } from '@/lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'member';
  subscription: 'free' | 'pro' | 'pro_plus';
  createdAt: Date;
  lastLoginAt: Date;
  usageStats: {
    analyticsRuns: number;
    leadsGenerated: number;
    dataUploaded: number; // in MB
  };
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  getIdToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseAvailable()) {
      console.warn('Firebase not available - authentication disabled');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Load user profile from Firestore
        await loadUserProfile(user);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserProfile = async (user: User) => {
    if (!isFirebaseAvailable()) {
      console.warn('Firebase not available - cannot load user profile');
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || data.displayName || '',
          photoURL: user.photoURL || data.photoURL,
          role: data.role || 'member',
          subscription: data.subscription || 'free',
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLoginAt: new Date(),
          usageStats: data.usageStats || {
            analyticsRuns: 0,
            leadsGenerated: 0,
            dataUploaded: 0
          }
        });

        // Update last login time
        await setDoc(doc(db, 'users', user.uid), {
          lastLoginAt: new Date()
        }, { merge: true });
      } else {
        // Create new user profile
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || undefined,
          role: 'member',
          subscription: 'free',
          createdAt: new Date(),
          lastLoginAt: new Date(),
          usageStats: {
            analyticsRuns: 0,
            leadsGenerated: 0,
            dataUploaded: 0
          }
        };

        await setDoc(doc(db, 'users', user.uid), newProfile);
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isFirebaseAvailable()) {
      throw new Error('Authentication service is not available');
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    if (!isFirebaseAvailable()) {
      throw new Error('Authentication service is not available');
    }
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(user, { displayName });
      
      // Create user profile in Firestore
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName,
        role: 'member',
        subscription: 'free',
        createdAt: new Date(),
        lastLoginAt: new Date(),
        usageStats: {
          analyticsRuns: 0,
          leadsGenerated: 0,
          dataUploaded: 0
        }
      };

      await setDoc(doc(db, 'users', user.uid), newProfile);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const signInWithGoogle = async () => {
    if (!isFirebaseAvailable()) {
      throw new Error('Authentication service is not available');
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    if (!isFirebaseAvailable()) {
      throw new Error('Authentication service is not available');
    }
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const resetPassword = async (email: string) => {
    if (!isFirebaseAvailable()) {
      throw new Error('Authentication service is not available');
    }
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) return;
    
    if (!isFirebaseAvailable()) {
      throw new Error('Authentication service is not available');
    }

    try {
      await setDoc(doc(db, 'users', user.uid), updates, { merge: true });
      setUserProfile({ ...userProfile, ...updates });
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const getIdToken = async (): Promise<string> => {
    if (!user) {
      throw new Error('No user logged in');
    }
    return await user.getIdToken();
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    getIdToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}