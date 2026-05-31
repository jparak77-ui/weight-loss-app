import type { FoodItem } from '@/types';

export const FOODS: FoodItem[] = [
  // MEAT
  { id: 'chicken_breast', name: 'Kuřecí prsa', category: 'meat', caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6, suitableForLowCarb: true, suitableForHighCarb: true, allergens: [], unit: 'g', cookingMultiplier: 0.75, vegetarian: false, isChicken: true },
  { id: 'chicken_thigh', name: 'Kuřecí stehno', category: 'meat', caloriesPer100g: 209, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 11, suitableForLowCarb: true, suitableForHighCarb: true, allergens: [], unit: 'g', cookingMultiplier: 0.75, vegetarian: false, isChicken: true },
  { id: 'beef', name: 'Hovězí maso', category: 'meat', caloriesPer100g: 250, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 15, suitableForLowCarb: true, suitableForHighCarb: true, allergens: [], unit: 'g', cookingMultiplier: 0.7, vegetarian: false, noChicken: true },
  { id: 'pork_loin', name: 'Vepřová panenka', category: 'meat', caloriesPer100g: 143, proteinPer100g: 22, carbsPer100g: 0, fatPer100g: 5.5, suitableForLowCarb: true, suitableForHighCarb: true, allergens: [], unit: 'g', cookingMultiplier: 0.75, vegetarian: false, noChicken: true },
  { id: 'pork_neck', name: 'Vepřová krkovička', category: 'meat', caloriesPer100g: 280, proteinPer100g: 19, carbsPer100g: 0, fatPer100g: 22, suitableForLowCarb: true, suitableForHighCarb: false, allergens: [], unit: 'g', cookingMultiplier: 0.75, vegetarian: false, noChicken: true },
  { id: 'turkey', name: 'Krůtí maso', category: 'meat', caloriesPer100g: 157, proteinPer100g: 29, carbsPer100g: 0, fatPer100g: 4, suitableForLowCarb: true, suitableForHighCarb: true, allergens: [], unit: 'g', cookingMultiplier: 0.75, vegetarian: false },
  { id: 'ham', name: 'Šunka (90%)', category: 'meat', caloriesPer100g: 107, proteinPer100g: 17, carbsPer100g: 2, fatPer100g: 3.5, suitableForLowCarb: true, suitableForHighCarb: true, allergens: [], unit: 'g', vegetarian: false },
  { id: 'ground_beef', name: 'Mleté hovězí', category: 'meat', caloriesPer100g: 235, proteinPer100g: 23, carbsPer100g: 0, fatPer100g: 15, suitableForLowCarb: true, suitableForHighCarb: true, allergens: [], unit: 'g', cookingMultiplier: 0.75, vegetarian: false, noChicken: true },
  { id: 'ground_pork', name: 'Mleté vepřové', category: 'meat', caloriesPer100g: 263, proteinPer100g: 21, carbsPer100g: 0, fatPer100g: 19, suitableForLowCarb: true, suitableForHighCarb: false, allergens: [], unit: 'g', cookingMultiplier: 0.75, vegetarian: false, noChicken: true },

  // FISH
  { id: 'salmon', name: 'Losos', category: 'fish', caloriesPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13, suitableForLowCarb: true, suitableForHighCarb: true, allergens: ['fish'], unit: 'g', cookingMultiplier: 0.8, vegetarian: false, isFish: true },
  { id: 'tuna_canned', name: 'Tuňák ve vlastní šťávě', category: 'fish', caloriesPer100g: 116, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 1, suitableForLowCarb: true, suitableForHighCarb: true, allergens: ['fish'], unit: 'g', vegetarian: false, isFish: true },
  { id: 'cod', name: 'Treska', category: 'fish', caloriesPer100g: 82, proteinPer100g: 18, carbsPer100g: 0, fatPer100g: 0.7, suitableForLowCarb: true, suitableForHighCarb: true, allergens: ['fish'], unit: 'g', cookingMultiplier: 0.8, vegetarian: false, isFish: true },
  { id: 'mackerel', name: 'Makrela', category: 'fish', caloriesPer100g: 205, proteinPer100g: 19, carbsPer100g: 0, fatPer100g: 14, suitableForLowCarb: true, suitableForHighCarb: false, allergens: ['fish'], unit: 'g', vegetarian: false, isFish: true },

  // EGGS
  { id: 'egg', name: 'Vejce', namePlural: 'Vejce', category: 'eggs', caloriesPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatPer100g: 11, suitableForLowCarb: true, suitableForHighCarb: true, allergens: ['eggs'], unit: 'ks', gramsPerUnit: 60, vegetarian: true },
  { id: 'egg_white', name: 'Bílek', category: 'eggs', caloriesPer100g: 52, proteinPer100g: 11, carbsPer100g: 0.7, fatPer100g: 0.2, suitableForLowCarb: true, suitableForHighCarb: true, allergens: ['eggs'], unit: 'g', vegetarian: true },

  // DAIRY
  { id: 'cottage_cheese', name: 'Tvaroh nízkotučný', category: 'dairy', caloriesPer100g: 73, proteinPer100g: 12, carbsPer100g: 4, fatPer100g: 0.5, suitableForLowCarb: true, suitableForHighCarb: true, allergens: ['dairy'], unit: 'g', vegetarian: true, isDairy: true },
  { id: 'greek_yogurt', name: 'Řecký jogurt 0%', category: 'dairy', caloriesPer100g: 59, proteinPer100g: 10, carbsPer100g: 4, fatPer100g: 0.4, suitableForLowCarb: true, suitableForHighCarb: true, allergens: ['dairy'], unit: 'g', vegetarian: true, isDairy: true },
  { id: 'skyr', name: 'Skyr', category: 'dairy', caloriesPer100g: 62, proteinPer100g: 11, carbsPer100g: 4, fatPer100g: 0.2, suitableForLowCarb: true, suitableForHighCarb: true, allergens: ['dairy'], unit: 'g', vegetarian: true, isDairy: true },
  { id: 'milk', name: 'Mléko (1,5%)', category: 'dairy', caloriesPer100g: 47, proteinPer100g: 3.4, carbsPer100g: 4.8, fatPer100g: 1.5, suitableForLowCarb: false, suitableForHighCarb: true, allergens: ['dairy'], unit: 'ml', vegetarian: true, isDairy: true },
  { id: 'cheese_edam', name: 'Eidam 30%', category: 'dairy', caloriesPer100g: 257, proteinPer100g: 30, carbsPer100g: 0, fatPer100g: 15, suitableForLowCarb: true, suitableForHighCarb: false, allergens: ['dairy'], unit: 'g', vegetarian: true, isDairy: true },
  { id: 'mozzarella', name: 'Mozzarella light', category: 'dairy', caloriesPer100g: 175, proteinPer100g: 18, carbsPer100g: 3, fatPer100g: 10, suitableForLowCarb: true, suitableForHighCarb: false, allergens: ['dairy'], unit: 'g', vegetarian: true, isDairy: true },
  { id: 'quark', name: 'Tvarůžky', category: 'dairy', caloriesPer100g: 99, proteinPer100g: 21, carbsPer100g: 0.5, fatPer100g: 0.5, suitableForLowCarb: true, suitableForHighCarb: true, allergens: ['dairy'], unit: 'g', vegetarian: true, isDairy: true },
  { id: 'protein_yogurt', name: 'Proteinový jogurt', category: 'dairy', caloriesPer100g: 65, proteinPer100g: 12, carbsPer100g: 4, fatPer100g: 0.3, suitableForLowCarb: true, suitableForHighCarb: true, allergens: ['dairy'], unit: 'g', vegetarian: true, isDairy: true },

  // VEGETABLES
  { id: 'broccoli', name: 'Brokolice', category: 'vegetables', caloriesPer100g: 34, proteinPer100g: 2.8, carbsPer100g: 7, fatPer100g: 0.4, suitableForLowCarb: true, suitableForHighCarb: true, allergens: [], unit: 'g', vegetarian: true, vegan: true },
  { id: 'spinach', name: 'Špenát', category: 'vegetables', caloriesPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4, suitableForLowCarb: true, suitableForHighCarb: true, allergens: [], unit: 'g', vegetarian: true, vegan: true },
  { id: 'cucumber', name: 'Okurka', category: 'vegetables', caloriesPer100g: 15, proteinPer100g: 0.7, carbsPer100g: 3.6, fatPer100g: 0.1, suitableForLowCarb: true, suitableForHighCarb: true, allergens: [], unit: 'g', vegetarian: true, vegan: true },
  { id: 'tomato', name: 'Rajče', category: 'vegetables', caloriesPer100g: 18, proteinPer100g: 0.9, carbsPer100g: 3.9, fatPer100g: 0.2, suitableForLowCarb: true, suitableForHighCarb: true, allergens: [], unit: 'g', vegetarian: true, vegan: true },
  { id: 'bell_pepper', name: 'Paprika', category: 'vegetables', caloriesPer100g: 20, proteinPer100g: 1, carbsPer100g: 4.6, fatPer100g: 0.2, suitableForLowCarb: true, suitableForHighCarb: true, allergens: [], unit: 'g', vegetarian: true, vegan: true },
  { id: 'zucchini', name: 'Cuketa', category: 'vegetables', caloriesPer100g: 17, proteinPer100g: 1.2, carbsPer100g: 3.1, fatPer100g: 0.3, suitableForLowCarb: true, suitableForHighCarb: true, allergens: [], unit: 'g', vegetarian: true, vegan: true },
  { id: 'carrot', name: 'Mrkev', category: 'vegetables', caloriesPer100g: 41, proteinPer100g: 0.9, carbsPer100g: 10, fatPer100g: 0.2, suitableForLowCarb: false, suitableForHighCarb: true, allergens: [], unit: 'g', vegetarian: true, vegan: true },
  { id: 'onion', name: 'Cibule', category: 'vegetables', caloriesPer100g: 40, proteinPer100g: 1.1, carbsPer100g: 9.3, fatPer100g: 0.1, suitableForLowCarb: false, suitableForHighCarb: true, allergens: [], unit: 'g', vegetarian: true, vegan: true },
  { id: 'lettuce', name: 'Salát (hlávkový)', category: 'vegetables', caloriesPer100g: 15, proteinPer100g: 1.4, carbsPer100g: 2.9, fatPer100g: 0.2, suitableForLowCarb: true, suitableForHighCarb: true, allergens: [], unit: 'g', vegetarian: true, vegan: true },
  { id: 'cabbage', name: 'Zelí (bílé)', category: 'vegetables', caloriesPer100g: 25, proteinPer100g: 1.3, carbsPer100g: 5.8, fatPer100g: 0.1, suitableForLowCarb: true, suitableForHighCarb: true, allergens: [], unit: 'g', vegetarian: true, vegan: true },
  { id: 'cauliflower', name: 'Květák', category: 'vegetables', caloriesPer100g: 25, proteinPer100g: 1.9, carbsPer100g: 5, fatPer100g: 0.3, suitableForLowCarb: true, suitableForHighCarb: true, allergens: [], unit: 'g', vegetarian: true, vegan: true },
  { id: 'mushrooms', name: 'Žampiony', category: 'vegetables', caloriesPer100g: 22, proteinPer100g: 3.1, carbsPer100g: 3.3, fatPer100g: 0.3, suitableForLowCarb: true, suitableForHighCarb: true, allergens: [], unit: 'g', vegetarian: true, vegan: true },

  // FRUIT
  { id: 'apple', name: 'Jablko', category: 'fruit', caloriesPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 14, fatPer100g: 0.2, suitableForLowCarb: false, suitableForHighCarb: true, allergens: [], unit: 'g', vegetarian: true, vegan: true },
  { id: 'banana', name: 'Banán', category: 'fruit', caloriesPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 23, fatPer100g: 0.3, suitableForLowCarb: false, suitableForHighCarb: true, allergens: [], unit: 'g', vegetarian: true, vegan: true },
  { id: 'berries', name: 'Borůvky', category: 'fruit', caloriesPer100g: 57, proteinPer100g: 0.7, carbsPer100g: 14, fatPer100g: 0.3, suitableForLowCarb: false, suitableForHighCarb: true, allergens: [], unit: 'g', vegetarian: true, vegan: true },
  { id: 'strawberry', name: 'Jahody', category: 'fruit', caloriesPer100g: 32, proteinPer100g: 0.7, carbsPer100g: 7.7, fatPer100g: 0.3, suitableForLowCarb: true, suitableForHighCarb: true, allergens: [], unit: 'g', vegetarian: true, vegan: true },
  { id: 'orange', name: 'Pomeranč', category: 'fruit', caloriesPer100g: 47, proteinPer100g: 0.9, carbsPer100g: 12, fatPer100g: 0.1, suitableForLowCarb: false, suitableForHighCarb: true, allergens: [], unit: 'g', vegetarian: true, vegan: true },

  // GRAINS
  { id: 'rice', name: 'Rýže bílá', category: 'grains', caloriesPer100g: 365, proteinPer100g: 6.7, carbsPer100g: 80, fatPer100g: 0.7, suitableForLowCarb: false, suitableForHighCarb: true, allergens: [], unit: 'g', cookingMultiplier: 2.8, vegetarian: true, vegan: true },
  { id: 'brown_rice', name: 'Hnědá rýže', category: 'grains', caloriesPer100g: 353, proteinPer100g: 7.9, carbsPer100g: 74, fatPer100g: 2.7, fiberPer100g: 3.5, suitableForLowCarb: false, suitableForHighCarb: true, allergens: ['gluten'], unit: 'g', cookingMultiplier: 2.5, vegetarian: true, vegan: true },
  { id: 'pasta', name: 'Těstoviny (celozrnné)', category: 'grains', caloriesPer100g: 348, proteinPer100g: 13, carbsPer100g: 70, fatPer100g: 2.5, suitableForLowCarb: false, suitableForHighCarb: true, allergens: ['gluten'], unit: 'g', cookingMultiplier: 2.2, vegetarian: true, vegan: true },
  { id: 'oats', name: 'Ovesné vločky', category: 'grains', caloriesPer100g: 389, proteinPer100g: 17, carbsPer100g: 66, fatPer100g: 7, fiberPer100g: 10, suitableForLowCarb: false, suitableForHighCarb: true, allergens: ['gluten'], unit: 'g', vegetarian: true, vegan: true },
  { id: 'potato', name: 'Brambory', category: 'grains', caloriesPer100g: 77, proteinPer100g: 2, carbsPer100g: 17, fatPer100g: 0.1, suitableForLowCarb: false, suitableForHighCarb: true, allergens: [], unit: 'g', cookingMultiplier: 0.85, vegetarian: true, vegan: true },
  { id: 'sweet_potato', name: 'Sladké brambory', category: 'grains', caloriesPer100g: 86, proteinPer100g: 1.6, carbsPer100g: 20, fatPer100g: 0.1, suitableForLowCarb: false, suitableForHighCarb: true, allergens: [], unit: 'g', vegetarian: true, vegan: true },
  { id: 'buckwheat', name: 'Pohanka', category: 'grains', caloriesPer100g: 343, proteinPer100g: 13, carbsPer100g: 72, fatPer100g: 3.4, suitableForLowCarb: false, suitableForHighCarb: true, allergens: [], unit: 'g', cookingMultiplier: 2.5, vegetarian: true, vegan: true },
  { id: 'quinoa', name: 'Quinoa', category: 'grains', caloriesPer100g: 368, proteinPer100g: 14, carbsPer100g: 64, fatPer100g: 6.1, suitableForLowCarb: false, suitableForHighCarb: true, allergens: [], unit: 'g', cookingMultiplier: 2.7, vegetarian: true, vegan: true },

  // LEGUMES
  { id: 'lentils', name: 'Čočka', category: 'legumes', caloriesPer100g: 353, proteinPer100g: 26, carbsPer100g: 60, fatPer100g: 1.1, suitableForLowCarb: false, suitableForHighCarb: true, allergens: [], unit: 'g', cookingMultiplier: 2.5, vegetarian: true, vegan: true },
  { id: 'chickpeas', name: 'Cizrna', category: 'legumes', caloriesPer100g: 364, proteinPer100g: 19, carbsPer100g: 61, fatPer100g: 6, suitableForLowCarb: false, suitableForHighCarb: true, allergens: [], unit: 'g', vegetarian: true, vegan: true },
  { id: 'black_beans', name: 'Černé fazole', category: 'legumes', caloriesPer100g: 341, proteinPer100g: 22, carbsPer100g: 62, fatPer100g: 1.4, suitableForLowCarb: false, suitableForHighCarb: true, allergens: [], unit: 'g', vegetarian: true, vegan: true },
  { id: 'tofu', name: 'Tofu', category: 'legumes', caloriesPer100g: 76, proteinPer100g: 8.1, carbsPer100g: 1.9, fatPer100g: 4.2, suitableForLowCarb: true, suitableForHighCarb: true, allergens: ['soy'], unit: 'g', vegetarian: true, vegan: true },

  // BREAD
  { id: 'bread_whole', name: 'Celozrnný chléb', category: 'bread', caloriesPer100g: 247, proteinPer100g: 9, carbsPer100g: 46, fatPer100g: 3.4, suitableForLowCarb: false, suitableForHighCarb: true, allergens: ['gluten'], unit: 'g', vegetarian: true, vegan: true },
  { id: 'rye_bread', name: 'Žitný chléb', category: 'bread', caloriesPer100g: 259, proteinPer100g: 8.4, carbsPer100g: 48, fatPer100g: 3.3, suitableForLowCarb: false, suitableForHighCarb: true, allergens: ['gluten'], unit: 'g', vegetarian: true, vegan: true },
  { id: 'crispbread', name: 'Knäckebrot', category: 'bread', caloriesPer100g: 335, proteinPer100g: 9.5, carbsPer100g: 70, fatPer100g: 1.5, suitableForLowCarb: false, suitableForHighCarb: true, allergens: ['gluten'], unit: 'ks', gramsPerUnit: 10, vegetarian: true, vegan: true },

  // FATS
  { id: 'olive_oil', name: 'Olivový olej', category: 'fats', caloriesPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100, suitableForLowCarb: true, suitableForHighCarb: false, allergens: [], unit: 'ml', vegetarian: true, vegan: true },
  { id: 'avocado', name: 'Avokádo', category: 'fats', caloriesPer100g: 160, proteinPer100g: 2, carbsPer100g: 9, fatPer100g: 15, suitableForLowCarb: true, suitableForHighCarb: false, allergens: [], unit: 'g', vegetarian: true, vegan: true },
  { id: 'nuts_mixed', name: 'Směs ořechů', category: 'fats', caloriesPer100g: 607, proteinPer100g: 20, carbsPer100g: 21, fatPer100g: 54, suitableForLowCarb: true, suitableForHighCarb: false, allergens: ['nuts'], unit: 'g', vegetarian: true, vegan: true },
  { id: 'almonds', name: 'Mandle', category: 'fats', caloriesPer100g: 579, proteinPer100g: 21, carbsPer100g: 22, fatPer100g: 50, suitableForLowCarb: true, suitableForHighCarb: false, allergens: ['nuts'], unit: 'g', vegetarian: true, vegan: true },
  { id: 'butter', name: 'Máslo', category: 'fats', caloriesPer100g: 717, proteinPer100g: 0.9, carbsPer100g: 0.1, fatPer100g: 81, suitableForLowCarb: true, suitableForHighCarb: false, allergens: ['dairy'], unit: 'g', vegetarian: true, isDairy: true },
  { id: 'peanut_butter', name: 'Arašídové máslo', category: 'fats', caloriesPer100g: 588, proteinPer100g: 25, carbsPer100g: 20, fatPer100g: 50, suitableForLowCarb: true, suitableForHighCarb: false, allergens: ['nuts'], unit: 'g', vegetarian: true, vegan: true },

  // PROTEIN SUPPLEMENTS
  { id: 'whey_protein', name: 'Protein (syrovátkový)', category: 'dairy', caloriesPer100g: 380, proteinPer100g: 80, carbsPer100g: 6, fatPer100g: 5, suitableForLowCarb: true, suitableForHighCarb: true, allergens: ['dairy'], unit: 'g', vegetarian: true, isDairy: true },
];

export const FOOD_MAP: Record<string, FoodItem> = FOODS.reduce((acc, food) => {
  acc[food.id] = food;
  return acc;
}, {} as Record<string, FoodItem>);

export const CATEGORY_LABELS: Record<string, string> = {
  meat: 'Maso',
  fish: 'Ryby',
  eggs: 'Vejce',
  dairy: 'Mléčné výrobky',
  vegetables: 'Zelenina',
  fruit: 'Ovoce',
  grains: 'Přílohy a obiloviny',
  legumes: 'Luštěniny',
  bread: 'Pečivo',
  fats: 'Zdravé tuky',
  sweets: 'Sladkosti',
  spices: 'Koření',
  other: 'Ostatní',
};

export function filterFoodsForDiet(
  foods: FoodItem[],
  dietType: string,
  allergies: string[],
  dislikedFoods: string[]
): FoodItem[] {
  return foods.filter((food) => {
    if (allergies.some((a) => food.allergens.includes(a as any))) return false;
    if (dislikedFoods.includes(food.id)) return false;
    if (dietType === 'vegetarian' && !food.vegetarian) return false;
    if (dietType === 'no_chicken' && food.isChicken) return false;
    if (dietType === 'no_fish' && food.isFish) return false;
    if (dietType === 'no_dairy' && food.isDairy) return false;
    return true;
  });
}
