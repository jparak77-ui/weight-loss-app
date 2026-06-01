'use client';

import { createContext, useContext } from 'react';
import { useSession, signOut as nextSignOut } from 'next-auth/react';

interface AuthContextType {
  user: { email?: string | null; name?: string | null } | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return children as React.ReactElement;
}

export function useAuth(): AuthContextType {
  const { data: session, status } = useSession();
  return {
    user: session?.user ?? null,
    loading: status === 'loading',
    signOut: () => nextSignOut({ callbackUrl: '/login' }),
  };
}
