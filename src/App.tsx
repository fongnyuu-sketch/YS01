import React, { useState, useEffect } from 'react';
import {
  WeeklyMealPlan,
  DayOfWeek,
  MealItem,
  PlanGoal,
  Ingredient,
  IngredientCategory,
} from './types';
import { ALL_DEFAULT_PLANS } from './data/defaultPlans';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { WeeklyOverview } from './components/WeeklyOverview';
import { DailyMealGrid } from './components/DailyMealGrid';
import { RecipeModal } from './components/RecipeModal';
import { GroceryListModal } from './components/GroceryListModal';
import { WeekTableView } from './components/WeekTableView';
import { AiPlannerModal } from './components/AiPlannerModal';
import { SwapMealModal } from './components/SwapMealModal';
import { NutritionistChat } from './components/NutritionistChat';
import { CommunityBoard } from './components/CommunityBoard';
import { CuteBackground } from './components/CuteBackground';
import { CheckCircle, Award } from 'lucide-react';

export default function App() {
  // Navigation & View mode state
  const [mainTab, setMainTab] = useState<'planner' | 'community'>('planner');
  const [currentGoal, setCurrentGoal] = useState<PlanGoal>('balanced');
  const [activePlan, setActivePlan] = useState<WeeklyMealPlan>(ALL_DEFAULT_PLANS.balanced);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('월');
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  // Modals state
  const [selectedMealForRecipe, setSelectedMealForRecipe] = useState<MealItem | null>(null);
  const [swapTarget, setSwapTarget] = useState<{ meal: MealItem; day: DayOfWeek } | null>(null);
  const [showGroceryModal, setShowGroceryModal] = useState(false);
  const [showAiPlannerModal, setShowAiPlannerModal] = useState(false);
  const [showNutritionChat, setShowNutritionChat] = useState(false);

  // User persistence state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('diet_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customGroceryItems, setCustomGroceryItems] = useState<
    { name: string; amount: number; unit: string; category: IngredientCategory }[]
  >(() => {
    try {
      const saved = localStorage.getItem('diet_grocery_custom');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('diet_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('diet_grocery_custom', JSON.stringify(customGroceryItems));
  }, [customGroceryItems]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Switch Goal Preset
  const handleSelectGoal = (goal: PlanGoal) => {
    setCurrentGoal(goal);
    if (ALL_DEFAULT_PLANS[goal]) {
      setActivePlan(ALL_DEFAULT_PLANS[goal]);
      showToast(`'${ALL_DEFAULT_PLANS[goal].title}' 식단으로 변경되었습니다.`);
    }
  };

  // Apply custom plan from AI Generator
  const handleApplyAiPlan = (plan: WeeklyMealPlan) => {
    setActivePlan(plan);
    setCurrentGoal(plan.targetGoal);
    setMainTab('planner');
    showToast('✨ 개인 맞춤 7일 영양 식단표와 레시피가 성공적으로 적용되었습니다!');
  };

  // Toggle favorite
  const handleToggleFavorite = (mealId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(mealId);
      const next = exists ? prev.filter((id) => id !== mealId) : [...prev, mealId];
      showToast(exists ? '즐겨찾기에서 제거되었습니다.' : '⭐ 즐겨찾기에 추가되었습니다.');
      return next;
    });
  };

  // Add ingredients to grocery list
  const handleAddIngredientsToGrocery = (ingredients: Ingredient[]) => {
    setCustomGroceryItems((prev) => [...prev, ...ingredients]);
    showToast(`🛒 ${ingredients.length}개 식재료가 장보기 목록에 추가되었습니다!`);
  };

  // Add single meal's all ingredients to grocery
  const handleAddAllToGrocery = (meal: MealItem) => {
    handleAddIngredientsToGrocery(meal.ingredients);
  };

  // Swap meal handler
  const handleConfirmSwap = (newMeal: MealItem) => {
    if (!swapTarget) return;
    const targetDay = swapTarget.day;

    setActivePlan((prevPlan) => {
      const updatedDays = prevPlan.days.map((dayPlan) => {
        if (dayPlan.day !== targetDay) return dayPlan;

        const currentMeals = { ...dayPlan.meals };
        if (newMeal.mealType === '아침') currentMeals.breakfast = newMeal;
        else if (newMeal.mealType === '점심') currentMeals.lunch = newMeal;
        else if (newMeal.mealType === '저녁') currentMeals.dinner = newMeal;
        else if (newMeal.mealType === '간식') currentMeals.snack = newMeal;

        // Recalculate daily nutrition
        const mealList = Object.values(currentMeals).filter(Boolean) as MealItem[];
        const newTotalNutrition = mealList.reduce(
          (acc, m) => ({
            calories: acc.calories + m.nutrition.calories,
            protein: acc.protein + m.nutrition.protein,
            carbs: acc.carbs + m.nutrition.carbs,
            fat: acc.fat + m.nutrition.fat,
            sodium: acc.sodium + m.nutrition.sodium,
            fiber: acc.fiber + m.nutrition.fiber,
            sugar: (acc.sugar || 0) + (m.nutrition.sugar || 0),
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 0, fiber: 0, sugar: 0 }
        );

        return {
          ...dayPlan,
          meals: currentMeals,
          totalNutrition: newTotalNutrition,
        };
      });

      return {
        ...prevPlan,
        days: updatedDays,
      };
    });

    showToast(`'${newMeal.name}'(으)로 메뉴가 성공적으로 교체되었습니다!`);
  };

  const currentDayPlan =
    activePlan.days.find((d) => d.day === selectedDay) || activePlan.days[0];

  return (
    <div className="min-h-screen relative text-slate-900 flex flex-col antialiased">
      {/* Cute Decorative Pastel Background & Floating Stickers */}
      <CuteBackground />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg text-xs sm:text-sm font-medium flex items-center gap-2 border border-slate-700 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        currentGoal={currentGoal}
        onSelectGoal={handleSelectGoal}
        onOpenAiPlanner={() => setShowAiPlannerModal(true)}
        onOpenGroceryList={() => setShowGroceryModal(true)}
        onOpenNutritionChat={() => setShowNutritionChat(true)}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        mainTab={mainTab}
        onChangeMainTab={setMainTab}
        groceryCount={customGroceryItems.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Hero Section with Embedded YouTube Video (rg9iVB7fiok) */}
        <HeroSection
          onOpenAiPlanner={() => setShowAiPlannerModal(true)}
          onOpenGroceryList={() => setShowGroceryModal(true)}
          onGoToCommunity={() => setMainTab('community')}
        />

        {/* Tab 1: Weekly Meal Planner View */}
        {mainTab === 'planner' ? (
          <div className="space-y-6">
            {/* Weekly Day Selector & Nutrition Summary */}
            <WeeklyOverview
              plan={activePlan}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              dayPlan={currentDayPlan}
            />

            {/* Mobile View Toggle */}
            <div className="flex sm:hidden items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">식단 보기 방식:</span>
              <div className="flex gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('day')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    viewMode === 'day' ? 'bg-slate-900 text-white' : 'text-slate-600'
                  }`}
                >
                  일별 식단
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    viewMode === 'week' ? 'bg-slate-900 text-white' : 'text-slate-600'
                  }`}
                >
                  주간 전체표
                </button>
              </div>
            </div>

            {/* Content Mode: Daily Grid or Full Week Table */}
            {viewMode === 'day' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span>{currentDayPlan.dayLabel} 맞춤 메뉴 & 단계별 레시피</span>
                  </h3>
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    카드를 클릭하여 상세 조리법과 조리 타이머를 확인하세요
                  </span>
                </div>

                <DailyMealGrid
                  dayPlan={currentDayPlan}
                  onSelectMeal={setSelectedMealForRecipe}
                  onSwapMeal={(meal) => setSwapTarget({ meal, day: selectedDay })}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onAddAllToGrocery={handleAddAllToGrocery}
                />
              </div>
            ) : (
              <WeekTableView plan={activePlan} onSelectMeal={setSelectedMealForRecipe} />
            )}

            {/* Nutrition Education Guide Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-3 no-print">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>임상 영양사가 제안하는 건강한 식습관 가이드</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                      1
                    </span>
                    식이섬유 먼저 섭취하기
                  </div>
                  <p className="leading-relaxed text-slate-500">
                    식사 시 채소나 국물의 건더기를 먼저 5분간 천천히 드시면 혈당이 천천히 올라 인슐린
                    분비가 안정됩니다.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                      2
                    </span>
                    매 끼니 양질의 단백질 분배
                  </div>
                  <p className="leading-relaxed text-slate-500">
                    단백질을 저녁에 몰아먹기보다 아침·점심·저녁에 손바닥 반 개(25~35g)씩 균등하게
                    분배해야 근육 합성이 활발합니다.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold">
                      3
                    </span>
                    수분 섭취와 나트륨 밸런스
                  </div>
                  <p className="leading-relaxed text-slate-500">
                    식간에 미온수를 충분히 마시고 칼륨이 풍부한 시금치·버섯류를 곁들이면 불필요한
                    나트륨과 부기가 배출됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Tab 2: Community Board View */
          <CommunityBoard onBackToPlanner={() => setMainTab('planner')} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-center text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium text-slate-600">
            한주의 영양맞춤 식단과 레시피 (Weekly Nutrition Meal Planner)
          </p>
          <p>
            본 식단은 한국인 영양섭취기준(KDRIs)과 사용자 신체 프로필을 기반으로 임상 영양 설계 및
            스마트 장보기 추천 서비스를 제공합니다.
          </p>
        </div>
      </footer>

      {/* Modals */}
      {selectedMealForRecipe && (
        <RecipeModal
          meal={selectedMealForRecipe}
          onClose={() => setSelectedMealForRecipe(null)}
          onAddToGrocery={handleAddIngredientsToGrocery}
        />
      )}

      {swapTarget && (
        <SwapMealModal
          meal={swapTarget.meal}
          dayLabel={swapTarget.day + '요일'}
          onClose={() => setSwapTarget(null)}
          onConfirmSwap={handleConfirmSwap}
        />
      )}

      {showGroceryModal && (
        <GroceryListModal
          plan={activePlan}
          customIngredients={customGroceryItems}
          onClose={() => setShowGroceryModal(false)}
          onClearCustom={() => setCustomGroceryItems([])}
        />
      )}

      {showAiPlannerModal && (
        <AiPlannerModal
          onClose={() => setShowAiPlannerModal(false)}
          onApplyPlan={handleApplyAiPlan}
        />
      )}

      {showNutritionChat && (
        <NutritionistChat plan={activePlan} onClose={() => setShowNutritionChat(false)} />
      )}
    </div>
  );
}
