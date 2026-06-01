import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Heslo', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        // Uživatelé jsou uloženi v env proměnné AUTH_USERS jako JSON
        // Formát: [{"email":"jan@email.cz","passwordHash":"$2b$..."}]
        const usersEnv = process.env.AUTH_USERS;
        if (!usersEnv) return null;

        try {
          const users: { email: string; passwordHash: string; name?: string }[] = JSON.parse(usersEnv);
          const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
          if (!user) return null;

          const valid = await bcrypt.compare(password, user.passwordHash);
          if (!valid) return null;

          return { id: user.email, email: user.email, name: user.name || email.split('@')[0] };
        } catch {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
});
