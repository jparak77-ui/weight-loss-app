import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' });
}

export function getDayName(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('cs-CZ', { weekday: 'long' });
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: 'Snídaně',
  snack1: 'Svačina',
  lunch: 'Oběd',
  snack2: 'Svačina 2',
  dinner: 'Večeře',
  snack3: 'Svačina 3',
};

export const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: 'Minimální pohyb (kancelář, žádný sport)',
  light: 'Lehká aktivita (1–3× sport týdně)',
  moderate: 'Střední aktivita (3–5× sport týdně)',
  active: 'Vysoká aktivita (5–6× sport týdně)',
  very_active: 'Sportovec (2× denně nebo fyzicky náročné zaměstnání)',
};

export const GOAL_LABELS: Record<string, string> = {
  lose_weight: 'Hubnout',
  maintain: 'Udržení váhy',
  gain_muscle: 'Nabírání svalové hmoty',
  lean_bulk: 'Rýsování postavy',
  carb_cycling: 'Sacharidové vlny',
};

export const DIET_TYPE_LABELS: Record<string, string> = {
  classic_deficit: 'Klasický kalorický deficit',
  low_carb: 'Nízkosacharidová dieta',
  carb_cycling: 'Sacharidové vlny',
  high_protein: 'Vysokoproteinový jídelníček',
  budget: 'Levný jídelníček',
  no_chicken: 'Bez kuřecího masa',
  no_fish: 'Bez ryb',
  no_dairy: 'Bez mléčných výrobků',
  vegetarian: 'Vegetariánský jídelníček',
  work_friendly: 'Jídelníček do práce',
  no_cooking: 'Jídelníček bez vaření',
};

export const LOSS_SPEED_LABELS: Record<string, { label: string; desc: string; warning?: string }> = {
  slow: { label: 'Pomalé hubnutí', desc: 'cca −0,25 kg/týden (deficit 250 kcal/den)' },
  medium: { label: 'Střední hubnutí', desc: 'cca −0,5 kg/týden (deficit 500 kcal/den)' },
  fast: {
    label: 'Rychlejší hubnutí',
    desc: 'cca −0,75 kg/týden (deficit 750 kcal/den)',
    warning: 'Příliš velký deficit není dlouhodobě vhodný. Může dojít ke ztrátě svalové hmoty.',
  },
};

export const ALLERGEN_LABELS: Record<string, string> = {
  gluten: 'Lepek (gluten)',
  dairy: 'Mléčné výrobky (laktóza)',
  eggs: 'Vejce',
  nuts: 'Ořechy',
  fish: 'Ryby',
  shellfish: 'Korýši a měkkýši',
  soy: 'Sója',
  sesame: 'Sezam',
};

export const CATEGORY_ICONS: Record<string, string> = {
  meat: '🥩',
  fish: '🐟',
  eggs: '🥚',
  dairy: '🥛',
  vegetables: '🥦',
  fruit: '🍎',
  grains: '🌾',
  legumes: '🫘',
  bread: '🍞',
  fats: '🥑',
  sweets: '🍫',
  spices: '🧂',
  other: '📦',
};

export function getMoodLabel(value: number): string {
  const labels = ['', 'Špatná', 'Podprůměrná', 'Průměrná', 'Dobrá', 'Výborná'];
  return labels[value] || '';
}

export function getEnergyLabel(value: number): string {
  const labels = ['', 'Žádná', 'Nízká', 'Střední', 'Dobrá', 'Vysoká'];
  return labels[value] || '';
}

export function getPhaseColor(phase?: string): string {
  switch (phase) {
    case 'zero': return 'text-red-600 bg-red-50 border-red-200';
    case 'low': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'high': return 'text-green-600 bg-green-50 border-green-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function formatIngredientAmount(ing: import('@/types').MealIngredient): string {
  if (ing.displayUnit && ing.displayUnit !== 'g' && ing.displayUnit !== 'ml' && ing.displayCount) {
    return `${ing.displayCount} ${ing.displayUnit}`;
  }
  if (ing.displayUnit === 'ml') {
    return `${ing.amountRaw} ml`;
  }
  return `${ing.amountRaw} g`;
}

export function formatIngredientDetail(ing: import('@/types').MealIngredient): string {
  const base = formatIngredientAmount(ing);
  // pro vejce nebo ks ukážeme i gramy
  if (ing.displayUnit && ing.displayUnit !== 'g' && ing.displayUnit !== 'ml' && ing.displayCount) {
    const cookedInfo = ing.amountCooked ? ` → ~${ing.amountCooked} g uvařeno` : '';
    return `${base} (${ing.amountRaw} g)${cookedInfo}`;
  }
  if (ing.amountCooked) {
    return `${base} → ~${ing.amountCooked} g uvařeno`;
  }
  return base;
}

export function getPhaseLabel(phase?: string): string {
  switch (phase) {
    case 'zero': return 'Nulové sacharidy';
    case 'low': return 'Nízké sacharidy';
    case 'medium': return 'Střední sacharidy';
    case 'high': return 'Vysoké sacharidy';
    default: return '';
  }
}
