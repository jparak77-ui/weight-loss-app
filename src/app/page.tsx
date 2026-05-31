'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/appStore';

export default function HomePage() {
  const router = useRouter();
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);

  useEffect(() => {
    if (onboardingComplete) {
      router.replace('/dashboard');
    } else {
      router.replace('/onboarding');
    }
  }, [onboardingComplete, router]);

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl font-bold text-green-600 mb-2">NutriPlan</div>
        <div className="text-slate-500">Načítání...</div>
      </div>
    </div>
  );
}
