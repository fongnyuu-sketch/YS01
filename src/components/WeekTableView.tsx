import React from 'react';
import { WeeklyMealPlan, MealItem } from '../types';
import { Calendar, ArrowUpRight, Flame, Clock } from 'lucide-react';

interface WeekTableViewProps {
  plan: WeeklyMealPlan;
  onSelectMeal: (meal: MealItem) => void;
}

export const WeekTableView: React.FC<WeekTableViewProps> = ({ plan, onSelectMeal }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>7일 주간 식단표 한눈에 보기</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            메뉴를 클릭하면 상세 레시피와 요리 타이머를 확인할 수 있습니다.
          </p>
        </div>
        <div className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-medium self-start sm:self-auto">
          {plan.title} (하루 목표 {plan.targetCalories} kcal)
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-100/80 text-slate-700 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
              <th className="p-3.5 w-24 text-center">요일</th>
              <th className="p-3.5">아침 (Breakfast)</th>
              <th className="p-3.5">점심 (Lunch)</th>
              <th className="p-3.5">저녁 (Dinner)</th>
              <th className="p-3.5">간식 (Snack)</th>
              <th className="p-3.5 w-28 text-center">일일 합계</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {plan.days.map((d) => (
              <tr key={d.day} className="hover:bg-slate-50/60 transition-colors">
                <td className="p-3.5 text-center font-bold text-slate-900 bg-slate-50/40 border-r border-slate-100">
                  <div className="text-sm text-emerald-700">{d.day}요일</div>
                  <div className="text-[11px] text-slate-400 font-normal">
                    {d.dayLabel.split(' ')[1] || ''}
                  </div>
                </td>

                {/* Breakfast */}
                <td className="p-2.5 align-top">
                  <MealCell meal={d.meals.breakfast} onClick={() => onSelectMeal(d.meals.breakfast)} />
                </td>

                {/* Lunch */}
                <td className="p-2.5 align-top">
                  <MealCell meal={d.meals.lunch} onClick={() => onSelectMeal(d.meals.lunch)} />
                </td>

                {/* Dinner */}
                <td className="p-2.5 align-top">
                  <MealCell meal={d.meals.dinner} onClick={() => onSelectMeal(d.meals.dinner)} />
                </td>

                {/* Snack */}
                <td className="p-2.5 align-top">
                  {d.meals.snack ? (
                    <MealCell meal={d.meals.snack} onClick={() => onSelectMeal(d.meals.snack!)} isSnack />
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </td>

                {/* Total */}
                <td className="p-3.5 text-center align-middle font-semibold text-slate-800 bg-slate-50/30 border-l border-slate-100">
                  <div className="text-sm font-bold text-slate-900">
                    {d.totalNutrition.calories} <span className="text-[10px] font-normal">kcal</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                    단 {d.totalNutrition.protein}g · 탄 {d.totalNutrition.carbs}g
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MealCell: React.FC<{ meal: MealItem; onClick: () => void; isSnack?: boolean }> = ({
  meal,
  onClick,
  isSnack,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-2 rounded-lg border transition-all cursor-pointer group flex flex-col justify-between h-full ${
        isSnack
          ? 'bg-purple-50/30 border-purple-100 hover:border-purple-300'
          : 'bg-white border-slate-200/80 hover:border-emerald-300 hover:shadow-2xs'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
            {meal.categoryTag}
          </span>
          <ArrowUpRight className="w-3 h-3 text-slate-300 group-hover:text-emerald-600 transition-colors" />
        </div>
        <div className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors text-xs leading-snug line-clamp-2">
          {meal.name}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-1.5 border-t border-slate-100">
        <span className="font-medium text-slate-600">{meal.nutrition.calories} kcal</span>
        <span className="text-blue-600 font-medium">단 {meal.nutrition.protein}g</span>
      </div>
    </div>
  );
};
