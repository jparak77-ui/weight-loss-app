'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  TrendingDown,
  ShoppingCart,
  Bot,
  User,
  Waves,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 safe-area-pb">
      <div className="flex items-stretch justify-around max-w-lg mx-auto">
        {mainItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 px-2 py-2 min-w-0 flex-1 transition-colors text-xs font-medium',
                active
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              )}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function SideNav() {
  const pathname = usePathname();

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
    </aside>
  );
}
