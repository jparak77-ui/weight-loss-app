import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ServiceWorkerRegistrar } from '@/components/layout/ServiceWorkerRegistrar';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
  title: 'NutriPlan — Chytrý jídelníček pro hubnutí',
  description: 'Moderní aplikace pro sestavení jídelníčku, výpočet kalorií a sledování váhy.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NutriPlan',
  },
};

export const viewport: Viewport = {
  themeColor: '#16a34a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <ServiceWorkerRegistrar />
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
