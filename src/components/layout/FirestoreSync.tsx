'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { useAppStore } from '@/store/appStore';
import { saveUserData } from '@/lib/firestore';

export function FirestoreSync() {
  const { user } = useAuth();
  const store = useAppStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced save — čekáme 2s po poslední změně
  const scheduleSave = () => {
    if (!user) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      await saveUserData(user.uid, {
        profile: store.profile ?? undefined,
        weightLogs: store.weightLogs,
        currentMealPlan: store.currentMealPlan,
        shoppingList: store.shoppingList,
        onboardingComplete: store.onboardingComplete,
        theme: store.theme,
      });
    }, 2000);
  };

  useEffect(() => {
    if (!user) return;
    scheduleSave();
  }, [
    user?.uid,
    store.profile,
    store.weightLogs,
    store.currentMealPlan,
    store.shoppingList,
    store.onboardingComplete,
    store.theme,
  ]);

  return null;
}
