'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Heslo musí mít alespoň 6 znaků.');
      return;
    }
    if (password !== password2) {
      setError('Hesla se neshodují.');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          setError('Tento e-mail je již registrován. Přihlas se.');
        } else {
          setError(error.message);
        }
        return;
      }

      setSuccess(true);
    } catch {
      setError('Nastala chyba. Zkus to znovu.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-4">
            <CheckCircle2 size={48} className="text-green-500 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Registrace proběhla!</h2>
            <p className="text-slate-600 text-sm">
              Poslali jsme ti e-mail s potvrzovacím odkazem na <strong>{email}</strong>.
              Klikni na odkaz a pak se přihlas.
            </p>
            <Link href="/login">
              <Button fullWidth>Přejít na přihlášení</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">NutriPlan</h1>
          <p className="text-slate-500 mt-1 text-sm">Vytvoř si nový účet</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="tvuj@email.cz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Heslo</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="min. 6 znaků"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Input
              label="Heslo znovu"
              type={showPassword ? 'text' : 'password'}
              placeholder="zopakuj heslo"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              autoComplete="new-password"
            />

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" fullWidth loading={loading} size="lg">
              Zaregistrovat se
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-500">
            Máš účet?{' '}
            <Link href="/login" className="text-green-600 font-semibold hover:underline">
              Přihlas se
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
