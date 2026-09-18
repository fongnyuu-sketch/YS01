import React from 'react';
import { MealItem, DayPlan } from '../types';
import {
  Sunrise,
  Sun,
  Moon,
  Coffee,
  Clock,
  ChefHat,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Bookmark,
  Check,
  Plus,
} from 'lucide-react';

interface DailyMealGridProps {
  dayPlan: DayPlan;
  onSelectMeal: (meal: MealItem) => void;
  onSwapMeal: (meal: MealItem) => void;
  favorites: string[];
  onToggleFavorite: (mealId: string) => void;
  onAddAllToGrocery: (meal: MealItem) => void;
}

export const DailyMealGrid: React.FC<DailyMealGridProps> = ({
  dayPlan,
  onSelectMeal,
  onSwapMeal,
  favorites,
  onToggleFavorite,
  onAddAllToGrocery,
}) => {
  const mealSlots: {
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    title: string;
    icon: React.ReactNode;
    color: string;
    bgBadge: string;
    item?: MealItem;
  }[] = [
    {
      type: 'breakfast',
      title: '아침 식단',
      icon: <Sunrise className="w-4 h-4 text-amber-500" />,
      color: 'amber',
      bgBadge: 'bg-amber-50 text-amber-700 border-amber-200',
      item: dayPlan.meals.breakfast,
    },
    {
      type: 'lunch',
      title: '점심 식단',
      icon: <Sun className="w-4 h-4 text-emerald-600" />,
      color: 'emerald',
      bgBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      item: dayPlan.meals.lunch,
    },
    {
      type: 'dinner',
      title: '저녁 식단',
      icon: <Moon className="w-4 h-4 text-indigo-500" />,
      color: 'indigo',
      bgBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      item: dayPlan.meals.dinner,
    },
    {
      type: 'snack',
      title: '건강 간식',
      icon: <Coffee className="w-4 h-4 text-purple-500" />,
      color: 'purple',
      bgBadge: 'bg-purple-50 text-purple-700 border-purple-200',
      item: dayPlan.meals.snack,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mealSlots.map((slot) => {
        const meal = slot.item;
        if (!meal) return null;

        const isFav = favorites.includes(meal.id);

        return (
          <div
            key={slot.type}
            id={`meal-card-${meal.id}`}
            className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
          >
            {/* Card Header */}
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${slot.bgBadge}`}
                  >
                    {slot.icon}
                    {slot.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                    {meal.categoryTag}
                  </span>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(meal.id)}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      isFav
                        ? 'text-amber-500 bg-amber-50'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }`}
                    title={isFav ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                  >
                    <Bookmark className={`w-4 h-4 ${isFav ? 'fill-amber-500' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSwapMeal(meal)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                    title="다른 대체 메뉴로 변경"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h4
                  onClick={() => onSelectMeal(meal)}
                  className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer leading-snug"
                >
                  {meal.name}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-1">
                  {meal.subTitle}
                </p>
              </div>

              {/* Prep & Cook Time Info */}
              <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  준비 {meal.prepTimeMinutes}분 · 조리 {meal.cookTimeMinutes}분
                </span>
                <span className="flex items-center gap-1">
                  <ChefHat className="w-3.5 h-3.5 text-slate-400" />
                  난이도 {meal.difficulty}
                </span>
              </div>

              {/* Nutrition Badges */}
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 grid grid-cols-4 gap-1 text-center">
                <div>
                  <div className="text-[10px] text-slate-400">열량</div>
                  <div className="text-xs font-bold text-slate-800">
                    {meal.nutrition.calories} <span className="font-normal text-[10px]">kcal</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">단백질</div>
                  <div className="text-xs font-bold text-blue-700">
                    {meal.nutrition.protein} <span className="font-normal text-[10px]">g</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">탄수화물</div>
                  <div className="text-xs font-bold text-amber-700">
                    {meal.nutrition.carbs} <span className="font-normal text-[10px]">g</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">지방</div>
                  <div className="text-xs font-bold text-rose-700">
                    {meal.nutrition.fat} <span className="font-normal text-[10px]">g</span>
                  </div>
                </div>
              </div>

              {/* Health Benefit Snippet */}
              <div className="text-xs text-slate-600 bg-emerald-50/50 rounded-md p-2 border border-emerald-100 flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-tight">{meal.healthBenefit}</span>
              </div>

              {/* Ingredients tag preview */}
              <div className="flex flex-wrap gap-1 pt-1">
                {meal.ingredients.slice(0, 4).map((ing, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md"
                  >
                    {ing.name} {ing.amount}
                    {ing.unit}
                  </span>
                ))}
                {meal.ingredients.length > 4 && (
                  <span className="text-[11px] px-1.5 py-0.5 text-slate-400">
                    +{meal.ingredients.length - 4}개 더
                  </span>
                )}
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onAddAllToGrocery(meal)}
                className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-emerald-700 font-medium py-1 px-2 rounded-md hover:bg-white transition-all cursor-pointer"
                title="이 식단의 모든 재료를 장보기 목록에 추가"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                장보기에 담기
              </button>

              <button
                type="button"
                onClick={() => onSelectMeal(meal)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-100/70 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                <span>상세 레시피 보기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
