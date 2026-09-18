import React, { useState } from 'react';
import { WeeklyMealPlan } from '../types';
import {
  X,
  MessageSquareHeart,
  Send,
  Loader2,
  Sparkles,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

interface NutritionistChatProps {
  plan: WeeklyMealPlan;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

export const NutritionistChat: React.FC<NutritionistChatProps> = ({ plan, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: `안녕하세요! 전문 영양사 AI입니다. 현재 선택하신 [${plan.title}] 및 주간 식단표와 레시피에 대해 궁금한 점이나 개인별 식습관 조절 팁을 무엇이든 편하게 물어보세요!`,
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    '혈당 스파이크를 막는 올바른 식사 순서는?',
    '식단에서 단백질을 20g 더 챙기는 쉬운 방법은?',
    '외식할 때 다이어트 식단을 유지하는 요령은?',
    '나트륨 배출을 돕는 칼륨 음식 추천해줘',
  ];

  const handleAsk = async (queryText: string) => {
    const q = queryText.trim();
    if (!q || isLoading) return;

    setInputQuestion('');
    setMessages((prev) => [...prev, { sender: 'user', text: q }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/nutrition/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          mealContext: {
            title: plan.title,
            targetGoal: plan.targetGoal,
            targetCalories: plan.targetCalories,
            macroRatio: plan.macroRatio,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error);

      setMessages((prev) => [...prev, { sender: 'assistant', text: data.answer }]);
    } catch (e: any) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text:
            '죄송합니다. 영양 상담 연결 중 오류가 발생했습니다. AI Studio 환경변수(GEMINI_API_KEY) 설정을 확인해 주세요.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden my-6 border border-slate-200 flex flex-col h-[650px] max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-emerald-200 flex items-center justify-center">
              <MessageSquareHeart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold">1:1 AI 전문 영양사 상담실</h3>
              <p className="text-[11px] text-emerald-200">
                선택된 식단: {plan.title} ({plan.targetCalories} kcal)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 shadow-2xs'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-slate-500 border border-slate-200 rounded-2xl px-4 py-3 text-xs flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>영양 데이터 기반 맞춤 답변 작성 중...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Quick Questions */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">추천 질문:</span>
          {suggestedQuestions.map((sq, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAsk(sq)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 whitespace-nowrap transition-all border border-slate-200/60 cursor-pointer"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(inputQuestion);
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="식단과 영양에 대해 궁금한 점을 입력하세요..."
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
          />
          <button
            type="submit"
            disabled={!inputQuestion.trim() || isLoading}
            className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-40 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
