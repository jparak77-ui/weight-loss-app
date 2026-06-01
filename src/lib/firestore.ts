import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { UserProfile, WeightLog, MealPlan, ShoppingItem, AIMessage } from '@/types';

export interface UserData {
  profile?: UserProfile;
  weightLogs?: WeightLog[];
  currentMealPlan?: MealPlan | null;
  shoppingList?: ShoppingItem[];
  onboardingComplete?: boolean;
  theme?: 'light' | 'dark';
}

export async function loadUserData(uid: string): Promise<UserData | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    return snap.data() as UserData;
  } catch {
    return null;
  }
}

export async function saveUserData(uid: string, data: Partial<UserData>): Promise<void> {
  try {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, data as any);
    } else {
      await setDoc(ref, data);
    }
  } catch (e) {
    console.error('Firestore save error:', e);
  }
}
