import React, { useState } from 'react';
import { MealItem } from '../types';
import {
  X,
  RefreshCw,
  Sparkles,
  Loader2,
  Check,
  Flame,
  Clock,
  ChefHat,
  ArrowRight,
} from 'lucide-react';

interface SwapMealModalProps {
  meal: MealItem | null;
  dayLabel: string;
  onClose: () => void;
  onConfirmSwap: (newMeal: MealItem) => void;
}

export const SwapMealModal: React.FC<SwapMealModalProps> = ({
  meal,
  dayLabel,
  onClose,
  onConfirmSwap,
}) => {
  if (!meal) return null;

  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Curated replacement candidates based on meal type
  const curatedReplacements: MealItem[] = [
    {
      id: `rep-1-${Date.now()}`,
      name: '아보카도 훈제연어 포케덮밥',
      subTitle: '오메가-3와 신선한 채소의 영양 밸런스 볼',
      mealType: meal.mealType,
      categoryTag: '오메가-3 충전',
      prepTimeMinutes: 10,
      cookTimeMinutes: 5,
      difficulty: '쉬움',
      servings: 1,
      nutrition: { calories: 540, protein: 34, carbs: 62, fat: 18, sodium: 480, fiber: 8 },
      ingredients: [
        { name: '현미귀리밥', amount: 160, unit: 'g', category: '곡류/면/두부' },
        { name: '훈제연어', amount: 120, unit: 'g', category: '정육/생선/계란' },
        { name: '아보카도', amount: 0.5, unit: '개', category: '채소/과일' },
        { name: '어린잎 채소', amount: 40, unit: 'g', category: '채소/과일' },
        { name: '와사비 폰즈 소스', amount: 1.5, unit: '큰술', category: '양념/오일/소스' },
      ],
      steps: [
        { stepNumber: 1, instruction: '그릇에 따뜻한 현미귀리밥을 평평하게 담습니다.' },
        { stepNumber: 2, instruction: '어린잎 채소, 깍둑썬 훈제연어와 아보카도를 색감 있게 둘러 올립니다.' },
        { stepNumber: 3, instruction: '와사비 폰즈 소스를 살짝 둘러 비벼 먹습니다.' },
      ],
      chefTips: ['연어의 아스타잔틴 성분이 피부 노화 방지에 도움을 줍니다.'],
      healthBenefit: '심혈관 건강을 지켜주는 양질의 불포화지방산이 풍부합니다.',
    },
    {
      id: `rep-2-${Date.now()}`,
      name: '차돌박이 숙주나물 볶음과 현미밥',
      subTitle: '아삭한 숙주와 소고기의 고단백 빠른 조리',
      mealType: meal.mealType,
      categoryTag: '15분 초간단 고단백',
      prepTimeMinutes: 5,
      cookTimeMinutes: 8,
      difficulty: '쉬움',
      servings: 1,
      nutrition: { calories: 580, protein: 36, carbs: 65, fat: 20, sodium: 520, fiber: 7 },
      ingredients: [
        { name: '현미밥', amount: 180, unit: 'g', category: '곡류/면/두부' },
        { name: '기름기 적은 소고기 우삼겹/차돌', amount: 110, unit: 'g', category: '정육/생선/계란' },
        { name: '숙주나물', amount: 150, unit: 'g', category: '채소/과일' },
        { name: '굴소스', amount: 1, unit: '큰술', category: '양념/오일/소스' },
        { name: '대파 & 마늘', amount: 30, unit: 'g', category: '채소/과일' },
      ],
      steps: [
        { stepNumber: 1, instruction: '달군 팬에 마늘과 파를 먼저 볶아 향을 냅니다.' },
        { stepNumber: 2, instruction: '소고기를 넣고 센 불에서 2분간 볶아 핏기가 가시면 숙주를 듬뿍 넣습니다.', timerSeconds: 120 },
        { stepNumber: 3, instruction: '굴소스 1큰술과 후추를 넣고 숙주 숨이 죽지 않도록 센 불에서 1분간 빠르게 볶아냅니다.', timerSeconds: 60 },
      ],
      chefTips: ['숙주는 오래 볶으면 물이 생기므로 센 불에서 재빠르게 조리해야 아삭합니다.'],
      healthBenefit: '숙주의 아스파라긴산이 간 해독과 피로 회복을 도와줍니다.',
    },
    {
      id: `rep-3-${Date.now()}`,
      name: '두부 버섯 스테이크 & 구운 토마토 가니쉬',
      subTitle: '식물성 단백질과 진한 버섯 향의 조화',
      mealType: meal.mealType,
      categoryTag: '식물성 클린 뉴트리션',
      prepTimeMinutes: 10,
      cookTimeMinutes: 12,
      difficulty: '쉬움',
      servings: 1,
      nutrition: { calories: 480, protein: 32, carbs: 45, fat: 16, sodium: 420, fiber: 9 },
      ingredients: [
        { name: '단단한 부침두부', amount: 200, unit: 'g', category: '곡류/면/두부' },
        { name: '표고버섯 & 새송이버섯', amount: 100, unit: 'g', category: '채소/과일' },
        { name: '완숙 토마토', amount: 1, unit: '개', category: '채소/과일' },
        { name: '발사믹 간장 글레이즈', amount: 1.5, unit: '큰술', category: '양념/오일/소스' },
        { name: '올리브유', amount: 1, unit: '큰술', category: '양념/오일/소스' },
      ],
      steps: [
        { stepNumber: 1, instruction: '두부는 키친타월로 수분을 꼼꼼히 제거하고 격자 모양 칼집을 냅니다.' },
        { stepNumber: 2, instruction: '팬에 올리브유를 두르고 두부와 버섯, 반 자른 토마토를 노릇노릇하게 굽습니다.', timerSeconds: 480 },
        { stepNumber: 3, instruction: '발사믹 글레이즈를 뿌려 두부 스테이크를 담아냅니다.' },
      ],
      chefTips: ['두부 수분을 잘 빼야 겉은 바삭하고 속은 촉촉한 식감이 됩니다.'],
      healthBenefit: '콜레스테롤 0%의 식물성 단백질로 혈관을 맑게 해줍니다.',
    },
  ];

  const handleGenerateAiSwap = async () => {
    setIsLoadingAi(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/mealplan/swap-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentMealName: meal.name,
          mealType: meal.mealType,
          targetCalories: meal.nutrition.calories,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error);
      onConfirmSwap(data);
      onClose();
    } catch (e: any) {
      console.error(e);
      setErrorMessage(
        e.message || 'AI 대체 메뉴 생성 중 문제가 발생했습니다. 추천 메뉴 중 선택해주세요.'
      );
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden my-6 border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-600" />
              <span>{dayLabel} {meal.mealType} 메뉴 교체</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              현재: <b className="text-slate-800">{meal.name}</b> ({meal.nutrition.calories} kcal)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
              {errorMessage}
            </div>
          )}

          {/* AI Swap Trigger */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Gemini AI 맞춤 즉석 추천
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                동일한 칼로리 대역의 신선한 요리를 AI가 즉시 설계합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerateAiSwap}
              disabled={isLoadingAi}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shrink-0 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoadingAi ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>생성 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI 추천받기</span>
                </>
              )}
            </button>
          </div>

          {/* Curated Alternatives List */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              영양사 엄선 추천 대체 메뉴
            </h4>

            {curatedReplacements.map((candidate) => (
              <div
                key={candidate.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-white transition-all space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{candidate.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                      {candidate.categoryTag}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onConfirmSwap(candidate);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-slate-900 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    <span>이 메뉴로 교체</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-xs text-slate-500">{candidate.subTitle}</p>

                <div className="flex items-center gap-3 text-xs text-slate-600 pt-1 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    {candidate.nutrition.calories} kcal
                  </span>
                  <span className="text-blue-700 font-medium">
                    단백질 {candidate.nutrition.protein}g
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    조리 {candidate.cookTimeMinutes}분
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
