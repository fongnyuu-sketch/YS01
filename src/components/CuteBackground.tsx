import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Palette } from 'lucide-react';

export type CuteTheme = 'mint' | 'peach' | 'pink' | 'butter';

interface CuteBackgroundProps {
  currentTheme?: CuteTheme;
  onChangeTheme?: (theme: CuteTheme) => void;
}

export const CuteBackground: React.FC<CuteBackgroundProps> = ({
  currentTheme: propTheme,
  onChangeTheme,
}) => {
  const [theme, setTheme] = useState<CuteTheme>(() => {
    if (propTheme) return propTheme;
    try {
      const saved = localStorage.getItem('diet_cute_theme');
      return (saved as CuteTheme) || 'mint';
    } catch {
      return 'mint';
    }
  });

  const [showStickers, setShowStickers] = useState(true);
  const [showThemePanel, setShowThemePanel] = useState(false);

  useEffect(() => {
    if (propTheme && propTheme !== theme) {
      setTheme(propTheme);
    }
  }, [propTheme]);

  const handleSelectTheme = (newTheme: CuteTheme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('diet_cute_theme', newTheme);
    } catch {
      // ignore
    }
    if (onChangeTheme) {
      onChangeTheme(newTheme);
    }
  };

  // Theme-specific gradients and accent glows
  const themeStyles = {
    mint: {
      bgBase: 'from-emerald-50/70 via-teal-50/50 to-amber-50/50',
      dotColor: '#a7f3d0',
      glow1: 'bg-emerald-200/40',
      glow2: 'bg-teal-200/30',
      glow3: 'bg-amber-100/40',
      tag: '🌱 싱그러운 새싹 민트',
      accentColor: 'text-emerald-700 bg-emerald-100 border-emerald-300',
    },
    peach: {
      bgBase: 'from-orange-50/80 via-rose-50/60 to-amber-50/60',
      dotColor: '#fed7aa',
      glow1: 'bg-orange-200/40',
      glow2: 'bg-rose-200/35',
      glow3: 'bg-amber-200/30',
      tag: '🍑 달콤 포근 피치',
      accentColor: 'text-orange-700 bg-orange-100 border-orange-300',
    },
    pink: {
      bgBase: 'from-pink-50/80 via-rose-50/60 to-purple-50/50',
      dotColor: '#fbcfe8',
      glow1: 'bg-pink-200/45',
      glow2: 'bg-purple-200/35',
      glow3: 'bg-rose-200/35',
      tag: '🍓 러블리 베리 핑크',
      accentColor: 'text-pink-700 bg-pink-100 border-pink-300',
    },
    butter: {
      bgBase: 'from-amber-50/90 via-yellow-50/60 to-orange-50/50',
      dotColor: '#fde68a',
      glow1: 'bg-amber-200/40',
      glow2: 'bg-yellow-200/35',
      glow3: 'bg-orange-200/30',
      tag: '🧈 부드러운 버터 바닐라',
      accentColor: 'text-amber-700 bg-amber-100 border-amber-300',
    },
  }[theme];

  return (
    <>
      {/* Fixed Ambient Background Layers */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none transition-colors duration-700"
        aria-hidden="true"
      >
        {/* Soft Pastel Gradient Canvas */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${themeStyles.bgBase} transition-all duration-700`}
        />

        {/* Cute Polka-dot Stationary Pattern */}
        <div
          className="absolute inset-0 opacity-45"
          style={{
            backgroundImage: `radial-gradient(${themeStyles.dotColor} 1.6px, transparent 1.6px), radial-gradient(${themeStyles.dotColor} 1.6px, transparent 1.6px)`,
            backgroundSize: '36px 36px',
            backgroundPosition: '0 0, 18px 18px',
          }}
        />

        {/* Soft Floating Pastel Ambient Blobs */}
        <div
          className={`absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl ${themeStyles.glow1} animate-cute-bob`}
          style={{ animationDuration: '8s' }}
        />
        <div
          className={`absolute top-1/3 -right-24 w-80 h-80 rounded-full blur-3xl ${themeStyles.glow2} animate-cute-bob`}
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        />
        <div
          className={`absolute -bottom-20 left-1/4 w-96 h-96 rounded-full blur-3xl ${themeStyles.glow3} animate-cute-bob`}
          style={{ animationDuration: '12s', animationDelay: '4s' }}
        />

        {/* Cute Kawaii Floating Stickers (Fixed in viewport margins) */}
        {showStickers && (
          <div className="absolute inset-0 overflow-hidden">
            {/* 1. Kawaii Avocado - Top Left */}
            <div
              className="absolute top-24 left-3 lg:left-8 w-14 sm:w-16 h-14 sm:h-16 animate-cute-float opacity-85 hover:opacity-100 transition-opacity"
              style={{ animationDuration: '6s' }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* Outer Peel */}
                <ellipse cx="50" cy="54" rx="36" ry="42" fill="#2d6a4f" />
                {/* Flesh */}
                <ellipse cx="50" cy="54" rx="31" ry="37" fill="#b7e4c7" />
                <ellipse cx="50" cy="54" rx="27" ry="32" fill="#d8f3dc" />
                {/* Seed with Smile */}
                <ellipse cx="50" cy="58" rx="16" ry="19" fill="#8d5b4c" />
                <ellipse cx="50" cy="58" rx="13" ry="16" fill="#a06857" />
                {/* Eyes */}
                <circle cx="45" cy="55" r="2.2" fill="#2d1e18" />
                <circle cx="55" cy="55" r="2.2" fill="#2d1e18" />
                <circle cx="46" cy="54" r="0.8" fill="#ffffff" />
                <circle cx="56" cy="54" r="0.8" fill="#ffffff" />
                {/* Cute Cheeks */}
                <circle cx="42" cy="59" r="2.2" fill="#f43f5e" opacity="0.6" />
                <circle cx="58" cy="59" r="2.2" fill="#f43f5e" opacity="0.6" />
                {/* Smile */}
                <path
                  d="M 47 61 Q 50 64 53 61"
                  stroke="#2d1e18"
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* 2. Kawaii Carrot - Top Right */}
            <div
              className="absolute top-28 right-3 lg:right-10 w-13 sm:w-15 h-13 sm:h-15 animate-cute-float opacity-85"
              style={{ animationDuration: '7s', animationDelay: '1s' }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* Leafy greens */}
                <path d="M 48 20 C 35 10 35 2 48 10 C 60 2 60 10 52 20 Z" fill="#52b788" />
                <path d="M 42 20 C 30 14 32 6 42 14" fill="none" stroke="#40916c" strokeWidth="2.5" />
                <path d="M 54 20 C 66 14 64 6 54 14" fill="none" stroke="#40916c" strokeWidth="2.5" />
                {/* Carrot Body */}
                <path
                  d="M 32 28 C 32 22 68 22 68 28 C 65 55 54 85 50 92 C 46 85 35 55 32 28 Z"
                  fill="#fb923c"
                />
                <path
                  d="M 36 30 C 36 25 64 25 64 30 C 61 54 53 82 50 88 C 47 82 39 54 36 30 Z"
                  fill="#f97316"
                  opacity="0.3"
                />
                {/* Cute Face */}
                <circle cx="44" cy="40" r="2.5" fill="#431407" />
                <circle cx="56" cy="40" r="2.5" fill="#431407" />
                <circle cx="45" cy="39" r="0.9" fill="#ffffff" />
                <circle cx="57" cy="39" r="0.9" fill="#ffffff" />
                {/* Pink Cheeks */}
                <circle cx="40" cy="45" r="2.5" fill="#f43f5e" opacity="0.6" />
                <circle cx="60" cy="45" r="2.5" fill="#f43f5e" opacity="0.6" />
                {/* Open Happy Mouth */}
                <path
                  d="M 47 45 Q 50 50 53 45 Z"
                  fill="#991b1b"
                  stroke="#431407"
                  strokeWidth="1.2"
                />
              </svg>
            </div>

            {/* 3. Kawaii Onigiri (Rice Ball) - Middle Left */}
            <div
              className="absolute top-[48%] left-2 lg:left-6 w-14 sm:w-16 h-14 sm:h-16 animate-cute-float opacity-85"
              style={{ animationDuration: '8s', animationDelay: '2.5s' }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* Rice Body */}
                <path
                  d="M 50 18 C 65 18 84 62 78 78 C 73 88 27 88 22 78 C 16 62 35 18 50 18 Z"
                  fill="#ffffff"
                  stroke="#e2e8f0"
                  strokeWidth="2"
                />
                {/* Nori (Seaweed) */}
                <path
                  d="M 40 60 L 60 60 C 62 60 62 86 60 86 L 40 86 C 38 86 38 60 40 60 Z"
                  fill="#1e293b"
                />
                {/* Face */}
                <circle cx="42" cy="44" r="2.5" fill="#1e293b" />
                <circle cx="58" cy="44" r="2.5" fill="#1e293b" />
                <circle cx="43" cy="43" r="0.9" fill="#ffffff" />
                <circle cx="59" cy="43" r="0.9" fill="#ffffff" />
                {/* Blush */}
                <circle cx="37" cy="48" r="2.6" fill="#fb7185" opacity="0.7" />
                <circle cx="63" cy="48" r="2.6" fill="#fb7185" opacity="0.7" />
                {/* Smile */}
                <path
                  d="M 47 48 Q 50 52 53 48"
                  stroke="#1e293b"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* 4. Kawaii Strawberry - Middle Right */}
            <div
              className="absolute top-[52%] right-2 lg:right-6 w-13 sm:w-15 h-13 sm:h-15 animate-cute-float opacity-85"
              style={{ animationDuration: '6.5s', animationDelay: '1.5s' }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* Leaves */}
                <path d="M 50 24 C 40 16 35 24 44 28" fill="#4ade80" />
                <path d="M 50 24 C 60 16 65 24 56 28" fill="#4ade80" />
                <path d="M 50 24 C 50 14 55 14 50 24" fill="#22c55e" />
                {/* Berry Body */}
                <path
                  d="M 32 34 C 32 26 68 26 68 34 C 68 56 56 82 50 86 C 44 82 32 56 32 34 Z"
                  fill="#f43f5e"
                />
                {/* Yellow Seeds */}
                <circle cx="40" cy="38" r="1" fill="#fef08a" />
                <circle cx="60" cy="38" r="1" fill="#fef08a" />
                <circle cx="36" cy="52" r="1" fill="#fef08a" />
                <circle cx="64" cy="52" r="1" fill="#fef08a" />
                <circle cx="50" cy="74" r="1" fill="#fef08a" />
                {/* Face */}
                <circle cx="45" cy="52" r="2.3" fill="#4c0519" />
                <circle cx="55" cy="52" r="2.3" fill="#4c0519" />
                <circle cx="46" cy="51" r="0.8" fill="#ffffff" />
                <circle cx="56" cy="51" r="0.8" fill="#ffffff" />
                {/* Cheeks */}
                <circle cx="41" cy="56" r="2.2" fill="#fda4af" />
                <circle cx="59" cy="56" r="2.2" fill="#fda4af" />
                {/* Smile */}
                <path
                  d="M 48 57 Q 50 60 52 57"
                  stroke="#4c0519"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* 5. Kawaii Sunny Egg - Bottom Left */}
            <div
              className="absolute bottom-28 left-4 lg:left-12 w-14 sm:w-16 h-14 sm:h-16 animate-cute-float opacity-85"
              style={{ animationDuration: '9s', animationDelay: '3s' }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* Egg White */}
                <path
                  d="M 50 20 C 75 18 88 35 85 58 C 82 78 68 85 50 85 C 30 85 15 75 16 54 C 17 32 30 22 50 20 Z"
                  fill="#ffffff"
                  stroke="#f1f5f9"
                  strokeWidth="2"
                />
                {/* Blushing Yolk */}
                <circle cx="50" cy="53" r="21" fill="#f59e0b" />
                <circle cx="48" cy="51" r="18" fill="#fbbf24" />
                {/* Face on Yolk */}
                <circle cx="43" cy="49" r="2.2" fill="#78350f" />
                <circle cx="55" cy="49" r="2.2" fill="#78350f" />
                <circle cx="44" cy="48" r="0.8" fill="#ffffff" />
                <circle cx="56" cy="48" r="0.8" fill="#ffffff" />
                {/* Cheeks */}
                <circle cx="39" cy="54" r="2.4" fill="#f43f5e" opacity="0.7" />
                <circle cx="59" cy="54" r="2.4" fill="#f43f5e" opacity="0.7" />
                {/* Smile */}
                <path
                  d="M 47 54 Q 49 57 51 54"
                  stroke="#78350f"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* 6. Kawaii Broccoli - Bottom Right */}
            <div
              className="absolute bottom-24 right-4 lg:right-12 w-14 sm:w-16 h-14 sm:h-16 animate-cute-float opacity-85"
              style={{ animationDuration: '7.5s', animationDelay: '2s' }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* Stem */}
                <rect x="42" y="55" width="16" height="30" rx="6" fill="#86efac" />
                {/* Fluffy Head */}
                <circle cx="34" cy="45" r="18" fill="#16a34a" />
                <circle cx="66" cy="45" r="18" fill="#16a34a" />
                <circle cx="50" cy="32" r="20" fill="#22c55e" />
                <circle cx="50" cy="46" r="16" fill="#22c55e" />
                {/* Face on Stem */}
                <circle cx="46" cy="67" r="1.8" fill="#14532d" />
                <circle cx="54" cy="67" r="1.8" fill="#14532d" />
                <circle cx="43" cy="70" r="1.8" fill="#f43f5e" opacity="0.6" />
                <circle cx="57" cy="70" r="1.8" fill="#f43f5e" opacity="0.6" />
                <path
                  d="M 48 70 Q 50 72 52 70"
                  stroke="#14532d"
                  strokeWidth="1.2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Twinkling Pastel Stars & Hearts */}
            <div className="absolute top-16 left-1/4 animate-cute-pulse text-amber-300 opacity-60 text-lg">
              ✨
            </div>
            <div className="absolute top-40 right-1/4 animate-cute-pulse text-rose-300 opacity-60 text-lg">
              💖
            </div>
            <div className="absolute bottom-48 left-1/3 animate-cute-pulse text-emerald-300 opacity-60 text-lg">
              🌿
            </div>
            <div className="absolute bottom-36 right-1/3 animate-cute-pulse text-yellow-300 opacity-60 text-lg">
              ⭐
            </div>
          </div>
        )}
      </div>

      {/* Cute Floating Theme Switcher Badge (Bottom-Left) */}
      <div className="fixed bottom-5 left-5 z-40 no-print flex flex-col items-start gap-2">
        {showThemePanel && (
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-3 rounded-2xl shadow-xl w-60 space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-rose-500" />
                <span>귀여운 배경 테마 선택</span>
              </span>
              <button
                type="button"
                onClick={() => setShowThemePanel(false)}
                className="text-[11px] text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                닫기
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'mint', label: '새싹 민트', icon: '🌱', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
                { id: 'peach', label: '포근 피치', icon: '🍑', color: 'bg-orange-100 text-orange-800 border-orange-300' },
                { id: 'pink', label: '베리 핑크', icon: '🍓', color: 'bg-pink-100 text-pink-800 border-pink-300' },
                { id: 'butter', label: '버터 바닐라', icon: '🧈', color: 'bg-amber-100 text-amber-800 border-amber-300' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTheme(item.id as CuteTheme)}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    theme === item.id
                      ? `${item.color} shadow-xs ring-2 ring-slate-800/10 scale-[1.02]`
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600 text-[11px]">귀여운 스티커 표시</span>
              <button
                type="button"
                onClick={() => setShowStickers(!showStickers)}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  showStickers
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {showStickers ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          id="toggle-cute-theme-btn"
          onClick={() => setShowThemePanel(!showThemePanel)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md shadow-md border text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer ${themeStyles.accentColor}`}
          title="귀여운 배경 테마 바꾸기"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{themeStyles.tag}</span>
        </button>
      </div>
    </>
  );
};
