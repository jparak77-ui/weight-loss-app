'use client';

import { useAppStore } from '@/store/appStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CATEGORY_LABELS } from '@/lib/foods';
import { CATEGORY_ICONS } from '@/lib/utils';
import { generateShoppingList } from '@/lib/meal-generator';
import { CheckCircle2, Circle, ShoppingBag } from 'lucide-react';
import type { FoodCategory } from '@/types';

const CATEGORY_ORDER: FoodCategory[] = [
  'meat', 'fish', 'eggs', 'dairy', 'vegetables', 'fruit', 'grains', 'legumes', 'bread', 'fats', 'other',
];

export function ShoppingListView() {
  const { currentMealPlan, shoppingList, setShoppingList, toggleShoppingItem } = useAppStore();

  const handleGenerate = () => {
    if (!currentMealPlan) return;
    const list = generateShoppingList(currentMealPlan);
    setShoppingList(list as any);
  };

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = shoppingList.filter((i) => i.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {} as Record<string, typeof shoppingList>);

  const checkedCount = shoppingList.filter((i) => i.checked).length;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nákupní seznam</h1>
        {shoppingList.length > 0 && (
          <span className="text-sm text-slate-500">{checkedCount}/{shoppingList.length}</span>
        )}
      </div>

      {currentMealPlan ? (
        <Button onClick={handleGenerate} variant="outline" fullWidth>
          <ShoppingBag size={16} />
          Vygenerovat ze jídelníčku ({currentMealPlan.durationDays} dní)
        </Button>
      ) : (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-300">
          Nejdříve vygeneruj jídelníček v sekci &quot;Jídelníček&quot;.
        </div>
      )}

      {shoppingList.length > 0 && (
        <div className="space-y-3">
          {Object.entries(grouped).map(([cat, items]) => (
            <Card key={cat}>
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <span>{CATEGORY_ICONS[cat] || '📦'}</span>
                  {CATEGORY_LABELS[cat] || cat}
                  <span className="text-xs text-slate-500 font-normal ml-auto">
                    {items.filter((i) => i.checked).length}/{items.length}
                  </span>
                </h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <button
                      key={item.foodId}
                      onClick={() => toggleShoppingItem(item.foodId)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                        item.checked
                          ? 'bg-green-50 dark:bg-green-900/10'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      {item.checked
                        ? <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                        : <Circle size={20} className="text-slate-300 dark:text-slate-600 shrink-0" />
                      }
                      <span className={`flex-1 text-sm text-left ${item.checked ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                        {item.foodName}
                      </span>
                      <span className={`text-sm font-medium shrink-0 ${item.checked ? 'text-slate-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        {item.totalAmount > 1000
                          ? `${(item.totalAmount / 1000).toFixed(1)} kg`
                          : `${item.totalAmount} ${item.unit}`}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShoppingList(shoppingList.map((i) => ({ ...i, checked: false })))}
            >
              Odznačit vše
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShoppingList(shoppingList.map((i) => ({ ...i, checked: true })))}
            >
              Zaznačit vše
            </Button>
          </div>
        </div>
      )}

      {shoppingList.length === 0 && currentMealPlan && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-3">🛒</div>
            <p className="text-slate-600 dark:text-slate-400">Klikni na &quot;Vygenerovat&quot; pro vytvoření nákupního seznamu z aktuálního jídelníčku.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
