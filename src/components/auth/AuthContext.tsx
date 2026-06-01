'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut as fbSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { loadUserData, saveUserData } from '@/lib/firestore';
import { useAppStore } from '@/store/appStore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string, name: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInEmail: async () => {},
  signUpEmail: async () => {},
  signInGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const store = useAppStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);

      if (u) {
        // Načti data uživatele z Firestore
        const data = await loadUserData(u.uid);
        if (data) {
          if (data.profile) store.setProfile(data.profile);
          if (data.weightLogs) data.weightLogs.forEach(() => {});
          if (data.currentMealPlan) store.setMealPlan(data.currentMealPlan);
          if (data.shoppingList) store.setShoppingList(data.shoppingList);
          if (data.onboardingComplete !== undefined) store.setOnboardingComplete(data.onboardingComplete);
          if (data.theme) store.setTheme(data.theme);
          // Načtení weightLogs
          useAppStore.setState({ weightLogs: data.weightLogs ?? [] });
        }
        // Nastav cookie pro middleware
        document.cookie = `firebase-uid=${u.uid}; path=/; max-age=86400`;
      } else {
        document.cookie = 'firebase-uid=; path=/; max-age=0';
      }
    });
    return () => unsub();
  }, []);

  const signInEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpEmail = async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await sendEmailVerification(cred.user);
  };

  const signInGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signOut = async () => {
    await fbSignOut(auth);
    store.setOnboardingComplete(false);
    useAppStore.setState({
      profile: null,
      macroTargets: null,
      currentMealPlan: null,
      weightLogs: [],
      aiMessages: [],
      shoppingList: [],
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInEmail, signUpEmail, signInGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// Hook pro automatické ukládání do Firestore při změnách
export function useFirestoreSync() {
  const { user } = useAuth();
  const state = useAppStore();

  const save = async (partial: Parameters<typeof saveUserData>[1]) => {
    if (!user) return;
    await saveUserData(user.uid, partial);
  };

  return { save, uid: user?.uid };
}
