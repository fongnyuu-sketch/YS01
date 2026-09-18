import React, { useState, useEffect } from 'react';
import { MealItem, Ingredient } from '../types';
import { playTimerChime } from '../utils/audioAlert';
import {
  X,
  Clock,
  ChefHat,
  Users,
  Flame,
  Check,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Printer,
  ShoppingCart,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';

interface RecipeModalProps {
  meal: MealItem | null;
  onClose: () => void;
  onAddToGrocery: (ingredients: Ingredient[]) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  meal,
  onClose,
  onAddToGrocery,
}) => {
  if (!meal) return null;

  const [servingsMultiplier, setServingsMultiplier] = useState<number>(1);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [activeTimers, setActiveTimers] = useState<
    Record<number, { remaining: number; isRunning: boolean; original: number }>
  >({});
  const [addedNotice, setAddedNotice] = useState(false);

  // Initialize timer state if steps have timerSeconds
  useEffect(() => {
    const initialTimers: Record<
      number,
      { remaining: number; isRunning: boolean; original: number }
    > = {};
    meal.steps.forEach((step) => {
      if (step.timerSeconds) {
        initialTimers[step.stepNumber] = {
          remaining: step.timerSeconds,
          isRunning: false,
          original: step.timerSeconds,
        };
      }
    });
    setActiveTimers(initialTimers);
    setCheckedIngredients({});
    setServingsMultiplier(meal.servings || 1);
  }, [meal]);

  // Interval loop for running timers
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimers((prev) => {
        let changed = false;
        const next = { ...prev };

        Object.keys(next).forEach((key) => {
          const stepNum = Number(key);
          const timer = next[stepNum];
          if (timer && timer.isRunning && timer.remaining > 0) {
            changed = true;
            const newRemaining = timer.remaining - 1;
            if (newRemaining === 0) {
              playTimerChime();
              next[stepNum] = { ...timer, remaining: 0, isRunning: false };
            } else {
              next[stepNum] = { ...timer, remaining: newRemaining };
            }
          }
        });

        return changed ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleTimer = (stepNumber: number) => {
    setActiveTimers((prev) => {
      const current = prev[stepNumber];
      if (!current) return prev;
      return {
        ...prev,
        [stepNumber]: {
          ...current,
          isRunning: !current.isRunning,
        },
      };
    });
  };

  const resetTimer = (stepNumber: number) => {
    setActiveTimers((prev) => {
      const current = prev[stepNumber];
      if (!current) return prev;
      return {
        ...prev,
        [stepNumber]: {
          ...current,
          remaining: current.original,
          isRunning: false,
        },
      };
    });
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleIngredientCheck = (name: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleAddIngredientsToGrocery = () => {
    const scaledIngredients: Ingredient[] = meal.ingredients.map((ing) => ({
      ...ing,
      amount: Math.round(ing.amount * (servingsMultiplier / (meal.servings || 1)) * 10) / 10,
    }));
    onAddToGrocery(scaledIngredients);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  // Scaled nutrition calculation
  const scaleFactor = servingsMultiplier / (meal.servings || 1);
  const scaledCalories = Math.round(meal.nutrition.calories * scaleFactor);
  const scaledProtein = Math.round(meal.nutrition.protein * scaleFactor);
  const scaledCarbs = Math.round(meal.nutrition.carbs * scaleFactor);
  const scaledFat = Math.round(meal.nutrition.fat * scaleFactor);
  const scaledSodium = Math.round(meal.nutrition.sodium * scaleFactor);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden my-6 border border-slate-200">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800">
              {meal.mealType}
            </span>
            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
              {meal.categoryTag}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => window.print()}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
              title="레시피 인쇄"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Title & Overview */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {meal.name}
            </h3>
            <p className="text-sm text-slate-500 mt-1">{meal.subTitle}</p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-4 h-4 text-emerald-600" />
                준비 {meal.prepTimeMinutes}분 / 조리 {meal.cookTimeMinutes}분
              </span>
              <span className="flex items-center gap-1 font-medium">
                <ChefHat className="w-4 h-4 text-emerald-600" />
                난이도: {meal.difficulty}
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Flame className="w-4 h-4 text-amber-500" />
                {scaledCalories} kcal ({servingsMultiplier}인분 기준)
              </span>
            </div>
          </div>

          {/* Health Benefit Rationale Box */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm text-emerald-900 flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-emerald-950 mb-0.5">영양사의 건강 설계 포인트</div>
              <p className="leading-relaxed text-emerald-800">{meal.healthBenefit}</p>
            </div>
          </div>

          {/* Servings Multiplier & Nutrition Quick View */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Users className="w-4 h-4 text-slate-500" />
                <span>분량 설정:</span>
              </div>
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                {[1, 2, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setServingsMultiplier(num)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      servingsMultiplier === num
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {num}인분
                  </button>
                ))}
              </div>
            </div>

            {/* Scaled Macro pills */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="px-2 py-1 rounded bg-white border border-slate-200 font-medium">
                단백질 <b className="text-blue-700">{scaledProtein}g</b>
              </span>
              <span className="px-2 py-1 rounded bg-white border border-slate-200 font-medium">
                탄수화물 <b className="text-amber-700">{scaledCarbs}g</b>
              </span>
              <span className="px-2 py-1 rounded bg-white border border-slate-200 font-medium">
                지방 <b className="text-rose-700">{scaledFat}g</b>
              </span>
              <span className="px-2 py-1 rounded bg-white border border-slate-200 font-medium">
                나트륨 <b className="text-slate-700">{scaledSodium}mg</b>
              </span>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>식재료 목록</span>
                <span className="text-xs font-normal text-slate-500">
                  (총 {meal.ingredients.length}가지 재료)
                </span>
              </h4>

              <button
                type="button"
                onClick={handleAddIngredientsToGrocery}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>추가 완료!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>장보기에 재료 담기</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {meal.ingredients.map((ing, idx) => {
                const isChecked = checkedIngredients[ing.name];
                const scaledAmount =
                  Math.round(ing.amount * scaleFactor * 10) / 10;

                return (
                  <div
                    key={idx}
                    onClick={() => toggleIngredientCheck(ing.name)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs sm:text-sm cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                        : 'bg-white border-slate-200/90 text-slate-800 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <span className="font-medium">{ing.name}</span>
                    </div>

                    <div className="text-slate-600 font-semibold">
                      {scaledAmount} {ing.unit}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cooking Directions & Timers */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900">
              단계별 조리 가이드 & 타이머
            </h4>

            <div className="space-y-3">
              {meal.steps.map((step) => {
                const timer = activeTimers[step.stepNumber];

                return (
                  <div
                    key={step.stepNumber}
                    className="p-4 rounded-xl border border-slate-200/90 bg-white space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {step.stepNumber}
                      </div>
                      <div className="flex-1 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                        {step.instruction}
                      </div>
                    </div>

                    {/* Step Tip if present */}
                    {step.tip && (
                      <div className="ml-9 text-xs text-amber-800 bg-amber-50/80 px-2.5 py-1.5 rounded-md border border-amber-200/60 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>팁: {step.tip}</span>
                      </div>
                    )}

                    {/* Step Timer Widget */}
                    {timer && (
                      <div className="ml-9 mt-2 flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 w-fit">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        <span className="font-mono text-sm font-bold text-slate-800 min-w-[45px]">
                          {formatTimer(timer.remaining)}
                        </span>

                        <button
                          type="button"
                          onClick={() => toggleTimer(step.stepNumber)}
                          className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                            timer.isRunning
                              ? 'bg-amber-500 text-white'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {timer.isRunning ? (
                            <>
                              <Pause className="w-3 h-3" /> 일시정지
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3" /> 타이머 시작
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => resetTimer(step.stepNumber)}
                          className="p-1 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                          title="타이머 리셋"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chef's Pro Tips */}
          {meal.chefTips && meal.chefTips.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
                <ChefHat className="w-4 h-4 text-emerald-600" />
                셰프의 맛과 영양 보존 팁
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                {meal.chefTips.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 hidden sm:block">
            균형 잡힌 영양 식단과 함께 건강한 하루를 완성해 보세요.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
