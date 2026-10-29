import React from 'react';
import { Volume2, VolumeX, HelpCircle, Settings, Home, Sparkles, Flame, Presentation } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface HeaderProps {
  score: number;
  streak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHelp: () => void;
  onOpenTeacher: () => void;
  onGoHome: () => void;
  currentScreen: string;
  topicName?: string;
  isClassroomMode?: boolean;
  onToggleClassroomMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  streak,
  soundEnabled,
  onToggleSound,
  onOpenHelp,
  onOpenTeacher,
  onGoHome,
  currentScreen,
  topicName,
  isClassroomMode = false,
  onToggleClassroomMode,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b-2 border-sky-100 shadow-sm px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Back to Home */}
        <div className="flex items-center gap-2">
          {currentScreen !== 'home' && (
            <button
              onClick={() => {
                soundEffects.click(soundEnabled);
                onGoHome();
              }}
              className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 transition active:scale-95 border border-sky-200"
              title="Về trang chủ"
              aria-label="Về trang chủ"
            >
              <Home className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={() => {
              if (currentScreen !== 'home') {
                soundEffects.click(soundEnabled);
                onGoHome();
              }
            }}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-400 to-sky-400 p-0.5 shadow-md shadow-sky-200/50 group-hover:rotate-6 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-lg sm:text-xl">
                🦉
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-sky-600 via-indigo-600 to-rose-500 bg-clip-text text-transparent">
                  BINGO ADVENTURE
                </span>
                <span className="hidden md:inline-block text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Tiếng Anh Tiểu Học
                </span>
              </div>
              {topicName && currentScreen === 'game' && (
                <p className="text-xs text-sky-700 font-semibold truncate max-w-[140px] sm:max-w-xs">
                  Chủ đề: <span className="text-amber-600 font-bold">{topicName}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* HUD Center: Live Score & Streak */}
        {currentScreen === 'game' && (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Score Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-black shadow-sm text-sm sm:text-base border border-amber-300">
              <Sparkles className="w-4 h-4 text-white fill-white" />
              <span>{score}</span>
              <span className="text-xs font-bold text-amber-900 hidden sm:inline">điểm</span>
            </div>

            {/* Streak Indicator */}
            {streak > 1 && (
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-black text-xs sm:text-sm shadow-sm animate-pulse">
                <Flame className="w-4 h-4 fill-white" />
                <span>{streak}x</span>
                {streak >= 3 && (
                  <span className="text-[10px] hidden sm:inline font-bold bg-white/25 px-1 rounded">
                    +5 điểm!
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions Right: Classroom, Sound, Help, Teacher Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onToggleClassroomMode && (
            <button
              onClick={() => {
                soundEffects.click(soundEnabled);
                onToggleClassroomMode();
              }}
              className={`p-2 rounded-xl transition active:scale-95 border flex items-center gap-1 text-xs font-bold ${
                isClassroomMode
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-md shadow-indigo-200'
                  : 'bg-white text-indigo-700 hover:bg-indigo-50 border-indigo-200'
              }`}
              title="Chế độ máy chiếu lớp học"
              aria-label="Chế độ máy chiếu lớp học"
            >
              <Presentation className="w-4 h-4" />
              <span className="hidden lg:inline">Máy chiếu</span>
            </button>
          )}

          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl transition active:scale-95 border ${
              soundEnabled
                ? 'bg-sky-50 text-sky-700 hover:bg-sky-100 border-sky-200'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          <button
            onClick={() => {
              soundEffects.click(soundEnabled);
              onOpenHelp();
            }}
            className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition active:scale-95"
            title="Hướng dẫn chơi"
            aria-label="Hướng dẫn chơi"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={() => {
              soundEffects.click(soundEnabled);
              onOpenTeacher();
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-sm transition active:scale-95 flex items-center gap-1.5"
            title="Chế độ giáo viên & Cài đặt"
            aria-label="Chế độ giáo viên & Cài đặt"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden md:inline">Giáo viên</span>
          </button>
        </div>
      </div>
    </header>
  );
};
