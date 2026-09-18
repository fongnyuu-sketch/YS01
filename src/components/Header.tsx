import React from 'react';
import { PlanGoal } from '../types';
import {
  UtensilsCrossed,
  Sparkles,
  ShoppingCart,
  CalendarDays,
  Printer,
  MessageSquareHeart,
  Scale,
  Flame,
  Dumbbell,
  HeartPulse,
  Zap,
  Users,
  LayoutGrid,
} from 'lucide-react';

interface HeaderProps {
  currentGoal: PlanGoal;
  onSelectGoal: (goal: PlanGoal) => void;
  onOpenAiPlanner: () => void;
  onOpenGroceryList: () => void;
  onOpenNutritionChat: () => void;
  viewMode: 'day' | 'week';
  onChangeViewMode: (mode: 'day' | 'week') => void;
  mainTab: 'planner' | 'community';
  onChangeMainTab: (tab: 'planner' | 'community') => void;
  groceryCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentGoal,
  onSelectGoal,
  onOpenAiPlanner,
  onOpenGroceryList,
  onOpenNutritionChat,
  viewMode,
  onChangeViewMode,
  mainTab,
  onChangeMainTab,
  groceryCount,
}) => {
  const goalPresets: { id: PlanGoal; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'balanced', label: '균형 웰빙식', icon: <Scale className="w-4 h-4" />, color: 'emerald' },
    { id: 'diet', label: '체지방 컷', icon: <Flame className="w-4 h-4" />, color: 'rose' },
    { id: 'muscle', label: '고단백 벌크업', icon: <Dumbbell className="w-4 h-4" />, color: 'blue' },
    { id: 'bloodsugar', label: '저염·혈당케어', icon: <HeartPulse className="w-4 h-4" />, color: 'amber' },
    { id: 'quick', label: '15분 초간단', icon: <Zap className="w-4 h-4" />, color: 'indigo' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & Brand & Main Tab Switcher */}
          <div className="flex items-center gap-4 sm:gap-6 min-w-max">
            <button
              type="button"
              onClick={() => onChangeMainTab('planner')}
              className="flex items-center gap-3 cursor-pointer text-left"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
                <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900">
                    한주의 영양맞춤 식단
                  </h1>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    7일 맞춤 식단 & 레시피
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  칼로리·탄단지 과학적 맞춤 설계 & 스마트 장보기
                </p>
              </div>
            </button>

            {/* Navigation Tabs (Planner vs Community) */}
            <nav className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                id="main-tab-planner-btn"
                type="button"
                onClick={() => onChangeMainTab('planner')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  mainTab === 'planner'
                    ? 'bg-white text-emerald-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>주간 식단표</span>
              </button>

              <button
                id="main-tab-community-btn"
                type="button"
                onClick={() => onChangeMainTab('community')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  mainTab === 'community'
                    ? 'bg-white text-emerald-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>후기·레시피 커뮤니티</span>
              </button>
            </nav>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* View Mode Toggle when in planner */}
            {mainTab === 'planner' && (
              <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
                <button
                  id="view-mode-day-btn"
                  type="button"
                  onClick={() => onChangeViewMode('day')}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    viewMode === 'day'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  일별 상세
                </button>
                <button
                  id="view-mode-week-btn"
                  type="button"
                  onClick={() => onChangeViewMode('week')}
                  className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
                    viewMode === 'week'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  주간 전체표
                </button>
              </div>
            )}

            {/* AI Generator Button */}
            <button
              id="open-ai-planner-btn"
              type="button"
              onClick={onOpenAiPlanner}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
              <span>맞춤 식단 생성</span>
            </button>

            {/* Smart Grocery List Button */}
            <button
              id="open-grocery-list-btn"
              type="button"
              onClick={onOpenGroceryList}
              className="relative inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs sm:text-sm font-medium border border-slate-200/70 transition-all cursor-pointer"
              title="스마트 장보기 목록"
            >
              <ShoppingCart className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline">장보기 목록</span>
              {groceryCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                  {groceryCount}
                </span>
              )}
            </button>

            {/* Nutritionist Q&A */}
            <button
              id="open-nutrition-chat-btn"
              type="button"
              onClick={onOpenNutritionChat}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs sm:text-sm font-medium border border-slate-200/70 transition-all cursor-pointer"
              title="영양사 AI 상담"
            >
              <MessageSquareHeart className="w-4 h-4 text-rose-500" />
              <span className="hidden xl:inline">영양 상담</span>
            </button>

            {/* Print Button */}
            <button
              id="print-meal-plan-btn"
              type="button"
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 border border-slate-200/70 transition-all cursor-pointer"
              title="식단표 인쇄"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Goal Preset Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400 shrink-0 mr-1 hidden sm:inline">
            영양 맞춤 목표:
          </span>
          {goalPresets.map((preset) => {
            const isSelected = currentGoal === preset.id;
            return (
              <button
                key={preset.id}
                id={`goal-tab-${preset.id}`}
                type="button"
                onClick={() => {
                  onSelectGoal(preset.id);
                  if (mainTab !== 'planner') onChangeMainTab('planner');
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                {preset.icon}
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
