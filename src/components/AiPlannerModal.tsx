import React, { useState, useMemo } from 'react';
import {
  ActivityLevel,
  Gender,
  PlanGoal,
  UserPersonalProfile,
  WeeklyMealPlan,
} from '../types';
import {
  X,
  Sparkles,
  Flame,
  ShieldAlert,
  Loader2,
  CheckCircle,
  Scale,
  Dumbbell,
  HeartPulse,
  Zap,
  User,
  Heart,
  Activity,
  ArrowRight,
  Info,
} from 'lucide-react';
import { calculatePersonalizedPlan } from '../utils/nutritionCalculator';
import { createPersonalizedPlanFromProfile } from '../utils/personalizedPlanFallback';

interface AiPlannerModalProps {
  onClose: () => void;
  onApplyPlan: (plan: WeeklyMealPlan) => void;
}

export const AiPlannerModal: React.FC<AiPlannerModalProps> = ({ onClose, onApplyPlan }) => {
  // Personal Profile state
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<Gender>('female');
  const [heightCm, setHeightCm] = useState<number>(165);
  const [weightKg, setWeightKg] = useState<number>(58);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<PlanGoal>('diet');

  // Dietary preferences & allergies
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [customAllergyInput, setCustomAllergyInput] = useState('');
  const [excludeSpicy, setExcludeSpicy] = useState(false);
  const [lowSodium, setLowSodium] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Compute calculated profile real-time
  const calculatedProfile = useMemo(() => {
    return calculatePersonalizedPlan({
      age,
      gender,
      heightCm,
      weightKg,
      activityLevel,
      goal,
    });
  }, [age, gender, heightCm, weightKg, activityLevel, goal]);

  const commonAllergies = [
    '갑각류/새우',
    '유제품/우유',
    '견과류/땅콩',
    '돼지고기',
    '글루텐/밀가루',
    '조개류',
    '오이',
    '가지',
  ];

  const toggleAllergy = (item: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleAddCustomAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAllergyInput.trim()) return;
    if (!selectedAllergies.includes(customAllergyInput.trim())) {
      setSelectedAllergies((prev) => [...prev, customAllergyInput.trim()]);
    }
    setCustomAllergyInput('');
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const targetCalorie = calculatedProfile.recommendedCalories || 1800;

    try {
      const response = await fetch('/api/mealplan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: calculatedProfile,
          goal,
          calorieTarget: targetCalorie,
          allergies: selectedAllergies,
          excludeSpicy,
          lowSodium,
          additionalNotes,
          daysCount: 7,
        }),
      });

      const data = await response.json();

      if (response.ok && data && data.days && data.days.length > 0) {
        data.userProfile = calculatedProfile;
        onApplyPlan(data);
        onClose();
        return;
      }

      // If backend failed or key was not present, fallback cleanly
      console.warn('API returned error or empty plan, applying high-precision scientific fallback:', data?.message);
      const fallbackPlan = createPersonalizedPlanFromProfile(
        calculatedProfile,
        selectedAllergies,
        excludeSpicy,
        lowSodium
      );
      onApplyPlan(fallbackPlan);
      onClose();
    } catch (err: any) {
      console.warn('Network or AI generation error, using client-side personalized fallback:', err);
      const fallbackPlan = createPersonalizedPlanFromProfile(
        calculatedProfile,
        selectedAllergies,
        excludeSpicy,
        lowSodium
      );
      onApplyPlan(fallbackPlan);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const activityOptions: { id: ActivityLevel; title: string; desc: string }[] = [
    { id: 'sedentary', title: '좌식 생활', desc: '운동을 거의 하지 않음, 주로 앉아서 근무' },
    { id: 'light', title: '가벼운 활동', desc: '주 1~3일 가벼운 산책 또는 가벼운 운동' },
    { id: 'moderate', title: '보통 활동', desc: '주 3~5일 규칙적인 유산소/근력 운동' },
    { id: 'active', title: '활동적', desc: '주 6~7일 고강도 운동 및 활동적인 직업' },
    { id: 'veryActive', title: '매우 활동적', desc: '전문 운동선수, 강도 높은 육체노동' },
  ];

  const goalOptions: {
    id: PlanGoal;
    label: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 'diet',
      label: '체중 감량 (다이어트)',
      desc: '체지방 컷팅, 고단백 저탄수화물 및 고식이섬유 포만감',
      icon: <Flame className="w-4 h-4 text-rose-500" />,
      color: 'border-rose-300 hover:border-rose-500',
    },
    {
      id: 'muscle',
      label: '근육 증가 (벌크업)',
      desc: '근육 합성 극대화, 매 끼니 30g+ 양질의 단백질 및 복합당',
      icon: <Dumbbell className="w-4 h-4 text-blue-500" />,
      color: 'border-blue-300 hover:border-blue-500',
    },
    {
      id: 'balanced',
      label: '건강 유지 (웰빙)',
      desc: '한국인 영양섭취기준(KDRIs)에 맞춘 황금 5:2.5:2.5 영양 밸런스',
      icon: <Scale className="w-4 h-4 text-emerald-500" />,
      color: 'border-emerald-300 hover:border-emerald-500',
    },
    {
      id: 'bloodsugar',
      label: '혈당·혈압 케어',
      desc: '저염(1400mg 이하)과 저GI 복합 탄수화물로 안정된 혈당 유지',
      icon: <HeartPulse className="w-4 h-4 text-amber-500" />,
      color: 'border-amber-300 hover:border-amber-500',
    },
    {
      id: 'quick',
      label: '15분 초간단 실속식',
      desc: '바쁜 직장인/학생을 위한 원팬·밀프렙 중심 스피드 식단',
      icon: <Zap className="w-4 h-4 text-indigo-500" />,
      color: 'border-indigo-300 hover:border-indigo-500',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-6 border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-300 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                개인 신체 & 활동 맞춤 7일 영양 식단 생성기
              </h3>
              <p className="text-xs text-slate-300">
                나이, 성별, 활동량, 건강 목표를 기반으로 최적 칼로리와 탄·단·지 비율을 자동 산출합니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Section 1: Basic Physical Metrics */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>1. 사용자 기본 신체 정보 (나이, 성별, 체격)</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">성별</label>
                <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      gender === 'female'
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    여성
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      gender === 'male'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    남성
                  </button>
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  나이 (만 나이)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={12}
                    max={95}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value) || 20)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400">세</span>
                </div>
              </div>

              {/* Height */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">키 (신장)</label>
                <div className="relative">
                  <input
                    type="number"
                    min={120}
                    max={220}
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value) || 160)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400">cm</span>
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">체중</label>
                <div className="relative">
                  <input
                    type="number"
                    min={35}
                    max={180}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value) || 50)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400">kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Activity Level */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>2. 평소 일상 활동량 및 운동 빈도</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {activityOptions.map((opt) => {
                const isSelected = activityLevel === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setActivityLevel(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 text-slate-900 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{opt.title}</span>
                      {isSelected && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Health Goal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>3. 맞춤 건강 목표 선택</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {goalOptions.map((opt) => {
                const isSelected = goal === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setGoal(opt.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {opt.icon}
                      <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {opt.label}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] leading-snug ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Real-time Calculated Energy & Macro Preview */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/60 to-slate-50 border border-emerald-200/80 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span className="text-xs sm:text-sm font-bold text-emerald-950">
                  과학적 대사량 산출 & 권장 영양 가이드
                </span>
              </div>
              <span className="text-[11px] font-medium text-emerald-700">Mifflin-St Jeor 공식</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-[11px] text-slate-500">기초대사량 (BMR)</span>
                <div className="text-base sm:text-lg font-black text-slate-800">
                  {calculatedProfile.bmr} <span className="text-xs font-normal text-slate-400">kcal</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-[11px] text-slate-500">일일소비량 (TDEE)</span>
                <div className="text-base sm:text-lg font-black text-slate-800">
                  {calculatedProfile.tdee} <span className="text-xs font-normal text-slate-400">kcal</span>
                </div>
              </div>

              <div className="bg-emerald-600 text-white p-3 rounded-xl shadow-xs">
                <span className="text-[11px] text-emerald-100 font-semibold">하루 목표 권장량</span>
                <div className="text-base sm:text-lg font-black">
                  {calculatedProfile.recommendedCalories} <span className="text-xs font-normal text-emerald-200">kcal</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-[11px] text-slate-500">권장 탄·단·지</span>
                <div className="text-xs font-bold text-emerald-900 mt-1 space-x-1">
                  <span>탄 {calculatedProfile.recommendedCarbs}g</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-blue-600">단 {calculatedProfile.recommendedProtein}g</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-amber-600">지 {calculatedProfile.recommendedFat}g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Allergies & Advanced Preferences Toggle */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>알레르기, 비선호 식품 및 조리 옵션 (선택 사항)</span>
                {selectedAllergies.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px]">
                    {selectedAllergies.length}개 제외
                  </span>
                )}
              </div>
              <span className="text-slate-400 text-xs">{showAdvanced ? '접기 ▲' : '펼치기 ▼'}</span>
            </button>

            {showAdvanced && (
              <div className="space-y-4 pt-3 border-t border-slate-200 text-xs">
                {/* Allergy Pills */}
                <div>
                  <span className="block font-semibold text-slate-600 mb-1.5">
                    제외할 알레르기/비선호 식품:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {commonAllergies.map((allergy) => {
                      const isSelected = selectedAllergies.includes(allergy);
                      return (
                        <button
                          key={allergy}
                          type="button"
                          onClick={() => toggleAllergy(allergy)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-rose-500 text-white shadow-2xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? `✕ ${allergy}` : `+ ${allergy}`}
                        </button>
                      );
                    })}
                  </div>

                  <form onSubmit={handleAddCustomAllergy} className="mt-2 flex gap-1.5">
                    <input
                      type="text"
                      placeholder="기타 비선호 재료 입력 (예: 당근, 고수)"
                      value={customAllergyInput}
                      onChange={(e) => setCustomAllergyInput(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 flex-1"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium cursor-pointer"
                    >
                      추가
                    </button>
                  </form>
                </div>

                {/* Spicy & Sodium Toggles */}
                <div className="flex flex-wrap gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={excludeSpicy}
                      onChange={(e) => setExcludeSpicy(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span>매운 음식 및 캡사이신 배제</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={lowSodium}
                      onChange={(e) => setLowSodium(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span>엄격한 저염식 (하루 1300mg 이하) 적용</span>
                  </label>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">기타 요청사항</label>
                  <input
                    type="text"
                    placeholder="예: 아침은 10분 내로 끝나는 간편식 위주, 점심은 도시락용"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Submit Button */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-slate-500 hidden sm:block">
            {calculatedProfile.age}세 {calculatedProfile.gender === 'male' ? '남성' : '여성'} · 하루 {calculatedProfile.recommendedCalories} kcal 맞춤 7일 식단
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              취소
            </button>

            <button
              id="submit-ai-planner-btn"
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>맞춤 식단 & 레시피 생성 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>맞춤 7일 식단표 생성하기</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
