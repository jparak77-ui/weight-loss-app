'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState,
  UserProfile,
  DailyMacroTargets,
  MealPlan,
  WeightLog,
  AIMessage,
  ShoppingItem,
  DailyMealPlan,
  Meal,
} from '@/types';
import { calculateDailyTargets } from '@/lib/calculations';

interface AppStore extends AppState {
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setMacroTargets: (targets: DailyMacroTargets) => void;
  setMealPlan: (plan: MealPlan) => void;
  toggleMealComplete: (date: string, mealId: string) => void;
  swapMeal: (date: string, mealId: string, newMeal: Meal) => void;
  addWeightLog: (log: WeightLog) => void;
  updateWeightLog: (id: string, updates: Partial<WeightLog>) => void;
  deleteWeightLog: (id: string) => void;
  addAIMessage: (message: AIMessage) => void;
  clearAIMessages: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setOnboardingComplete: (complete: boolean) => void;
  setShoppingList: (list: ShoppingItem[]) => void;
  toggleShoppingItem: (foodId: string) => void;
  setWaterToday: (ml: number) => void;
  addWater: (ml: number) => void;
  recalculateTargets: () => void;
  getToday: () => DailyMealPlan | undefined;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      profile: null,
      macroTargets: null,
      currentMealPlan: null,
      weightLogs: [],
      aiMessages: [],
      theme: 'light',
      onboardingComplete: false,
      shoppingList: [],
      waterToday: 0,

      setProfile: (profile) => {
        set({ profile });
        const targets = calculateDailyTargets(
          profile.weight,
          profile.height,
          profile.age,
          profile.gender,
          profile.activityLevel,
          profile.goal,
          profile.lossSpeed,
          profile.dietType
        );
        set({ macroTargets: targets });
      },

      updateProfile: (updates) => {
        const current = get().profile;
        if (!current) return;
        const updated = { ...current, ...updates };
        set({ profile: updated });
        const targets = calculateDailyTargets(
          updated.weight,
          updated.height,
          updated.age,
          updated.gender,
          updated.activityLevel,
          updated.goal,
          updated.lossSpeed,
          updated.dietType
        );
        set({ macroTargets: targets });
      },

      setMacroTargets: (targets) => set({ macroTargets: targets }),

      setMealPlan: (plan) => set({ currentMealPlan: plan }),

      toggleMealComplete: (date, mealId) => {
        const plan = get().currentMealPlan;
        if (!plan) return;
        const updatedDays = plan.days.map((day) => {
          if (day.date !== date) return day;
          return {
            ...day,
            meals: day.meals.map((meal) =>
              meal.id === mealId ? { ...meal, completed: !meal.completed } : meal
            ),
          };
        });
        set({ currentMealPlan: { ...plan, days: updatedDays } });
      },

      swapMeal: (date, mealId, newMeal) => {
        const plan = get().currentMealPlan;
        if (!plan) return;
        const updatedDays = plan.days.map((day) => {
          if (day.date !== date) return day;
          const updatedMeals = day.meals.map((meal) =>
            meal.id === mealId ? { ...newMeal, id: mealId, type: meal.type, swapped: true } : meal
          );
          const totals = updatedMeals.reduce(
            (acc, m) => ({
              calories: acc.calories + m.totalCalories,
              protein: acc.protein + m.totalProtein,
              carbs: acc.carbs + m.totalCarbs,
              fat: acc.fat + m.totalFat,
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
          );
          return {
            ...day,
            meals: updatedMeals,
            totalCalories: Math.round(totals.calories),
            totalProtein: Math.round(totals.protein * 10) / 10,
            totalCarbs: Math.round(totals.carbs * 10) / 10,
            totalFat: Math.round(totals.fat * 10) / 10,
          };
        });
        set({ currentMealPlan: { ...plan, days: updatedDays } });
      },

      addWeightLog: (log) =>
        set((state) => ({
          weightLogs: [...state.weightLogs, log].sort((a, b) =>
            a.date.localeCompare(b.date)
          ),
        })),

      updateWeightLog: (id, updates) =>
        set((state) => ({
          weightLogs: state.weightLogs.map((log) =>
            log.id === id ? { ...log, ...updates } : log
          ),
        })),

      deleteWeightLog: (id) =>
        set((state) => ({
          weightLogs: state.weightLogs.filter((log) => log.id !== id),
        })),

      addAIMessage: (message) =>
        set((state) => ({
          aiMessages: [...state.aiMessages, message],
        })),

      clearAIMessages: () => set({ aiMessages: [] }),

      setTheme: (theme) => set({ theme }),

      setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),

      setShoppingList: (list) => set({ shoppingList: list }),

      toggleShoppingItem: (foodId) =>
        set((state) => ({
          shoppingList: state.shoppingList.map((item) =>
            item.foodId === foodId ? { ...item, checked: !item.checked } : item
          ),
        })),

      setWaterToday: (ml) => set({ waterToday: ml }),

      addWater: (ml) =>
        set((state) => ({ waterToday: state.waterToday + ml })),

      recalculateTargets: () => {
        const profile = get().profile;
        if (!profile) return;
        const targets = calculateDailyTargets(
          profile.weight,
          profile.height,
          profile.age,
          profile.gender,
          profile.activityLevel,
          profile.goal,
          profile.lossSpeed,
          profile.dietType
        );
        set({ macroTargets: targets });
      },

      getToday: () => {
        const plan = get().currentMealPlan;
        if (!plan) return undefined;
        const today = new Date().toISOString().split('T')[0];
        return plan.days.find((d) => d.date === today);
      },
    }),
    {
      name: 'weight-loss-app-storage',
      partialize: (state) => ({
        profile: state.profile,
        macroTargets: state.macroTargets,
        currentMealPlan: state.currentMealPlan,
        weightLogs: state.weightLogs,
        aiMessages: state.aiMessages,
        theme: state.theme,
        onboardingComplete: state.onboardingComplete,
        shoppingList: state.shoppingList,
      }),
    }
  )
);
