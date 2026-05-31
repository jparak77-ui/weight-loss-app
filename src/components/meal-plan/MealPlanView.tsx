'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MEAL_TYPE_LABELS, formatDate, getDayName, getPhaseColor, getPhaseLabel, formatIngredientDetail } from '@/lib/utils';
import { generateMealPlan, generateShoppingList } from '@/lib/meal-generator';
import { Select } from '@/components/ui/Input';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, RefreshCw, ShoppingBag, Zap } from 'lucide-react';
import type { DailyMealPlan, Meal } from '@/types';

function MealCard({ meal, date, onToggle }: { meal: Meal; date: string; onToggle: () => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`rounded-xl border transition-colors ${meal.completed ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
      <button className="w-full flex items-center gap-3 p-3 text-left" onClick={() => setExpanded(!expanded)}>
        <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className="shrink-0">
          {meal.completed
            ? <CheckCircle2 size={20} className="text-green-500" />
            : <Circle size={20} className="text-slate-300 dark:text-slate-600" />
          }
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-slate-500 font-medium">{MEAL_TYPE_LABELS[meal.type]}</div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{meal.name}</div>
        </div>
        <div className="text-right shrink-0 mr-1">
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{meal.totalCalories}&thinsp;kcal</div>
          <div className="text-xs text-slate-500">B:{meal.totalProtein}g S:{meal.totalCarbs}g</div>
        </div>
        {expanded ? <ChevronUp size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
      </button>
      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-slate-100 dark:border-slate-700 space-y-3">
          <div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Suroviny:</div>
            <div className="space-y-1">
              {meal.ingredients.map((ing, i) => (
                <div key={i} className="flex justify-between items-start gap-2 text-xs py-0.5">
                  <span className="text-slate-700 dark:text-slate-300">{ing.foodName}</span>
                  <span className="text-right shrink-0">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatIngredientDetail(ing)}
                    </span>
                    <span className="text-slate-400 ml-1">({ing.calories} kcal)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Příprava:</div>
            <ol className="space-y-0.5">
              {meal.instructions.map((step, i) => (
                <li key={i} className="text-xs text-slate-600 dark:text-slate-400">{i + 1}. {step}</li>
              ))}
            </ol>
          </div>
          <div className="flex justify-between text-xs bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg">
            <span>Bílkoviny: <strong>{meal.totalProtein}g</strong></span>
            <span>Sacharidy: <strong>{meal.totalCarbs}g</strong></span>
            <span>Tuky: <strong>{meal.totalFat}g</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}

function DayCard({ day }: { day: DailyMealPlan }) {
  const [expanded, setExpanded] = useState(false);
  const { toggleMealComplete } = useAppStore();
  const completedCount = day.meals.filter((m) => m.completed).length;
  const isToday = day.date === new Date().toISOString().split('T')[0];

  return (
    <Card className={isToday ? 'ring-2 ring-green-500 dark:ring-green-400' : ''}>
      <button
        className="w-full p-4 flex items-center justify-between text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                {getDayName(day.date)}
              </span>
              {isToday && <Badge variant="green">Dnes</Badge>}
              {day.carbCyclePhase && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPhaseColor(day.carbCyclePhase)}`}>
                  {getPhaseLabel(day.carbCyclePhase)}
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500">{formatDate(day.date)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{day.totalCalories}&thinsp;kcal</div>
            <div className="text-xs text-slate-500">{completedCount}/{day.meals.length} jídel</div>
          </div>
          {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2 border-t border-slate-100 dark:border-slate-700 pt-3">
          {day.carbCyclePhase && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border ${getPhaseColor(day.carbCyclePhase)}`}>
              <Zap size={12} />
              Cíl sacharidů dnes: {day.targetCarbs}g | Bílkoviny min.: {day.targetProtein}g
            </div>
          )}
          {day.meals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              date={day.date}
              onToggle={() => toggleMealComplete(day.date, meal.id)}
            />
          ))}
          <div className="grid grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl text-xs text-center">
            <div><div className="font-bold text-slate-900 dark:text-slate-100">{day.totalCalories}</div><div className="text-slate-500">kcal</div></div>
            <div><div className="font-bold text-blue-600">{day.totalProtein}g</div><div className="text-slate-500">bílk.</div></div>
            <div><div className="font-bold text-amber-600">{day.totalCarbs}g</div><div className="text-slate-500">sachar.</div></div>
            <div><div className="font-bold text-red-500">{day.totalFat}g</div><div className="text-slate-500">tuky</div></div>
          </div>
        </div>
      )}
    </Card>
  );
}

export function MealPlanView() {
  const { profile, macroTargets, currentMealPlan, setMealPlan, setShoppingList } = useAppStore();
  const [duration, setDuration] = useState('7');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!profile || !macroTargets) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 300));
    const plan = generateMealPlan(profile, macroTargets, Number(duration));
    setMealPlan(plan);
    setGenerating(false);
  };

  const handleShoppingList = () => {
    if (!currentMealPlan) return;
    const list = generateShoppingList(currentMealPlan);
    setShoppingList(list as any);
  };

  if (!profile || !macroTargets) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Jídelníček</h1>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[120px]">
            <Select
              label="Délka jídelníčku"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              options={[
                { value: '1', label: '1 den' },
                { value: '3', label: '3 dny' },
                { value: '7', label: '7 dní' },
                { value: '14', label: '14 dní' },
              ]}
            />
          </div>
          <Button onClick={handleGenerate} loading={generating}>
            <RefreshCw size={16} /> Vygenerovat
          </Button>
          {currentMealPlan && (
            <Button variant="secondary" onClick={handleShoppingList}>
              <ShoppingBag size={16} /> Nákupní seznam
            </Button>
          )}
        </CardContent>
      </Card>

      {currentMealPlan ? (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Kcal/den', value: macroTargets.calories, color: 'text-green-600' },
              { label: 'Bílkoviny', value: `${macroTargets.protein}g`, color: 'text-blue-600' },
              { label: 'Sacharidy', value: `${macroTargets.carbs}g`, color: 'text-amber-600' },
              { label: 'Tuky', value: `${macroTargets.fat}g`, color: 'text-red-500' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white dark:bg-slate-800 rounded-xl p-3 text-center border border-slate-100 dark:border-slate-700">
                <div className={`text-lg font-bold ${color}`}>{value}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            ))}
          </div>

          {currentMealPlan.days.map((day) => (
            <DayCard key={day.date} day={day} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <div className="text-4xl">🍽️</div>
            <p className="text-slate-600 dark:text-slate-400">Zatím nemáš vygenerovaný jídelníček.</p>
            <p className="text-sm text-slate-500">Vyber délku a klikni na "Vygenerovat".</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
