'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { BottomNav, SideNav } from './Navigation';
import { cn } from '@/lib/utils';

export function AppShell({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={cn('min-h-screen bg-slate-50 dark:bg-slate-950', theme === 'dark' && 'dark')}>
      <SideNav />
      <main className="lg:ml-60 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-6 pb-28 lg:pb-8">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
