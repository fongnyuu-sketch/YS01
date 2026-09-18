import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  ShoppingCart,
  Users,
  Flame,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface HeroSectionProps {
  onOpenAiPlanner: () => void;
  onOpenGroceryList: () => void;
  onGoToCommunity: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenAiPlanner,
  onOpenGroceryList,
  onGoToCommunity,
}) => {
  const [showVideoDetails, setShowVideoDetails] = useState(true);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 text-white p-6 sm:p-8 lg:p-10 shadow-lg border border-emerald-900/40">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Headline, Description & Quick CTAs */}
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-300" />
            <span>임상영양 설계 & AI 개인 맞춤 플래너</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              당신만을 위한 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
                한주의 영양맞춤 식단
              </span>
              과 꿀맛 레시피
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              나이, 성별, 활동량, 건강 목표를 바탕으로 과학적인 칼로리와 탄·단·지 비율을
              계산합니다. 주간 식재료 스마트 쇼핑몰 연계와 실시간 커뮤니티로 맛있고 지속 가능한
              식단을 시작해보세요.
            </p>
          </div>

          {/* Key Metric Badges */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 py-1">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 text-center">
              <div className="text-base sm:text-lg font-bold text-emerald-300">7 Days</div>
              <div className="text-[11px] text-slate-300">완벽 구성 식단</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 text-center">
              <div className="text-base sm:text-lg font-bold text-amber-300">탄·단·지</div>
              <div className="text-[11px] text-slate-300">정밀 영양 비율</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 text-center">
              <div className="text-base sm:text-lg font-bold text-teal-300">스마트 장보기</div>
              <div className="text-[11px] text-slate-300">온라인몰 직연동</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              id="hero-cta-ai-plan"
              type="button"
              onClick={onOpenAiPlanner}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/25 transition-all transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>내 맞춤 식단 생성하기</span>
            </button>

            <button
              id="hero-cta-grocery"
              type="button"
              onClick={onOpenGroceryList}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/15 hover:bg-white/20 text-white font-semibold text-sm border border-white/15 transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-emerald-300" />
              <span>식재료 장보기 목록</span>
            </button>

            <button
              id="hero-cta-community"
              type="button"
              onClick={onGoToCommunity}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-medium text-sm transition-all cursor-pointer"
            >
              <Users className="w-4 h-4 text-amber-300" />
              <span>식단 후기 커뮤니티</span>
            </button>
          </div>
        </div>

        {/* Right Column: Embedded YouTube Video */}
        <div className="lg:col-span-6 space-y-3">
          <div className="relative group rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-500/30 bg-black">
            {/* 16:9 Aspect Video Container */}
            <div className="relative w-full aspect-video">
              <iframe
                id="hero-youtube-video"
                className="w-full h-full"
                src="https://www.youtube.com/embed/rg9iVB7fiok?rel=0&modestbranding=1"
                title="한주의 영양맞춤 식단과 건강한 식습관 가이드 영상"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Video Label Overlay */}
            <div className="bg-slate-950/90 px-4 py-3 flex items-center justify-between border-t border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="font-semibold text-slate-200">
                  식단 추천 & 건강 꿀팁 특별 영상
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoDetails(!showVideoDetails)}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <span>{showVideoDetails ? '요약 닫기' : '요약 보기'}</span>
                {showVideoDetails ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Collapsible Key Video Highlights */}
          {showVideoDetails && (
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-2 text-slate-300">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>영상 핵심 포인트 & 한주 식단 실천 가이드</span>
              </div>
              <p className="text-[12px] leading-relaxed text-slate-300">
                일주일 식단을 미리 계획하면 불필요한 배달 음식 섭취를 70% 줄이고, 나에게 필요한
                필수 영양소를 고르게 섭취할 수 있습니다. 위 영상과 함께 아래 7일 식단표를
                확인해보세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
