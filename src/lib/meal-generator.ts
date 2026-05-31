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

  const getFood = (ids: string[]): FoodItem | undefined => {
    for (const id of ids) {
      const food = availableFoods.find((f) => f.id === id);
      if (food) return food;
    }
    return availableFoods.find((f) => ids.some((id) => f.id === id));
  };

  const proteinFood = getFood(template.proteinFoods);
  if (proteinFood) {
    const proteinNeeded = Math.min(targetProtein, targetProtein * 0.8);
    const grams = Math.round((proteinNeeded / proteinFood.proteinPer100g) * 100);
    const clampedGrams = Math.max(80, Math.min(300, grams));
    const nutrition = calcFoodNutrition(proteinFood, clampedGrams);
    const cookedGrams = proteinFood.cookingMultiplier
      ? Math.round(clampedGrams * proteinFood.cookingMultiplier)
      : undefined;

    ingredients.push({
      foodId: proteinFood.id,
      foodName: proteinFood.name,
      amountRaw: clampedGrams,
      amountCooked: cookedGrams,
      unit: 'g',
      ...nutrition,
    });
    totalCals += nutrition.calories;
    totalProtein += nutrition.protein;
    totalCarbs += nutrition.carbs;
    totalFat += nutrition.fat;
  }

  if (!isLowCarb && template.carbFoods.length > 0) {
    const carbFood = getFood(template.carbFoods);
    if (carbFood && carbFood.carbsPer100g > 10) {
      const remainingCals = targetCalories - totalCals;
      const grams = Math.round((remainingCals * 0.4 * 100) / carbFood.caloriesPer100g);
      const clampedGrams = Math.max(50, Math.min(200, grams));
      const nutrition = calcFoodNutrition(carbFood, clampedGrams);
      const cookedGrams = carbFood.cookingMultiplier
        ? Math.round(clampedGrams * carbFood.cookingMultiplier)
        : undefined;

      ingredients.push({
        foodId: carbFood.id,
        foodName: carbFood.name,
        amountRaw: clampedGrams,
        amountCooked: cookedGrams,
        unit: 'g',
        ...nutrition,
      });
      totalCals += nutrition.calories;
      totalCarbs += nutrition.carbs;
      totalFat += nutrition.fat;
      totalProtein += nutrition.protein;
    }
  }

  const vegIds = template.vegFoods.slice(0, 2);
  for (const vegId of vegIds) {
    const vegFood = availableFoods.find((f) => f.id === vegId);
    if (vegFood) {
      const grams = isLowCarb ? 150 : 100;
      const nutrition = calcFoodNutrition(vegFood, grams);
      ingredients.push({
        foodId: vegFood.id,
        foodName: vegFood.name,
        amountRaw: grams,
        unit: 'g',
        ...nutrition,
      });
      totalCals += nutrition.calories;
      totalCarbs += nutrition.carbs;
      totalFat += nutrition.fat;
      totalProtein += nutrition.protein;
    }
  }

  if (totalCals < targetCalories * 0.7) {
    const fatFood = getFood(template.fatFoods);
    if (fatFood) {
      const remaining = targetCalories - totalCals;
      const grams = Math.round((remaining * 0.5 * 100) / fatFood.caloriesPer100g);
      const clampedGrams = Math.max(5, Math.min(30, grams));
      const nutrition = calcFoodNutrition(fatFood, clampedGrams);
      ingredients.push({
        foodId: fatFood.id,
        foodName: fatFood.name,
        amountRaw: clampedGrams,
        unit: fatFood.unit || 'g',
        ...nutrition,
      });
      totalCals += nutrition.calories;
      totalCarbs += nutrition.carbs;
      totalFat += nutrition.fat;
      totalProtein += nutrition.protein;
    }
  }

  return {
    id: uuidv4(),
    type: template.type,
    name: template.name,
    ingredients,
    instructions: template.instructions,
    totalCalories: Math.round(totalCals),
    totalProtein: Math.round(totalProtein * 10) / 10,
    totalCarbs: Math.round(totalCarbs * 10) / 10,
    totalFat: Math.round(totalFat * 10) / 10,
    completed: false,
  };
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

