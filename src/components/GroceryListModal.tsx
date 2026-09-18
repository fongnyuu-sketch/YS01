import React, { useState } from 'react';
import { WeeklyMealPlan, IngredientCategory } from '../types';
import {
  X,
  ShoppingCart,
  Check,
  Copy,
  Printer,
  Tag,
  ExternalLink,
  Store,
  Sparkles,
  ShoppingBag,
  Info,
  DollarSign,
  Package,
} from 'lucide-react';
import {
  getPurchaseOptionForIngredient,
  getRetailerRecommendations,
} from '../utils/shoppingRecommendation';

interface GroceryListModalProps {
  plan: WeeklyMealPlan;
  customIngredients: { name: string; amount: number; unit: string; category: IngredientCategory }[];
  onClose: () => void;
  onClearCustom: () => void;
}

export const GroceryListModal: React.FC<GroceryListModalProps> = ({
  plan,
  customIngredients,
  onClose,
  onClearCustom,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRetailerFilter, setSelectedRetailerFilter] = useState<string>('all');
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<{
    name: string;
    amount: number;
    unit: string;
    category: IngredientCategory;
  } | null>(null);

  // Aggregate all ingredients from the entire 7-day meal plan plus any manually added items
  const aggregatedMap: Record<
    string,
    { name: string; amount: number; unit: string; category: IngredientCategory; count: number }
  > = {};

  const addIngredient = (ing: {
    name: string;
    amount: number;
    unit: string;
    category: IngredientCategory;
  }) => {
    const key = `${ing.name}__${ing.unit}`;
    if (!aggregatedMap[key]) {
      aggregatedMap[key] = {
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        category: ing.category,
        count: 1,
      };
    } else {
      aggregatedMap[key].amount = Math.round((aggregatedMap[key].amount + ing.amount) * 10) / 10;
      aggregatedMap[key].count += 1;
    }
  };

  // 1. Process 7-day plan ingredients
  plan.days.forEach((day) => {
    Object.values(day.meals).forEach((meal) => {
      if (meal && meal.ingredients) {
        meal.ingredients.forEach(addIngredient);
      }
    });
  });

  // 2. Process any user added ingredients
  customIngredients.forEach(addIngredient);

  const allItems = Object.values(aggregatedMap);

  // Group by category
  const categories: IngredientCategory[] = [
    '채소/과일',
    '정육/생선/계란',
    '곡류/면/두부',
    '양념/오일/소스',
    '유제품/견과/기타',
  ];

  const toggleCheck = (itemKey: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  const checkAll = () => {
    const allChecked: Record<string, boolean> = {};
    allItems.forEach((item) => {
      allChecked[`${item.name}__${item.unit}`] = true;
    });
    setCheckedItems(allChecked);
  };

  const uncheckAll = () => {
    setCheckedItems({});
  };

  const copyToClipboard = () => {
    let text = `🛒 [${plan.title}] 7일 영양 맞춤 장보기 목록 & 구매 추천\n\n`;
    categories.forEach((cat) => {
      const items = allItems.filter((i) => i.category === cat);
      if (items.length > 0) {
        text += `■ ${cat}\n`;
        items.forEach((item) => {
          const isDone = checkedItems[`${item.name}__${item.unit}`] ? '[v]' : '[ ]';
          const opt = getPurchaseOptionForIngredient(item.name, item.category);
          text += `  ${isDone} ${item.name} ${item.amount}${item.unit} (${opt.optionType} 추천: ${opt.packSize}, 예상 ${opt.estPrice})\n`;
        });
        text += '\n';
      }
    });

    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const totalItemCount = allItems.length;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-6 border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-white px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  주간 식재료 스마트 장보기 & 판매처 추천
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  구매 옵션 제공
                </span>
              </div>
              <p className="text-xs text-slate-500">
                총 {totalItemCount}개 식재료 | 구매 완료 {checkedCount}개 | 마트·온라인 쇼핑몰별
                추천 판매처 바로가기
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="grocery-copy-btn"
              type="button"
              onClick={copyToClipboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 transition-all cursor-pointer"
              title="클립보드로 복사"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copySuccess ? '복사 완료!' : '목록 복사'}</span>
            </button>

            <button
              id="grocery-print-btn"
              type="button"
              onClick={() => window.print()}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
              title="장보기 목록 인쇄"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              id="grocery-close-btn"
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Online Shopping Mall Quick Bar */}
        <div className="px-5 py-3 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-200">추천 온라인 쇼핑몰 바로가기:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://www.coupang.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
            >
              <span>🚀 쿠팡 로켓프레시 (새벽도착)</span>
              <ExternalLink className="w-3 h-3 text-slate-300" />
            </a>
            <a
              href="https://www.kurly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-purple-200 font-medium transition-all"
            >
              <span>💜 마켓컬리 (샛별배송)</span>
              <ExternalLink className="w-3 h-3 text-purple-300" />
            </a>
            <a
              href="https://www.ssg.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-yellow-200 font-medium transition-all"
            >
              <span>💛 이마트 쓱배송 (당일도착)</span>
              <ExternalLink className="w-3 h-3 text-yellow-300" />
            </a>
            <a
              href="https://shopping.naver.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-emerald-200 font-medium transition-all"
            >
              <span>💚 네이버 장보기</span>
              <ExternalLink className="w-3 h-3 text-emerald-300" />
            </a>
          </div>
        </div>

        {/* Category Pills & Bulk Selection */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              전체 보기 ({totalItemCount})
            </button>
            {categories.map((cat) => {
              const count = allItems.filter((i) => i.category === cat).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={checkAll}
              className="text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
            >
              전체 선택
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={uncheckAll}
              className="text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
            >
              전체 해제
            </button>
          </div>
        </div>

        {/* Items List with Purchase Options and Retailer Recommendations */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {categories
            .filter((cat) => selectedCategory === 'all' || selectedCategory === cat)
            .map((cat) => {
              const items = allItems.filter((i) => i.category === cat);
              if (items.length === 0) return null;

              return (
                <div key={cat} className="space-y-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <span>{cat}</span>
                      <span className="text-xs font-normal text-slate-400">({items.length}개)</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      클릭하여 체크 또는 판매처 바로 검색
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {items.map((item) => {
                      const itemKey = `${item.name}__${item.unit}`;
                      const isChecked = Boolean(checkedItems[itemKey]);
                      const purchaseOpt = getPurchaseOptionForIngredient(item.name, item.category);
                      const retailers = getRetailerRecommendations(item.name);

                      return (
                        <div
                          key={itemKey}
                          className={`p-3.5 rounded-xl border transition-all ${
                            isChecked
                              ? 'bg-slate-50 border-slate-200 text-slate-400'
                              : 'bg-white border-slate-200/90 hover:border-emerald-300 shadow-2xs'
                          }`}
                        >
                          {/* Item Top row: Checkbox, Name, Amount */}
                          <div className="flex items-start justify-between gap-2">
                            <div
                              onClick={() => toggleCheck(itemKey)}
                              className="flex items-start gap-2.5 cursor-pointer flex-1"
                            >
                              <div
                                className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition-all shrink-0 ${
                                  isChecked
                                    ? 'bg-emerald-600 border-emerald-600 text-white'
                                    : 'border-slate-300 bg-white hover:border-emerald-500'
                                }`}
                              >
                                {isChecked && <Check className="w-3.5 h-3.5" />}
                              </div>
                              <div>
                                <span
                                  className={`text-sm font-bold ${
                                    isChecked ? 'line-through text-slate-400' : 'text-slate-900'
                                  }`}
                                >
                                  {item.name}
                                </span>
                                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                                  <span>필요량:</span>
                                  <span className="font-semibold text-emerald-700">
                                    {item.amount} {item.unit}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Purchase Option Badge */}
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${purchaseOpt.badgeColor}`}
                            >
                              {purchaseOpt.optionType}
                            </span>
                          </div>

                          {/* Purchase Specification & Price Recommendation */}
                          <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-600">
                            <div className="flex items-center justify-between text-slate-500">
                              <span className="flex items-center gap-1">
                                <Package className="w-3 h-3 text-slate-400" />
                                <span>추천 구매 규격:</span>
                              </span>
                              <span className="font-medium text-slate-700">{purchaseOpt.packSize}</span>
                            </div>

                            <div className="flex items-center justify-between text-slate-500">
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3 text-emerald-500" />
                                <span>예상 가격대:</span>
                              </span>
                              <span className="font-semibold text-slate-800">{purchaseOpt.estPrice}</span>
                            </div>
                          </div>

                          {/* Retailer Quick Search Buttons */}
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-semibold text-slate-400 mr-1">
                              추천 판매처:
                            </span>
                            {retailers.slice(0, 3).map((ret) => (
                              <a
                                key={ret.name}
                                href={ret.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium border transition-all ${ret.color}`}
                                title={`${ret.brand}에서 '${item.name}' 바로 검색`}
                              >
                                <span>{ret.name.split(' ')[0]}</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                              </a>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              각 품목별 추천 판매처를 클릭하면 해당 마트의 최저가/신선 새벽배송 검색 페이지로 즉시
              연결됩니다.
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer ml-auto"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
