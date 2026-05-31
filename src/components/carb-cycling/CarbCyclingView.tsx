'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Input';
import { getCarbCyclePattern } from '@/lib/meal-generator';
import { generateMealPlan } from '@/lib/meal-generator';
import { getPhaseColor, getPhaseLabel } from '@/lib/utils';
import { Zap, RefreshCw, Info } from 'lucide-react';
import type { CarbCycleType } from '@/types';

const CYCLE_DESCRIPTIONS: Record<CarbCycleType, { name: string; desc: string; suitable: string }> = {
  simple: {
    name: 'Jednoduché vlny',
    desc: 'Střídání nízkých (80g), středních (150g) a vysokých (220g) dní. Vhodné pro začátečníky.',
    suitable: 'Začátečníci, mírné hubnutí',
  },
  moderate: {
    name: 'Mírné vlny',
    desc: 'Obsahuje nulový den (30g), nízký (60g), střední (120g) a vysoký (220g) den.',
    suitable: 'Středně pokročilí, hubnutí s udržením svalů',
  },
  hard: {
    name: 'Tvrdší vlny',
    desc: 'Dva nulové dny (20g) a jeden nabíjecí den (250g). Výrazný efekt na hubnutí.',
    suitable: 'Pokročilí, rychlé hubnutí',
  },
  custom: {
    name: 'Vlastní nastavení',
    desc: 'Nastav si vlastní vzor sacharidových vln.',
    suitable: 'Pro zkušené uživatele',
  },
};

const PHASE_FOOD_TIPS: Record<string, { foods: string[]; avoid: string[] }> = {
  zero: {
    foods: ['Maso, ryby, vejce', 'Zelenina (okurka, špenát, brokolice)', 'Zdravé tuky (avokádo, ořechy, olej)', 'Tvaroh, řecký jogurt'],
    avoid: ['Přílohy (rýže, brambory, těstoviny)', 'Ovoce', 'Pečivo', 'Luštěniny'],
  },
  low: {
    foods: ['Kuřecí prsa, krůtí, hovězí', 'Vejce, šunka', 'Zelenina všeho druhu', 'Tvaroh, skyr'],
    avoid: ['Velké porce rýže nebo brambor', 'Sladké ovoce', 'Bílé pečivo'],
  },
  medium: {
    foods: ['Rýže (50–80g suché)', 'Brambory (200g)', 'Ovoce (1–2 porce)', 'Normální množství masa'],
    avoid: ['Přílišné množství tuků', 'Alkohol'],
  },
  high: {
    foods: ['Rýže (80–150g suché)', 'Brambory, sladké brambory', 'Těstoviny, pohanka', 'Ovoce, banán', 'Ovesné vločky'],
    avoid: ['Velké množství tuků v jednom jídle', 'Sladkosti s přidaným cukrem'],
  },
};

export function CarbCyclingView() {
  const { profile, macroTargets, currentMealPlan, setMealPlan } = useAppStore();
  const [cycleType, setCycleType] = useState<CarbCycleType>('simple');
  const [generating, setGenerating] = useState(false);

  const pattern = getCarbCyclePattern(cycleType);
  const desc = CYCLE_DESCRIPTIONS[cycleType];

  const handleGenerate = async () => {
    if (!profile || !macroTargets) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 400));
    const carbCycleConfig = { type: cycleType, pattern };
    const plan = generateMealPlan(profile, macroTargets, 7, carbCycleConfig);
    setMealPlan(plan);
    setGenerating(false);
  };

  if (!profile || !macroTargets) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sacharidové vlny</h1>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 flex gap-2">
        <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Sacharidové vlny (carb cycling) střídají dny s různým množstvím sacharidů. Pomáhají hubnout, udržet svalovou hmotu a předcházet metabolickému přizpůsobení.
        </p>
      </div>

      {/* Type selector */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <Select
            label="Typ sacharidových vln"
            value={cycleType}
            onChange={(e) => setCycleType(e.target.value as CarbCycleType)}
            options={Object.entries(CYCLE_DESCRIPTIONS).map(([v, d]) => ({
              value: v,
              label: d.name,
            }))}
          />
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-sm">
            <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">{desc.name}</div>
            <p className="text-slate-600 dark:text-slate-400 text-xs">{desc.desc}</p>
            <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">Vhodné pro: {desc.suitable}</p>
          </div>
        </CardContent>
      </Card>

      {/* 7-day pattern */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Vzor na 7 dní</h3>
          <div className="grid grid-cols-7 gap-1.5">
            {pattern.map((day) => (
              <div
                key={day.day}
                className={`flex flex-col items-center p-2 rounded-xl border text-center ${getPhaseColor(day.phase)}`}
              >
                <div className="text-xs font-bold mb-0.5">Den {day.day}</div>
                <div className="text-xs font-semibold">{day.carbGrams}g</div>
                <div className="text-xs opacity-75 leading-tight mt-0.5">{day.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Phase guides */}
      <div className="space-y-3">
        {['zero', 'low', 'medium', 'high'].map((phase) => {
          const tips = PHASE_FOOD_TIPS[phase];
          const color = getPhaseColor(phase);
          const phases = pattern.filter((d) => d.phase === phase);
          if (phases.length === 0) return null;

          return (
            <Card key={phase}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={16} className={phase === 'zero' ? 'text-red-500' : phase === 'low' ? 'text-orange-500' : phase === 'medium' ? 'text-blue-500' : 'text-green-500'} />
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">{getPhaseLabel(phase)}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs border ${color}`}>
                    {phases[0].carbGrams}{phases.length > 1 ? `–${phases[phases.length-1].carbGrams}` : ''}g sacharidů
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-green-700 dark:text-green-400 font-medium mb-1">✓ Jez</div>
                    <ul className="space-y-0.5 text-slate-600 dark:text-slate-400">
                      {tips.foods.map((f, i) => <li key={i}>• {f}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="text-red-600 dark:text-red-400 font-medium mb-1">✗ Omez</div>
                    <ul className="space-y-0.5 text-slate-600 dark:text-slate-400">
                      {tips.avoid.map((f, i) => <li key={i}>• {f}</li>)}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button
        onClick={handleGenerate}
        loading={generating}
        fullWidth
        size="lg"
      >
        <RefreshCw size={16} />
        Vygenerovat 7denní jídelníček se sacharidovými vlnami
      </Button>

      {currentMealPlan?.carbCycleConfig && (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
          ✓ Jídelníček se sacharidovými vlnami je vygenerován. Přejdi do sekce &ldquo;Jídelníček&rdquo; pro zobrazení.
        </div>
      )}
    </div>
  );
}
