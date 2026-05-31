export type Gender = 'male' | 'female';

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active';

export type Goal =
  | 'lose_weight'
  | 'maintain'
  | 'gain_muscle'
  | 'lean_bulk'
  | 'carb_cycling';

export type LossSpeed = 'slow' | 'medium' | 'fast';

export type DietType =
  | 'classic_deficit'
  | 'low_carb'
  | 'carb_cycling'
  | 'high_protein'
  | 'budget'
  | 'no_chicken'
  | 'no_fish'
  | 'no_dairy'
  | 'vegetarian'
  | 'work_friendly'
  | 'no_cooking';

export type MealType = 'breakfast' | 'snack1' | 'lunch' | 'snack2' | 'dinner' | 'snack3';

export type FoodCategory =
  | 'meat'
  | 'fish'
  | 'eggs'
  | 'dairy'
  | 'vegetables'
  | 'fruit'
  | 'grains'
  | 'legumes'
  | 'bread'
  | 'fats'
  | 'sweets'
  | 'fast_food'
  | 'spices'
  | 'other';

export type Allergen =
  | 'gluten'
  | 'dairy'
  | 'eggs'
  | 'nuts'
  | 'fish'
  | 'shellfish'
  | 'soy'
  | 'sesame';

export type CarbCycleType = 'simple' | 'moderate' | 'hard' | 'custom';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  gender: Gender;
  age: number;
  height: number;
  weight: number;
  targetWeight: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  lossSpeed: LossSpeed;
  dietType: DietType;
  mealsPerDay: number;
  allergies: Allergen[];
  dislikedFoods: string[];
  likedFoods: string[];
  healthNotes: string;
  createdAt: string;
}

export interface NutritionValues {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodItem {
  id: string;
  name: string;
  namePlural?: string;
  category: FoodCategory;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g?: number;
  suitableForLowCarb: boolean;
  suitableForHighCarb: boolean;
  allergens: Allergen[];
  unit?: string;
  gramsPerUnit?: number;
  cookingMultiplier?: number;
  vegetarian: boolean;
  vegan?: boolean;
  noChicken?: boolean;
  noFish?: boolean;
  noDairy?: boolean;
  isChicken?: boolean;
  isFish?: boolean;
  isDairy?: boolean;
}

export interface MealIngredient {
  foodId: string;
  foodName: string;
  amountRaw: number;
  amountCooked?: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  type: MealType;
  name: string;
  ingredients: MealIngredient[];
  instructions: string[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  prepTime?: number;
  completed?: boolean;
  swapped?: boolean;
}

export interface DailyMealPlan {
  date: string;
  dayNumber: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  waterMl: number;
  carbCyclePhase?: 'low' | 'medium' | 'high' | 'zero';
  completed?: boolean;
  waterConsumed?: number;
}

export interface MealPlan {
  id: string;
  userId: string;
  createdAt: string;
  dietType: DietType;
  days: DailyMealPlan[];
  durationDays: number;
  carbCycleConfig?: CarbCycleConfig;
}

export interface CarbCycleConfig {
  type: CarbCycleType;
  pattern: CarbCycleDay[];
}

export interface CarbCycleDay {
  day: number;
  label: string;
  carbGrams: number;
  phase: 'zero' | 'low' | 'medium' | 'high';
  description: string;
}

export interface WeightLog {
  id: string;
  date: string;
  weight: number;
  waist?: number;
  hips?: number;
  note?: string;
  mood?: 1 | 2 | 3 | 4 | 5;
  energy?: 1 | 2 | 3 | 4 | 5;
  hunger?: 1 | 2 | 3 | 4 | 5;
  sleepHours?: number;
}

export interface DailyMacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  bmr: number;
  tdee: number;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ShoppingItem {
  foodId: string;
  foodName: string;
  category: FoodCategory;
  totalAmount: number;
  unit: string;
  checked: boolean;
}

export interface AppState {
  profile: UserProfile | null;
  macroTargets: DailyMacroTargets | null;
  currentMealPlan: MealPlan | null;
  weightLogs: WeightLog[];
  aiMessages: AIMessage[];
  theme: 'light' | 'dark';
  onboardingComplete: boolean;
  shoppingList: ShoppingItem[];
  waterToday: number;
}
