'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  ACTIVITY_LABELS,
  GOAL_LABELS,
  DIET_TYPE_LABELS,
  LOSS_SPEED_LABELS,
  ALLERGEN_LABELS,
} from '@/lib/utils';
import { calculateBMI, calculateBMR, calculateTDEE, estimateWeeksToGoal, getBMICategory } from '@/lib/calculations';
import { Sun, Moon, Save, RotateCcw, LogOut } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { useRouter } from 'next/navigation';
import type { ActivityLevel, Goal, LossSpeed, DietType, Allergen, Gender } from '@/types';

export function ProfileView() {
  const { profile, theme, setTheme, updateProfile, setOnboardingComplete } = useAppStore();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (!profile) return null;

  const [form, setForm] = useState({ ...profile });
  const setF = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const bmi = calculateBMI(form.weight, form.height);
  const bmiCat = getBMICategory(bmi);
  const bmr = calculateBMR(form.weight, form.height, form.age, form.gender);
  const actMult: Record<ActivityLevel, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
  const tdee = Math.round(bmr * actMult[form.activityLevel]);
  const weeks = estimateWeeksToGoal(form.weight, form.targetWeight, form.lossSpeed);

  const toggleAllergen = (a: Allergen) => {
    const cur = form.allergies;
    setF('allergies', cur.includes(a) ? cur.filter((x: Allergen) => x !== a) : [...cur, a]);
  };

  const handleSave = () => {
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setOnboardingComplete(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Profil</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === 'light' ? <Moon size={18} className="text-slate-600" /> : <Sun size={18} className="text-yellow-400" />}
          </button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{bmi}</div>
            <div className="text-xs text-slate-500">BMI</div>
            <Badge variant={bmi < 18.5 ? 'blue' : bmi < 25 ? 'green' : bmi < 30 ? 'orange' : 'red'} className="mt-1 text-xs">{bmiCat}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{Math.round(bmr)}</div>
            <div className="text-xs text-slate-500">BMR (kcal)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{weeks}</div>
            <div className="text-xs text-slate-500">týdnů k cíli</div>
          </CardContent>
        </Card>
      </div>

      {/* Basic info */}
      <Card>
        <CardHeader className="p-4"><CardTitle>Základní údaje</CardTitle></CardHeader>
        <CardContent className="p-4 pt-2 space-y-3">
          <Input label="Jméno" value={form.name} onChange={(e) => setF('name', e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Pohlaví" value={form.gender} onChange={(e) => setF('gender', e.target.value)} options={[{ value: 'male', label: 'Muž' }, { value: 'female', label: 'Žena' }]} />
            <Input label="Věk" type="number" value={form.age} onChange={(e) => setF('age', Number(e.target.value))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Výška (cm)" type="number" value={form.height} onChange={(e) => setF('height', Number(e.target.value))} />
            <Input label="Váha (kg)" type="number" step="0.1" value={form.weight} onChange={(e) => setF('weight', Number(e.target.value))} />
          </div>
          <Input label="Cílová váha (kg)" type="number" step="0.1" value={form.targetWeight} onChange={(e) => setF('targetWeight', Number(e.target.value))} />
        </CardContent>
      </Card>

      {/* Goal and diet */}
      <Card>
        <CardHeader className="p-4"><CardTitle>Cíl a styl stravování</CardTitle></CardHeader>
        <CardContent className="p-4 pt-2 space-y-3">
          <Select label="Úroveň pohybu" value={form.activityLevel} onChange={(e) => setF('activityLevel', e.target.value)} options={Object.entries(ACTIVITY_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
          <Select label="Cíl" value={form.goal} onChange={(e) => setF('goal', e.target.value)} options={Object.entries(GOAL_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
          <Select label="Rychlost hubnutí" value={form.lossSpeed} onChange={(e) => setF('lossSpeed', e.target.value)} options={Object.entries(LOSS_SPEED_LABELS).map(([v, d]) => ({ value: v, label: d.label }))} />
          <Select label="Styl stravy" value={form.dietType} onChange={(e) => setF('dietType', e.target.value)} options={Object.entries(DIET_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
          <Select label="Počet jídel za den" value={String(form.mealsPerDay)} onChange={(e) => setF('mealsPerDay', Number(e.target.value))} options={[
            { value: '3', label: '3 jídla' },
            { value: '4', label: '4 jídla' },
            { value: '5', label: '5 jídel' },
            { value: '6', label: '6 jídel' },
          ]} />
        </CardContent>
      </Card>

      {/* Allergies */}
      <Card>
        <CardHeader className="p-4"><CardTitle>Alergie</CardTitle></CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(ALLERGEN_LABELS) as [Allergen, string][]).map(([val, label]) => (
              <label key={val} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-sm transition-colors ${form.allergies.includes(val) ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                <input type="checkbox" checked={form.allergies.includes(val)} onChange={() => toggleAllergen(val)} className="sr-only" />
                <div className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center ${form.allergies.includes(val) ? 'bg-red-500 border-red-500' : 'border-slate-300'}`}>
                  {form.allergies.includes(val) && <span className="text-white text-xs">✓</span>}
                </div>
                {label}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health notes */}
      <Card>
        <CardHeader className="p-4"><CardTitle>Zdravotní poznámky</CardTitle></CardHeader>
        <CardContent className="p-4 pt-2">
          <Input
            value={form.healthNotes}
            onChange={(e) => setF('healthNotes', e.target.value)}
            placeholder="Např. hypertenze, diabetes, poranění kolene..."
          />
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave} fullWidth>
          <Save size={16} />
          {saved ? 'Uloženo!' : 'Uložit změny'}
        </Button>
      </div>

      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-2">
        <Button variant="ghost" onClick={handleReset} size="sm">
          <RotateCcw size={14} /> Znovu projít nastavení
        </Button>
        {user && (
          <Button variant="danger" onClick={handleSignOut} size="sm">
            <LogOut size={14} /> Odhlásit se
          </Button>
        )}
      </div>
      {user && (
        <div className="text-xs text-slate-500 text-center">Přihlášen jako <strong>{user.email}</strong></div>
      )}

      {/* Health disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 text-xs text-amber-800 dark:text-amber-300">
        <strong>Zdravotní upozornění:</strong> Tato aplikace slouží pouze pro orientační výživová doporučení. Nenahrazuje lékaře, nutričního terapeuta ani zdravotní péči. Pokud máte zdravotní problémy, užíváte léky, jste těhotná, kojíte nebo máte poruchy příjmu potravy, konzultujte změny jídelníčku s odborníkem.
      </div>
    </div>
  );
}
