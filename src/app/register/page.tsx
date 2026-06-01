'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { signUpEmail, signInGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Heslo musí mít alespoň 6 znaků.'); return; }
    if (password !== password2) { setError('Hesla se neshodují.'); return; }
    setLoading(true);
    try {
      await signUpEmail(email, password, name);
      setSuccess(true);
    } catch (err: any) {
      const code = err?.code;
      if (code === 'auth/email-already-in-use') setError('Tento e-mail je již registrován.');
      else if (code === 'auth/invalid-email') setError('Neplatná e-mailová adresa.');
      else setError(err?.message || 'Nastala chyba.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInGoogle();
      router.push('/dashboard');
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') setError('Google registrace selhala.');
    } finally {
      setGoogleLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center space-y-4">
          <CheckCircle2 size={52} className="text-green-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Účet vytvořen!</h2>
          <p className="text-slate-600 text-sm">
            Poslali jsme ti potvrzovací e-mail na <strong>{email}</strong>. Klikni na odkaz a pak se přihlas.
          </p>
          <Link href="/login"><Button fullWidth size="lg">Přejít na přihlášení</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🥗</div>
          <h1 className="text-3xl font-bold text-green-600">NutriPlan</h1>
          <p className="text-slate-500 mt-1 text-sm">Vytvoř si účet zdarma</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 space-y-4">
          <Button type="button" variant="secondary" fullWidth size="lg" loading={googleLoading} onClick={handleGoogle}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Registrovat se přes Google
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">nebo e-mailem</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            <Input label="Jméno" placeholder="Jak ti říkají?" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="E-mail" type="email" placeholder="tvuj@email.cz" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Heslo</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} placeholder="min. 6 znaků" value={password}
                  onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password"
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Input label="Heslo znovu" type={showPw ? 'text' : 'password'} placeholder="zopakuj heslo"
              value={password2} onChange={(e) => setPassword2(e.target.value)} required autoComplete="new-password" />

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                <AlertCircle size={16} className="shrink-0" />{error}
              </div>
            )}

            <Button type="submit" fullWidth loading={loading} size="lg">Zaregistrovat se</Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Máš účet?{' '}
            <Link href="/login" className="text-green-600 font-semibold hover:underline">Přihlas se</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
