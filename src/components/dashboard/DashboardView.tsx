'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MacroRing, MacroBar } from '@/components/ui/MacroRing';
import { Badge } from '@/components/ui/Badge';
import { MEAL_TYPE_LABELS, getDayName, formatDate, getTodayString, getPhaseColor, getPhaseLabel } from '@/lib/utils';
import { generateMealPlan } from '@/lib/meal-generator';
import { Droplets, Plus, Minus, CheckCircle2, Circle, ArrowRight, Zap, Flame, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import type { DailyMealPlan } from '@/types';

function WaterTracker({ consumed, target, onAdd }: { consumed: number; target: number; onAdd: (ml: number) => void }) {
  const pct = Math.min(100, (consumed / target) * 100);
  const glasses = Math.floor(consumed / 250);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplets size={18} className="text-cyan-500" />
            <span className="font-semibold text-slate-900 dark:text-slate-100">Pitný režim</span>
          </div>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {consumed}&thinsp;/&thinsp;{target}&thinsp;ml
          </span>
        </div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 flex-wrap flex-1">
            {Array.from({ length: Math.ceil(target / 250) }).map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full border-2 transition-colors ${i < glasses ? 'bg-cyan-400 border-cyan-400' : 'border-slate-300 dark:border-slate-600'}`}
              />
            ))}
          </div>
          <div className="flex gap-1.5 shrink-0">
            {[250, 500].map((ml) => (
              <button
                key={ml}
                onClick={() => onAdd(ml)}
                className="px-2.5 py-1.5 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 rounded-lg text-xs font-semibold hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-colors"
              >
                +{ml}ml
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MealItem({ meal, date, onToggle }: { meal: any; date: string; onToggle: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl border transition-colors ${meal.completed ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
      <button
        className="w-full flex items-center gap-3 p-3 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="shrink-0"
        >
          {meal.completed
            ? <CheckCircle2 size={20} className="text-green-500" />
            : <Circle size={20} className="text-slate-300 dark:text-slate-600" />
          }
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{MEAL_TYPE_LABELS[meal.type]}</div>
          <div className={`text-sm font-semibold truncate ${meal.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
            {meal.name}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{meal.totalCalories}&thinsp;kcal</div>
          <div className="text-xs text-slate-500">B:{meal.totalProtein}g S:{meal.totalCarbs}g T:{meal.totalFat}g</div>
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 border-t border-slate-100 dark:border-slate-700 mt-0 pt-2">
          <div className="space-y-1 mb-2">
            {meal.ingredients.map((ing: any, i: number) => (
              <div key={i} className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>{ing.foodName}</span>
                <span className="font-medium">
                  {ing.amountRaw}g
                  {ing.amountCooked && <span className="text-slate-400 ml-1">(uv. ~{ing.amountCooked}g)</span>}
                </span>
              </div>
            ))}
          </div>
          {meal.instructions.length > 0 && (
            <div className="mt-2">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Postup:</div>
              <ol className="space-y-0.5">
                {meal.instructions.map((step: string, i: number) => (
                  <li key={i} className="text-xs text-slate-600 dark:text-slate-400">
                    {i + 1}. {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
          <Link
            href={`/meal-plan?date=${date}&meal=${meal.id}`}
            className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium hover:underline"
          >
            Vyměnit jídlo <ArrowRight size={12} />
          </Link>
        </div>
      )}
    </div>
  );
}

export function DashboardView() {
  const { profile, macroTargets, currentMealPlan, setMealPlan, toggleMealComplete, waterToday, addWater } = useAppStore();

  const today = getTodayString();
  const todayPlan = currentMealPlan?.days.find((d) => d.date === today);

  const consumed = todayPlan?.meals.filter((m) => m.completed).reduce(
    (acc, m) => ({
      calories: acc.calories + m.totalCalories,
      protein: acc.protein + m.totalProtein,
      carbs: acc.carbs + m.totalCarbs,
      fat: acc.fat + m.totalFat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  ) ?? { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const handleGeneratePlan = () => {
    if (!profile || !macroTargets) return;
    const plan = generateMealPlan(profile, macroTargets, 7);
    setMealPlan(plan);
  };

  if (!profile || !macroTargets) return null;

  const waterTarget = macroTargets.water;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {getDayName(today)}, {formatDate(today)}
          </p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Ahoj, {profile.name}!
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleGeneratePlan}
            title="Vygenerovat nový jídelníček"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <RefreshCw size={18} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>

      {/* Carb cycle badge */}
      {todayPlan?.carbCyclePhase && (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getPhaseColor(todayPlan.carbCyclePhase)}`}>
          <Zap size={14} />
          Dnešní fáze: {getPhaseLabel(todayPlan.carbCyclePhase)} ({todayPlan.targetCarbs}g sacharidů)
        </div>
      )}

      {/* Macro overview */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Flame size={16} className="text-orange-500" />
              Denní makra
            </span>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {consumed.calories}
              <span className="text-sm font-normal text-slate-500 ml-1">/ {macroTargets.calories} kcal</span>
            </span>
          </div>

          <div className="flex justify-around mb-4">
            <MacroRing label="Bílkoviny" current={consumed.protein} target={macroTargets.protein} unit="g" color="#3b82f6" />
            <MacroRing label="Sacharidy" current={consumed.carbs} target={macroTargets.carbs} unit="g" color="#f59e0b" />
            <MacroRing label="Tuky" current={consumed.fat} target={macroTargets.fat} unit="g" color="#ef4444" />
          </div>

          <div className="space-y-2">
            <MacroBar label="Kalorie" current={consumed.calories} target={macroTargets.calories} unit="kcal" color="#16a34a" />
          </div>
        </CardContent>
      </Card>

      {/* Water tracker */}
      <WaterTracker consumed={waterToday} target={waterTarget} onAdd={addWater} />

      {/* Today's meals */}
      {todayPlan ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Dnešní jídla</h2>
            <Badge variant="gray">{todayPlan.meals.filter((m) => m.completed).length}/{todayPlan.meals.length} splněno</Badge>
          </div>
          {todayPlan.meals.map((meal) => (
            <MealItem
              key={meal.id}
              meal={meal}
              date={today}
              onToggle={() => toggleMealComplete(today, meal.id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center space-y-3">
            <p className="text-slate-600 dark:text-slate-400">Nemáš vygenerovaný jídelníček na dnešek.</p>
            <Button onClick={handleGeneratePlan}>
              Vygenerovat jídelníček na 7 dní
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/weight-tracker">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-lg">⚖️</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Zaznamenat váhu</div>
                <div className="text-xs text-slate-500">Sleduj pokrok</div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/ai-advisor">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="text-lg">🤖</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">AI Rádce</div>
                <div className="text-xs text-slate-500">Zeptej se</div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
