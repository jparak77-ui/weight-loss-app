import type {
  DailyMealPlan,
  Meal,
  MealIngredient,
  MealType,
  DietType,
  CarbCycleConfig,
  CarbCycleDay,
  CarbCycleType,
  DailyMacroTargets,
  UserProfile,
} from '@/types';
import { FOODS, filterFoodsForDiet, FOOD_MAP } from './foods';
import type { FoodItem } from '@/types';
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function calcFoodNutrition(food: FoodItem, grams: number) {
  return {
    calories: Math.round((food.caloriesPer100g * grams) / 100),
    protein: Math.round((food.proteinPer100g * grams) / 100 * 10) / 10,
    carbs: Math.round((food.carbsPer100g * grams) / 100 * 10) / 10,
    fat: Math.round((food.fatPer100g * grams) / 100 * 10) / 10,
  };
}

interface MealTemplate {
  type: MealType;
  name: string;
  proteinFoods: string[];
  carbFoods: string[];
  fatFoods: string[];
  vegFoods: string[];
  instructions: string[];
  lowCarb?: boolean;
  highCarb?: boolean;
}

const MEAL_TEMPLATES: MealTemplate[] = [
  {
    type: 'breakfast',
    name: 'Omeleta se zeleninou',
    proteinFoods: ['egg', 'ham', 'cheese_edam'],
    carbFoods: ['bread_whole'],
    fatFoods: ['olive_oil'],
    vegFoods: ['tomato', 'bell_pepper', 'spinach'],
    instructions: ['Rozklepni vejce do misky a rozšlehej.', 'Na pánvi rozehřej olivový olej.', 'Přidej zeleninu a lehce orestuj.', 'Vlij vajíčka a nech ztuhnut.', 'Přelož a podávej se šunkou.'],
    lowCarb: true,
  },
  {
    type: 'breakfast',
    name: 'Ovesná kaše s ovocem',
    proteinFoods: ['skyr', 'protein_yogurt'],
    carbFoods: ['oats', 'banana', 'berries'],
    fatFoods: ['almonds', 'peanut_butter'],
    vegFoods: ['strawberry'],
    instructions: ['Uvař ovesné vločky s vodou nebo mlékem.', 'Přidej ovoce a ořechy.', 'Dochuť skyr nebo proteinovým jogurtem.'],
    highCarb: true,
  },
  {
    type: 'breakfast',
    name: 'Tvaroh s ovocem',
    proteinFoods: ['cottage_cheese', 'skyr'],
    carbFoods: ['berries', 'banana'],
    fatFoods: ['almonds'],
    vegFoods: [],
    instructions: ['Smíchej tvaroh s ovocem.', 'Posyp nasekanými mandlemi.'],
    lowCarb: true,
  },
  {
    type: 'breakfast',
    name: 'Míchaná vejce se šunkou',
    proteinFoods: ['egg', 'ham'],
    carbFoods: ['bread_whole', 'rye_bread'],
    fatFoods: ['butter'],
    vegFoods: ['tomato', 'cucumber'],
    instructions: ['Rozklepni vejce a zamíchej.', 'Opraž na pánvi s máslem.', 'Přidej šunku.', 'Podávej s chlebem a zeleninou.'],
    lowCarb: true,
  },
  {
    type: 'lunch',
    name: 'Kuřecí prsa s rýží a zeleninou',
    proteinFoods: ['chicken_breast'],
    carbFoods: ['rice'],
    fatFoods: ['olive_oil'],
    vegFoods: ['broccoli', 'carrot', 'zucchini'],
    instructions: ['Nakrájej kuřecí prsa na kousky a okoření.', 'Opéci na olivovém oleji do zlatova.', 'Uvař rýži.', 'Zeleninu blanšíruj nebo orestuj.', 'Dej dohromady a podávej.'],
    highCarb: true,
  },
  {
    type: 'lunch',
    name: 'Hovězí se sladkými bramborami',
    proteinFoods: ['beef', 'ground_beef'],
    carbFoods: ['sweet_potato'],
    fatFoods: ['olive_oil'],
    vegFoods: ['spinach', 'bell_pepper'],
    instructions: ['Uvař sladké brambory.', 'Opéci hovězí maso na oleji.', 'Přidej zeleninu.', 'Podávej se sladkými bramborami.'],
    highCarb: true,
  },
  {
    type: 'lunch',
    name: 'Losos s zeleninou (bez přílohy)',
    proteinFoods: ['salmon'],
    carbFoods: [],
    fatFoods: ['olive_oil', 'avocado'],
    vegFoods: ['broccoli', 'zucchini', 'spinach'],
    instructions: ['Lososový filet okoření a opéci na olivovém oleji.', 'Zeleninu orestuj.', 'Podávej s avokádem.'],
    lowCarb: true,
  },
  {
    type: 'lunch',
    name: 'Vepřová panenka s brambory',
    proteinFoods: ['pork_loin'],
    carbFoods: ['potato'],
    fatFoods: ['olive_oil'],
    vegFoods: ['cabbage', 'carrot'],
    instructions: ['Nakrájej vepřovou panenku.', 'Opéci na oleji.', 'Uvař brambory.', 'Udělej zeleninový salát.'],
    highCarb: true,
  },
  {
    type: 'lunch',
    name: 'Tuňák s vejci a zeleninou',
    proteinFoods: ['tuna_canned', 'egg'],
    carbFoods: ['crispbread'],
    fatFoods: ['olive_oil'],
    vegFoods: ['cucumber', 'tomato', 'lettuce'],
    instructions: ['Smíchej tuňáka s nakrájenou zeleninou.', 'Uvař vejce natvrdo.', 'Polij olivovým olejem.', 'Podávej s knäckebrotem.'],
    lowCarb: true,
  },
  {
    type: 'dinner',
    name: 'Kuřecí salát s avokádem',
    proteinFoods: ['chicken_breast'],
    carbFoods: [],
    fatFoods: ['avocado', 'olive_oil'],
    vegFoods: ['lettuce', 'tomato', 'cucumber', 'bell_pepper'],
    instructions: ['Uvař nebo opéci kuřecí prsa.', 'Nakrájej všechnu zeleninu.', 'Přidej avokádo.', 'Polij olivovým olejem.'],
    lowCarb: true,
  },
  {
    type: 'dinner',
    name: 'Tvarohový dezert',
    proteinFoods: ['cottage_cheese'],
    carbFoods: ['berries'],
    fatFoods: ['almonds'],
    vegFoods: [],
    instructions: ['Smíchej tvaroh s ovocem.', 'Posyp ořechy.'],
    lowCarb: true,
  },
  {
    type: 'dinner',
    name: 'Hovězí polévka se zeleninou',
    proteinFoods: ['beef'],
    carbFoods: ['potato'],
    fatFoods: [],
    vegFoods: ['carrot', 'cabbage', 'onion', 'mushrooms'],
    instructions: ['Uvaž hovězí maso v osolené vodě.', 'Přidej zeleninu.', 'Vař 60 minut do měkka.', 'Dochuť kořením.'],
  },
  {
    type: 'snack1',
    name: 'Řecký jogurt s ořechy',
    proteinFoods: ['greek_yogurt'],
    carbFoods: ['berries'],
    fatFoods: ['almonds'],
    vegFoods: [],
    instructions: ['Smíchej jogurt s ovocem a ořechy.'],
  },
  {
    type: 'snack1',
    name: 'Proteinový shake',
    proteinFoods: ['whey_protein'],
    carbFoods: ['banana'],
    fatFoods: [],
    vegFoods: [],
    instructions: ['Smíchej protein s vodou nebo mlékem.', 'Přidej banán.', 'Rozmixuj.'],
  },
  {
    type: 'snack2',
    name: 'Tvaroh s ovocem',
    proteinFoods: ['cottage_cheese'],
    carbFoods: ['strawberry'],
    fatFoods: [],
    vegFoods: [],
    instructions: ['Smíchej tvaroh s ovocem.'],
  },
  {
    type: 'snack2',
    name: 'Ořechy se skyr',
    proteinFoods: ['skyr'],
    carbFoods: [],
    fatFoods: ['nuts_mixed'],
    vegFoods: [],
    instructions: ['Podávej skyr s ořechy.'],
    lowCarb: true,
  },
];

export function getCarbCyclePattern(type: CarbCycleType): CarbCycleDay[] {
  switch (type) {
    case 'simple':
      return [
        { day: 1, label: 'Nízký', carbGrams: 80, phase: 'low', description: 'Více bílkovin a tuků' },
        { day: 2, label: 'Střední', carbGrams: 150, phase: 'medium', description: 'Vyvážený den' },
        { day: 3, label: 'Vysoký', carbGrams: 220, phase: 'high', description: 'Doplnění glykogenu' },
        { day: 4, label: 'Nízký', carbGrams: 80, phase: 'low', description: 'Více bílkovin a tuků' },
        { day: 5, label: 'Střední', carbGrams: 150, phase: 'medium', description: 'Vyvážený den' },
        { day: 6, label: 'Vysoký', carbGrams: 220, phase: 'high', description: 'Doplnění glykogenu' },
        { day: 7, label: 'Nízký', carbGrams: 80, phase: 'low', description: 'Více bílkovin a tuků' },
      ];
    case 'moderate':
      return [
        { day: 1, label: 'Nízký', carbGrams: 60, phase: 'low', description: 'Více bílkovin a tuků' },
        { day: 2, label: 'Střední', carbGrams: 120, phase: 'medium', description: 'Vyvážený den' },
        { day: 3, label: 'Vysoký', carbGrams: 220, phase: 'high', description: 'Doplnění glykogenu' },
        { day: 4, label: 'Nulový', carbGrams: 30, phase: 'zero', description: 'Ketogenní den' },
        { day: 5, label: 'Nízký', carbGrams: 60, phase: 'low', description: 'Více bílkovin a tuků' },
        { day: 6, label: 'Střední', carbGrams: 120, phase: 'medium', description: 'Vyvážený den' },
        { day: 7, label: 'Vysoký', carbGrams: 220, phase: 'high', description: 'Doplnění glykogenu' },
      ];
    case 'hard':
      return [
        { day: 1, label: 'Nulový', carbGrams: 20, phase: 'zero', description: 'Extrémně nízké sacharidy' },
        { day: 2, label: 'Nulový', carbGrams: 20, phase: 'zero', description: 'Extrémně nízké sacharidy' },
        { day: 3, label: 'Vysoký', carbGrams: 250, phase: 'high', description: 'Nabíjecí den' },
        { day: 4, label: 'Nulový', carbGrams: 20, phase: 'zero', description: 'Extrémně nízké sacharidy' },
        { day: 5, label: 'Nulový', carbGrams: 20, phase: 'zero', description: 'Extrémně nízké sacharidy' },
        { day: 6, label: 'Střední', carbGrams: 100, phase: 'medium', description: 'Přechodný den' },
        { day: 7, label: 'Vysoký', carbGrams: 250, phase: 'high', description: 'Nabíjecí den' },
      ];
    default:
      return getCarbCyclePattern('simple');
  }
}

function roundToStep(value: number, step: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value / step) * step));
}

function toNaturalUnit(food: FoodItem, grams: number): { displayCount: number; displayUnit: string; actualGrams: number } {
  if (food.gramsPerUnit && food.unit && food.unit !== 'g' && food.unit !== 'ml') {
    const count = Math.max(1, Math.round(grams / food.gramsPerUnit));
    return { displayCount: count, displayUnit: food.unit, actualGrams: count * food.gramsPerUnit };
  }
  // zaokrouhlit na praktické číslo podle kategorie
  let step = 25;
  let min = 25;
  let max = 500;
  if (food.category === 'fats' && food.unit === 'ml') { step = 5; min = 5; max = 25; }
  else if (food.category === 'fats') { step = 5; min = 5; max = 40; }
  else if (food.category === 'grains') { step = 10; min = 30; max = 200; }
  else if (food.category === 'vegetables' || food.category === 'fruit') { step = 25; min = 50; max = 300; }
  else if (food.category === 'meat' || food.category === 'fish') { step = 25; min = 100; max = 350; }
  else if (food.category === 'dairy') { step = 25; min = 75; max = 300; }
  const rounded = roundToStep(grams, step, min, max);
  return { displayCount: rounded, displayUnit: food.unit || 'g', actualGrams: rounded };
}

function buildIngredient(food: FoodItem, gramsTarget: number): MealIngredient {
  const { displayCount, displayUnit, actualGrams } = toNaturalUnit(food, gramsTarget);
  const nutrition = calcFoodNutrition(food, actualGrams);
  const cookedGrams = food.cookingMultiplier
    ? Math.round(actualGrams * food.cookingMultiplier)
    : undefined;
  return {
    foodId: food.id,
    foodName: food.name,
    amountRaw: actualGrams,
    amountCooked: cookedGrams,
    unit: food.unit || 'g',
    displayCount,
    displayUnit,
    ...nutrition,
  };
}

function buildMealFromTemplate(
  template: MealTemplate,
  targetCalories: number,
  targetProtein: number,
  targetCarbs: number,
  availableFoods: FoodItem[],
  isLowCarb: boolean
): Meal {
  const ingredients: MealIngredient[] = [];
  let totalCals = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  const addNutrition = (ing: MealIngredient) => {
    totalCals += ing.calories;
    totalProtein += ing.protein;
    totalCarbs += ing.carbs;
    totalFat += ing.fat;
  };

  const getFood = (ids: string[]): FoodItem | undefined => {
    for (const id of ids) {
      const food = availableFoods.find((f) => f.id === id);
      if (food) return food;
    }
    return undefined;
  };

  // --- bílkovinná složka ---
  const proteinFood = getFood(template.proteinFoods);
  if (proteinFood) {
    // cílový příjem bílkovin z tohoto jídla → kolik gramů potraviny
    const gramsTarget = (targetProtein * 0.85 / proteinFood.proteinPer100g) * 100;
    const ing = buildIngredient(proteinFood, gramsTarget);
    ingredients.push(ing);
    addNutrition(ing);
  }

  // --- druhá bílkovina (např. šunka k vejcím, tuňák + vejce) ---
  if (template.proteinFoods.length > 1) {
    const proteinFood2 = getFood(template.proteinFoods.slice(1));
    if (proteinFood2 && proteinFood2.id !== proteinFood?.id) {
      const gramsTarget = (targetProtein * 0.3 / proteinFood2.proteinPer100g) * 100;
      const ing = buildIngredient(proteinFood2, gramsTarget);
      ingredients.push(ing);
      addNutrition(ing);
    }
  }

  // --- sacharidová složka ---
  if (!isLowCarb && template.carbFoods.length > 0) {
    const carbFood = getFood(template.carbFoods);
    if (carbFood && carbFood.carbsPer100g > 8) {
      const remainingCals = Math.max(100, targetCalories - totalCals);
      const gramsTarget = (remainingCals * 0.40 / carbFood.caloriesPer100g) * 100;
      const ing = buildIngredient(carbFood, gramsTarget);
      ingredients.push(ing);
      addNutrition(ing);
    }
  }

  // --- zelenina ---
  const vegIds = template.vegFoods.slice(0, 2);
  for (const vegId of vegIds) {
    const vegFood = availableFoods.find((f) => f.id === vegId);
    if (vegFood) {
      const ing = buildIngredient(vegFood, isLowCarb ? 150 : 100);
      ingredients.push(ing);
      addNutrition(ing);
    }
  }

  // --- tuková složka (doplnění kalorií) ---
  if (totalCals < targetCalories * 0.65 && template.fatFoods.length > 0) {
    const fatFood = getFood(template.fatFoods);
    if (fatFood) {
      const remaining = targetCalories - totalCals;
      const gramsTarget = (remaining * 0.5 / fatFood.caloriesPer100g) * 100;
      const ing = buildIngredient(fatFood, gramsTarget);
      ingredients.push(ing);
      addNutrition(ing);
    }
  }

  // --- instrukce s reálnými gramáží ---
  const instructions = buildInstructions(template, ingredients);

  return {
    id: uuidv4(),
    type: template.type,
    name: template.name,
    ingredients,
    instructions,
    totalCalories: Math.round(totalCals),
    totalProtein: Math.round(totalProtein * 10) / 10,
    totalCarbs: Math.round(totalCarbs * 10) / 10,
    totalFat: Math.round(totalFat * 10) / 10,
    completed: false,
  };
}

function formatIngAmt(ing: MealIngredient): string {
  if (ing.displayUnit && ing.displayUnit !== 'g' && ing.displayUnit !== 'ml' && ing.displayCount) {
    return `${ing.displayCount} ${ing.displayUnit}`;
  }
  return `${ing.amountRaw} g`;
}

function buildInstructions(template: MealTemplate, ingredients: MealIngredient[]): string[] {
  // Nahraď generické instrukce konkrétními s gramážemi
  return template.instructions.map((step) => {
    let result = step;
    for (const ing of ingredients) {
      const amt = formatIngAmt(ing);
      // zkus nahradit "vejce", "rýži", "kuřecí", atd. konkrétní hodnotou
      const nameLower = ing.foodName.toLowerCase();
      if (result.toLowerCase().includes('vejce') && nameLower.includes('vejc')) {
        result = result.replace(/vejce/i, `${amt} vejce`);
      } else if (result.toLowerCase().includes('rýži') && nameLower.includes('rýž')) {
        result = result.replace(/rýži/i, `${amt} rýže`);
      } else if (result.toLowerCase().includes('ovesné vločky') && nameLower.includes('ovesn')) {
        result = result.replace(/ovesné vločky/i, `${amt} ovesných vloček`);
      }
    }
    return result;
  });
}

function getMealTypes(mealsPerDay: number): MealType[] {
  switch (mealsPerDay) {
    case 3: return ['breakfast', 'lunch', 'dinner'];
    case 4: return ['breakfast', 'snack1', 'lunch', 'dinner'];
    case 5: return ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner'];
    case 6: return ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner', 'snack3'];
    default: return ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner'];
  }
}

const MEAL_DISTRIBUTION: Record<MealType, number> = {
  breakfast: 0.25,
  snack1: 0.10,
  lunch: 0.35,
  snack2: 0.10,
  dinner: 0.20,
  snack3: 0.08,
};

export function generateDailyMealPlan(
  profile: UserProfile,
  targets: DailyMacroTargets,
  date: string,
  dayNumber: number,
  carbCycleDay?: CarbCycleDay
): DailyMealPlan {
  const isLowCarb =
    carbCycleDay?.phase === 'low' ||
    carbCycleDay?.phase === 'zero' ||
    profile.dietType === 'low_carb';

  const isHighCarb = carbCycleDay?.phase === 'high';

  const targetCalories = targets.calories;
  const targetProtein = targets.protein;
  let targetCarbs = carbCycleDay ? carbCycleDay.carbGrams : targets.carbs;
  const targetFat = targets.fat;

  const availableFoods = filterFoodsForDiet(
    FOODS,
    profile.dietType,
    profile.allergies,
    profile.dislikedFoods
  ).filter((f) => {
    if (isLowCarb) return f.suitableForLowCarb;
    if (isHighCarb) return f.suitableForHighCarb;
    return true;
  });

  const mealTypes = getMealTypes(profile.mealsPerDay);
  const meals: Meal[] = [];

  for (const mealType of mealTypes) {
    const distribution = MEAL_DISTRIBUTION[mealType] || 0.1;
    const mealCalories = Math.round(targetCalories * distribution);
    const mealProtein = Math.round(targetProtein * distribution);
    const mealCarbs = Math.round(targetCarbs * distribution);

    const templates = MEAL_TEMPLATES.filter((t) => {
      if (t.type !== mealType) return false;
      if (isLowCarb && t.highCarb) return false;
      if (isHighCarb && t.lowCarb && t.carbFoods.length === 0) return false;
      return true;
    });

    const template = templates[dayNumber % templates.length] || MEAL_TEMPLATES.find((t) => t.type === mealType)!;

    if (template) {
      const meal = buildMealFromTemplate(
        template,
        mealCalories,
        mealProtein,
        mealCarbs,
        availableFoods,
        isLowCarb
      );
      meals.push(meal);
    }
  }

  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.totalCalories,
      protein: acc.protein + meal.totalProtein,
      carbs: acc.carbs + meal.totalCarbs,
      fat: acc.fat + meal.totalFat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return {
    date,
    dayNumber,
    targetCalories,
    targetProtein,
    targetCarbs,
    targetFat,
    meals,
    totalCalories: Math.round(totals.calories),
    totalProtein: Math.round(totals.protein * 10) / 10,
    totalCarbs: Math.round(totals.carbs * 10) / 10,
    totalFat: Math.round(totals.fat * 10) / 10,
    waterMl: targets.water,
    carbCyclePhase: carbCycleDay?.phase,
    waterConsumed: 0,
  };
}

export function generateMealPlan(
  profile: UserProfile,
  targets: DailyMacroTargets,
  durationDays: number,
  carbCycleConfig?: CarbCycleConfig
): import('@/types').MealPlan {
  const days: DailyMealPlan[] = [];
  const startDate = new Date();

  for (let i = 0; i < durationDays; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    let carbCycleDay: CarbCycleDay | undefined;
    if (carbCycleConfig) {
      const pattern = carbCycleConfig.pattern;
      carbCycleDay = pattern[i % pattern.length];
    }

    days.push(generateDailyMealPlan(profile, targets, dateStr, i, carbCycleDay));
  }

  return {
    id: uuidv4(),
    userId: profile.id,
    createdAt: new Date().toISOString(),
    dietType: profile.dietType,
    days,
    durationDays,
    carbCycleConfig,
  };
}

export function generateShoppingList(mealPlan: import('@/types').MealPlan) {
  const items: Record<string, { foodId: string; foodName: string; category: string; totalAmount: number; unit: string }> = {};

  for (const day of mealPlan.days) {
    for (const meal of day.meals) {
      for (const ing of meal.ingredients) {
        const key = ing.foodId;
        const food = FOOD_MAP[ing.foodId];
        if (!items[key]) {
          items[key] = {
            foodId: ing.foodId,
            foodName: ing.foodName,
            category: food?.category || 'other',
            totalAmount: 0,
            unit: ing.unit,
          };
        }
        items[key].totalAmount += ing.amountRaw;
      }
    }
  }

  return Object.values(items).map((item) => ({
    ...item,
    totalAmount: Math.ceil(item.totalAmount / 10) * 10,
    checked: false,
  }));
}

