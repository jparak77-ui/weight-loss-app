'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import {
  ACTIVITY_LABELS,
  GOAL_LABELS,
  DIET_TYPE_LABELS,
  LOSS_SPEED_LABELS,
  ALLERGEN_LABELS,
} from '@/lib/utils';
import type { UserProfile, Gender, ActivityLevel, Goal, LossSpeed, DietType, Allergen } from '@/types';
import { calculateBMI, calculateBMR, calculateTDEE, estimateWeeksToGoal } from '@/lib/calculations';
import { AlertTriangle, ChevronRight, ChevronLeft, Check, Scale, Target, Utensils, Settings } from 'lucide-react';

const STEPS = ['Základní údaje', 'Cíl a styl', 'Jídelní preference', 'Shrnutí'];

function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function OnboardingWizard() {
  const router = useRouter();
  const { setProfile, setOnboardingComplete } = useAppStore();
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    name: '',
    gender: 'male' as Gender,
    age: 30,
    height: 175,
    weight: 85,
    targetWeight: 75,
    activityLevel: 'moderate' as ActivityLevel,
    goal: 'lose_weight' as Goal,
    lossSpeed: 'medium' as LossSpeed,
    dietType: 'classic_deficit' as DietType,
    mealsPerDay: 5,
    allergies: [] as Allergen[],
    dislikedFoods: [] as string[],
    likedFoods: [] as string[],
    healthNotes: '',
  });

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const bmi = calculateBMI(form.weight, form.height);
  const bmr = calculateBMR(form.weight, form.height, form.age, form.gender);
  const actMult: Record<ActivityLevel, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
  const tdee = Math.round(bmr * actMult[form.activityLevel]);
  const deficits: Record<LossSpeed, number> = { slow: 250, medium: 500, fast: 750 };
  const targetCals = Math.max(1200, tdee - deficits[form.lossSpeed]);
  const weeksToGoal = estimateWeeksToGoal(form.weight, form.targetWeight, form.lossSpeed);

  const toggleAllergen = (a: Allergen) => {
    const cur = form.allergies;
    set('allergies', cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]);
  };

  const handleFinish = () => {
    const profile: UserProfile = {
      id: uuidv4(),
      ...form,
      createdAt: new Date().toISOString(),
    };
    setProfile(profile);
    setOnboardingComplete(true);
    router.push('/dashboard');
  };

  const canAdvance = () => {
    if (step === 0) return form.name.trim().length > 0 && form.weight > 0 && form.height > 0 && form.age > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">NutriPlan</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Chytrý průvodce hubnnutím</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  i < step
                    ? 'bg-green-600 text-white'
                    : i === step
                    ? 'bg-green-600 text-white ring-4 ring-green-200 dark:ring-green-900'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${i < step ? 'bg-green-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
              )}
            </div>
          ))}
        </div>

        <Card className="shadow-xl animate-slide-up">
          <CardContent className="p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{STEPS[step]}</h2>
            </div>

            {/* Step 0: Basic info */}
            {step === 0 && (
              <div className="space-y-4">
                <Input label="Tvoje jméno nebo přezdívka" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Např. Marek" />
                <div className="grid grid-cols-2 gap-3">
                  <Select label="Pohlaví" value={form.gender} onChange={(e) => set('gender', e.target.value)} options={[{ value: 'male', label: 'Muž' }, { value: 'female', label: 'Žena' }]} />
                  <Input label="Věk" type="number" min={14} max={100} value={form.age} onChange={(e) => set('age', Number(e.target.value))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Výška (cm)" type="number" min={140} max={220} value={form.height} onChange={(e) => set('height', Number(e.target.value))} />
                  <Input label="Aktuální váha (kg)" type="number" min={40} max={300} step={0.1} value={form.weight} onChange={(e) => set('weight', Number(e.target.value))} />
                </div>
                <Input label="Cílová váha (kg)" type="number" min={40} max={300} step={0.1} value={form.targetWeight} onChange={(e) => set('targetWeight', Number(e.target.value))} />
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-sm text-slate-600 dark:text-slate-400">
                  BMI: <span className="font-semibold text-slate-900 dark:text-slate-100">{bmi}</span>
                </div>
                <Input label="Zdravotní poznámky (volitelné)" value={form.healthNotes} onChange={(e) => set('healthNotes', e.target.value)} placeholder="Např. diabetes, hypertenze..." />
              </div>
            )}

            {/* Step 1: Goal and diet */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Úroveň pohybu</label>
                  {(Object.entries(ACTIVITY_LABELS) as [ActivityLevel, string][]).map(([val, label]) => (
                    <label key={val} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${form.activityLevel === val ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                      <input type="radio" name="activity" value={val} checked={form.activityLevel === val} onChange={() => set('activityLevel', val)} className="sr-only" />
                      <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${form.activityLevel === val ? 'border-green-600 bg-green-600' : 'border-slate-300'}`} />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
                    </label>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Cíl</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.entries(GOAL_LABELS) as [Goal, string][]).map(([val, label]) => (
                      <label key={val} className={`p-3 rounded-xl border cursor-pointer text-center transition-colors ${form.goal === val ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300'}`}>
                        <input type="radio" name="goal" value={val} checked={form.goal === val} onChange={() => set('goal', val)} className="sr-only" />
                        <span className="text-sm font-medium">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {['lose_weight', 'carb_cycling', 'lean_bulk'].includes(form.goal) && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Rychlost hubnutí</label>
                    {(Object.entries(LOSS_SPEED_LABELS) as [LossSpeed, { label: string; desc: string; warning?: string }][]).map(([val, { label, desc, warning }]) => (
                      <label key={val} className={`block p-3 rounded-xl border cursor-pointer transition-colors ${form.lossSpeed === val ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-600'}`}>
                        <input type="radio" name="speed" value={val} checked={form.lossSpeed === val} onChange={() => set('lossSpeed', val)} className="sr-only" />
                        <div className="font-medium text-sm text-slate-900 dark:text-slate-100">{label}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
                        {warning && form.lossSpeed === val && (
                          <div className="flex items-start gap-1.5 mt-2 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg">
                            <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                            {warning}
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                )}

                <Select
                  label="Preferovaný styl stravy"
                  value={form.dietType}
                  onChange={(e) => set('dietType', e.target.value)}
                  options={Object.entries(DIET_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
                />

                <Select
                  label="Počet jídel za den"
                  value={String(form.mealsPerDay)}
                  onChange={(e) => set('mealsPerDay', Number(e.target.value))}
                  options={[
                    { value: '3', label: '3 jídla (snídaně, oběd, večeře)' },
                    { value: '4', label: '4 jídla (+ 1 svačina)' },
                    { value: '5', label: '5 jídel (+ 2 svačiny)' },
                    { value: '6', label: '6 jídel (+ 3 svačiny)' },
                  ]}
                />
              </div>
            )}

            {/* Step 2: Food preferences */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Alergie a intolerance</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.entries(ALLERGEN_LABELS) as [Allergen, string][]).map(([val, label]) => (
                      <label key={val} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer text-sm transition-colors ${form.allergies.includes(val) ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300'}`}>
                        <input type="checkbox" checked={form.allergies.includes(val)} onChange={() => toggleAllergen(val)} className="sr-only" />
                        <div className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center ${form.allergies.includes(val) ? 'bg-red-500 border-red-500' : 'border-slate-300'}`}>
                          {form.allergies.includes(val) && <Check size={10} className="text-white" />}
                        </div>
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 text-xs text-amber-800 dark:text-amber-300 flex gap-2">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-600" />
                  <span>Tato aplikace slouží pouze pro orientační výživová doporučení. Nenahrazuje lékaře, nutričního terapeuta ani zdravotní péči. Pokud máte zdravotní problémy, poraďte se s odborníkem.</span>
                </div>
              </div>
            )}

            {/* Step 3: Summary */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Scale, label: 'Váha', value: `${form.weight} kg → ${form.targetWeight} kg` },
                    { icon: Target, label: 'Cíl', value: GOAL_LABELS[form.goal] },
                    { icon: Utensils, label: 'Styl', value: DIET_TYPE_LABELS[form.dietType] },
                    { icon: Settings, label: 'Aktivita', value: Object.keys(ACTIVITY_LABELS).indexOf(form.activityLevel) + 1 + '/5' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
                        <Icon size={12} />{label}
                      </div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4 space-y-3">
                  <div className="font-semibold text-green-800 dark:text-green-300 text-sm">Tvůj denní plán</div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-700 dark:text-green-400">{targetCals}</div>
                      <div className="text-xs text-slate-500">kcal/den</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{Math.round(form.weight * 2)}</div>
                      <div className="text-xs text-slate-500">g bílkovin</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-600">{weeksToGoal}</div>
                      <div className="text-xs text-slate-500">týdnů k cíli</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-400">
                  BMR: <strong>{Math.round(bmr)}</strong> kcal • TDEE: <strong>{tdee}</strong> kcal • Deficit: <strong>{deficits[form.lossSpeed]}</strong> kcal
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-2">
              {step > 0 && (
                <Button variant="secondary" onClick={() => setStep((s) => s - 1)} className="flex-1">
                  <ChevronLeft size={16} /> Zpět
                </Button>
              )}
              {step < STEPS.length - 1 ? (
                <Button onClick={() => setStep((s) => s + 1)} disabled={!canAdvance()} className="flex-1">
                  Pokračovat <ChevronRight size={16} />
                </Button>
              ) : (
                <Button onClick={handleFinish} className="flex-1">
                  Začít! <ChevronRight size={16} />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
