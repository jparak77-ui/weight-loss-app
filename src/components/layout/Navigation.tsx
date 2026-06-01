'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  TrendingDown,
  ShoppingCart,
  Bot,
  User,
  Waves,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthContext';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Přehled', icon: LayoutDashboard },
  { href: '/meal-plan', label: 'Jídelníček', icon: UtensilsCrossed },
  { href: '/carb-cycling', label: 'Vlny', icon: Waves },
  { href: '/weight-tracker', label: 'Váha', icon: TrendingDown },
  { href: '/shopping-list', label: 'Nákup', icon: ShoppingCart },
  { href: '/ai-advisor', label: 'AI Rádce', icon: Bot },
  { href: '/profile', label: 'Profil', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const mainItems = NAV_ITEMS.slice(0, 5);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t-2 border-slate-200 dark:border-slate-700 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-stretch justify-around max-w-lg mx-auto h-16">
        {mainItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-1 min-w-0 flex-1 transition-all duration-150 text-xs font-medium',
                active
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              )}
            >
              <div className={cn(
                'flex items-center justify-center w-10 h-6 rounded-full transition-colors',
                active && 'bg-green-50 dark:bg-green-900/30'
              )}>
                <Icon size={21} strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span className="truncate leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function SideNav() {
  const pathname = usePathname();
  const { user, signOut, supabaseReady } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 fixed left-0 top-0 bottom-0 z-40">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-xl font-bold text-green-600 dark:text-green-400">NutriPlan</h1>
        <p className="text-xs text-slate-500 mt-0.5">Chytrý jídelníček</p>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              )}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>
      {supabaseReady && user && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 px-3 mb-2 truncate">{user.email}</div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            Odhlásit se
          </button>
        </div>
      )}
    </aside>
  );
}
