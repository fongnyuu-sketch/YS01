import React from 'react';
import { DayOfWeek, DayPlan, WeeklyMealPlan } from '../types';
import {
  Calendar,
  Flame,
  Wheat,
  Beef,
  Droplet,
  ShieldCheck,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface WeeklyOverviewProps {
  plan: WeeklyMealPlan;
  selectedDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
  dayPlan: DayPlan;
}

export const WeeklyOverview: React.FC<WeeklyOverviewProps> = ({
  plan,
  selectedDay,
  onSelectDay,
  dayPlan,
}) => {
  const { totalNutrition } = dayPlan;
  const targetCals = plan.targetCalories;
  const calPercent = Math.min(100, Math.round((totalNutrition.calories / targetCals) * 100));

  // Compute Macro Grams to Kcal: Carbs(4), Protein(4), Fat(9)
  const carbKcal = totalNutrition.carbs * 4;
  const proteinKcal = totalNutrition.protein * 4;
  const fatKcal = totalNutrition.fat * 9;
  const totalMacroKcal = carbKcal + proteinKcal + fatKcal || 1;

  const carbRatio = Math.round((carbKcal / totalMacroKcal) * 100);
  const proteinRatio = Math.round((proteinKcal / totalMacroKcal) * 100);
  const fatRatio = 100 - carbRatio - proteinRatio;

  const days: { day: DayOfWeek; label: string; full: string }[] = [
    { day: '월', label: '월', full: '월요일' },
    { day: '화', label: '화', full: '화요일' },
    { day: '수', label: '수', full: '수요일' },
    { day: '목', label: '목', full: '목요일' },
    { day: '금', label: '금', full: '금요일' },
    { day: '토', label: '토', full: '토요일' },
    { day: '일', label: '일', full: '일요일' },
  ];

  return (
    <div className="space-y-4">
      {/* Plan Header & Tagline Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
              {plan.targetGoalLabel}
            </span>
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              하루 권장 목표 {plan.targetCalories} kcal
            </span>
            <span className="text-xs text-slate-400">
              (탄·단·지 비율 {plan.macroRatio.carbs}:{plan.macroRatio.protein}:{plan.macroRatio.fat})
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
            {plan.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed">
            {plan.tagline}
          </p>

          {/* Clinical Guidance Checklist snippet */}
          <div className="pt-2 border-t border-slate-700/60 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300">
            {plan.dietaryGuidance.slice(0, 2).map((guide, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{guide}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7-Day Selector Bar */}
      <div className="bg-white rounded-xl p-2 sm:p-3 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none">
          {days.map((item, idx) => {
            const isSelected = selectedDay === item.day;
            const currentDayObj = plan.days.find((d) => d.day === item.day);
            const cal = currentDayObj?.totalNutrition.calories || 0;

            return (
              <button
                key={item.day}
                id={`day-selector-${item.day}`}
                type="button"
                onClick={() => onSelectDay(item.day)}
                className={`flex-1 min-w-[70px] sm:min-w-[90px] py-2 sm:py-3 px-2 rounded-lg text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs scale-[1.02]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                }`}
              >
                <div className="text-xs font-semibold opacity-80">Day {idx + 1}</div>
                <div className="text-sm sm:text-base font-bold my-0.5">{item.full}</div>
                <div
                  className={`text-[11px] font-medium ${
                    isSelected ? 'text-emerald-100' : 'text-slate-500'
                  }`}
                >
                  {cal} kcal
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Theme & Nutrition Analytics Card */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              {selectedDay}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {dayPlan.dayLabel}
              </h3>
              <p className="text-xs text-emerald-700 font-medium">{dayPlan.theme}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-500">오늘 섭취 열량:</span>
            <span className="font-bold text-slate-900">{totalNutrition.calories} kcal</span>
            <span className="text-slate-400">/ 목표 {targetCals} kcal</span>
          </div>
        </div>

        {/* Nutritional Breakdown Visualizer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* 탄수화물 */}
          <div className="bg-slate-50/80 rounded-lg p-3 border border-slate-200/60">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="flex items-center gap-1 font-medium text-amber-700">
                <Wheat className="w-3.5 h-3.5" /> 탄수화물
              </span>
              <span className="font-semibold text-slate-700">{carbRatio}%</span>
            </div>
            <div className="text-lg font-bold text-slate-900">{totalNutrition.carbs}g</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, carbRatio)}%` }}
              />
            </div>
          </div>

          {/* 단백질 */}
          <div className="bg-slate-50/80 rounded-lg p-3 border border-slate-200/60">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="flex items-center gap-1 font-medium text-blue-700">
                <Beef className="w-3.5 h-3.5" /> 단백질
              </span>
              <span className="font-semibold text-slate-700">{proteinRatio}%</span>
            </div>
            <div className="text-lg font-bold text-slate-900">{totalNutrition.protein}g</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, proteinRatio)}%` }}
              />
            </div>
          </div>

          {/* 지방 */}
          <div className="bg-slate-50/80 rounded-lg p-3 border border-slate-200/60">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="flex items-center gap-1 font-medium text-rose-700">
                <Droplet className="w-3.5 h-3.5" /> 지방
              </span>
              <span className="font-semibold text-slate-700">{fatRatio}%</span>
            </div>
            <div className="text-lg font-bold text-slate-900">{totalNutrition.fat}g</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(5, fatRatio))}%` }}
              />
            </div>
          </div>

          {/* 식이섬유 & 나트륨 */}
          <div className="bg-slate-50/80 rounded-lg p-3 border border-slate-200/60 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">식이섬유</span>
              <span className="font-bold text-emerald-700">{totalNutrition.fiber}g</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
              <span className="text-slate-500">나트륨</span>
              <span
                className={`font-bold ${
                  totalNutrition.sodium <= 2000 ? 'text-emerald-700' : 'text-amber-600'
                }`}
              >
                {totalNutrition.sodium}mg
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {totalNutrition.sodium <= 2000
                ? 'WHO 권장(2000mg) 이하 안전'
                : '나트륨 조절 권장'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
