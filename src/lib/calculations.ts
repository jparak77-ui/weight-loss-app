import type { Gender, ActivityLevel, Goal, LossSpeed, DailyMacroTargets, DietType } from '@/types';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calculateBMR(weight: number, height: number, age: number, gender: Gender): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

export function getCalorieDeficit(lossSpeed: LossSpeed): number {
  const deficits: Record<LossSpeed, number> = {
    slow: 250,
    medium: 500,
    fast: 750,
  };
  return deficits[lossSpeed];
}

export function calculateTargetCalories(tdee: number, goal: Goal, lossSpeed: LossSpeed): number {
  switch (goal) {
    case 'lose_weight':
    case 'carb_cycling':
      return Math.max(1200, tdee - getCalorieDeficit(lossSpeed));
    case 'lean_bulk':
      return tdee - 200;
    case 'maintain':
      return tdee;
    case 'gain_muscle':
      return tdee + 300;
    default:
      return tdee - 500;
  }
}

export function calculateMacros(
  calories: number,
  weight: number,
  dietType: DietType
): { protein: number; carbs: number; fat: number } {
  const minProtein = Math.round(weight * 2.0);

  switch (dietType) {
    case 'low_carb': {
      const protein = Math.max(minProtein, Math.round((calories * 0.40) / 4));
      const fat = Math.round((calories * 0.45) / 9);
      const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
      return { protein, carbs: Math.max(20, carbs), fat };
    }
    case 'high_protein': {
      const protein = Math.max(minProtein, Math.round((calories * 0.45) / 4));
      const fat = Math.round((calories * 0.25) / 9);
      const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
      return { protein, carbs: Math.max(50, carbs), fat };
    }
    case 'vegetarian': {
      const protein = Math.max(Math.round(weight * 1.6), Math.round((calories * 0.30) / 4));
      const carbs = Math.round((calories * 0.45) / 4);
      const fat = Math.round((calories - protein * 4 - carbs * 4) / 9);
      return { protein, carbs, fat };
    }
    default: {
      const protein = Math.max(minProtein, Math.round((calories * 0.35) / 4));
      const fat = Math.round((calories * 0.30) / 9);
      const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
      return { protein, carbs: Math.max(50, carbs), fat };
    }
  }
}

export function calculateWater(weight: number, activityLevel: ActivityLevel): number {
  const base = weight * 35;
  const activityBonus: Record<ActivityLevel, number> = {
    sedentary: 0,
    light: 200,
    moderate: 400,
    active: 600,
    very_active: 800,
  };
  return Math.round(base + activityBonus[activityLevel]);
}

export function calculateDailyTargets(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
  activityLevel: ActivityLevel,
  goal: Goal,
  lossSpeed: LossSpeed,
  dietType: DietType
): DailyMacroTargets {
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const calories = calculateTargetCalories(tdee, goal, lossSpeed);
  const macros = calculateMacros(calories, weight, dietType);
  const water = calculateWater(weight, activityLevel);

  return {
    calories,
    protein: macros.protein,
    carbs: macros.carbs,
    fat: macros.fat,
    water,
    bmr: Math.round(bmr),
    tdee,
  };
}

export function estimateWeeksToGoal(
  currentWeight: number,
  targetWeight: number,
  lossSpeed: LossSpeed
): number {
  const diff = Math.abs(currentWeight - targetWeight);
  const weeklyLoss: Record<LossSpeed, number> = {
    slow: 0.25,
    medium: 0.5,
    fast: 0.75,
  };
  return Math.ceil(diff / weeklyLoss[lossSpeed]);
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Podváha';
  if (bmi < 25) return 'Normální váha';
  if (bmi < 30) return 'Nadváha';
  return 'Obezita';
}

export function calculateBMI(weight: number, height: number): number {
  const heightM = height / 100;
  return Math.round((weight / (heightM * heightM)) * 10) / 10;
}
