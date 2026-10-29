import React from 'react';
import { Volume2, RotateCcw, Clock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { WordItem, GameSettings, GameMode } from '../types';
import { soundEffects } from '../utils/audio';

interface CalledWordPanelProps {
  currentWord: WordItem | null;
  settings: GameSettings;
  calledHistory: WordItem[];
  remainingCount: number;
  timerSecondsLeft: number;
  onReplayAudio: () => void;
  onNextWord: () => void;
  soundEnabled: boolean;
  isPaused: boolean;
}

export const CalledWordPanel: React.FC<CalledWordPanelProps> = ({
  currentWord,
  settings,
  calledHistory,
  remainingCount,
  timerSecondsLeft,
  onReplayAudio,
  onNextWord,
  soundEnabled,
  isPaused,
}) => {
  const [showHint, setShowHint] = React.useState(false);

  if (!currentWord) {
    return (
      <div className="bg-white rounded-3xl p-6 border-2 border-sky-100 shadow-md text-center">
        <p className="text-slate-500 font-bold">Chưa có từ nào được gọi.</p>
      </div>
    );
  }

  const { mode } = settings;

  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-6 border-2 border-sky-100 shadow-md flex flex-col justify-between">
      {/* Top Banner: Mode Indicator & Timer */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-sky-50 text-xs sm:text-sm">
        <span className="font-extrabold px-3 py-1 rounded-full bg-sky-100 text-sky-800 tracking-wide uppercase">
          {mode === 'listen' && '🎧 Chế độ: Nghe & Tìm'}
          {mode === 'picture' && '🖼️ Chế độ: Nhìn Hình & Đoán'}
          {mode === 'meaning' && '💡 Chế độ: Nghĩa Tiếng Việt'}
        </span>

        {settings.hasTimer && (
          <div
            className={`flex items-center gap-1.5 font-black px-2.5 py-1 rounded-xl border ${
              timerSecondsLeft <= 3
                ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{timerSecondsLeft}s</span>
          </div>
        )}
      </div>

      {/* Main Calling Display */}
      <div className="flex flex-col items-center justify-center my-2 text-center">
        {/* Mode 1: Listen and Find */}
        {mode === 'listen' && (
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                soundEffects.click(soundEnabled);
                onReplayAudio();
              }}
              className="group relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 hover:from-sky-500 hover:to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-sky-300/50 transform active:scale-95 transition-all mb-3 cursor-pointer"
              title="Nhấn để nghe lại phát âm"
              aria-label="Nhấn để nghe lại phát âm"
            >
              <Volume2 className="w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-110 transition-transform" />
              <span className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-wider shadow">
                Nghe lại
              </span>
            </button>

            <h3 className="font-heading font-black text-xl sm:text-2xl text-slate-900 mb-1">
              Nghe từ và tìm trên bảng!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-3">
              Nhấn loa để nghe lại phát âm tiếng Anh chuẩn bản xứ.
            </p>

            {/* Optional peek hint for beginners */}
            {settings.difficulty !== 'challenge' && (
              <div className="mt-1">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-sky-600 hover:text-sky-800 font-bold flex items-center gap-1 px-3 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 transition"
                >
                  {showHint ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showHint ? 'Ẩn gợi ý' : 'Xem gợi ý'}</span>
                </button>
                {showHint && (
                  <div className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 animate-pop">
                    {currentWord.emoji} {currentWord.meaningVi} ({currentWord.ipa})
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mode 2: Picture Bingo */}
        {mode === 'picture' && (
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-amber-50 border-3 border-amber-200 flex items-center justify-center text-5xl sm:text-6xl shadow-inner mb-3">
              <span>{currentWord.emoji}</span>
            </div>

            <h3 className="font-heading font-black text-xl sm:text-2xl text-slate-900 mb-1">
              Nhìn hình đoán từ tiếng Anh!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-3">
              Nghĩa: <strong className="text-amber-700">{currentWord.meaningVi}</strong>
            </p>

            <button
              onClick={() => {
                soundEffects.click(soundEnabled);
                onReplayAudio();
              }}
              className="text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              <span>Nghe phát âm</span>
            </button>
          </div>
        )}

        {/* Mode 3: Meaning Challenge */}
        {mode === 'meaning' && (
          <div className="flex flex-col items-center">
            <div className="px-5 py-3 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-950 font-black text-xl sm:text-2xl mb-3 shadow-sm">
              "{currentWord.meaningVi}"
            </div>

            <h3 className="font-heading font-black text-xl text-slate-900 mb-1">
              Từ tiếng Anh của nghĩa này là gì?
            </h3>

            {currentWord.example && (
              <p className="text-xs text-slate-600 italic bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 max-w-sm mb-3">
                💡 Ví dụ: "{currentWord.example}"
              </p>
            )}

            <button
              onClick={() => {
                soundEffects.click(soundEnabled);
                onReplayAudio();
              }}
              className="text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              <span>Nghe phát âm tiếng Anh</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Controls: Next/Skip word & Call History */}
      <div className="pt-4 border-t border-sky-50">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="text-xs font-bold text-slate-500">
            Còn lại trong túi từ: <strong className="text-sky-700">{remainingCount} từ</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.click(soundEnabled);
                onReplayAudio();
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Phát lại âm thanh"
              aria-label="Phát lại âm thanh"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundEffects.click(soundEnabled);
                onNextWord();
              }}
              disabled={isPaused}
              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm active:scale-95 disabled:opacity-50"
            >
              <span>Gọi từ tiếp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recent Words Strip */}
        {calledHistory.length > 0 && (
          <div>
            <div className="text-[11px] font-bold text-slate-400 mb-1.5">Các từ đã gọi gần đây:</div>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
              {calledHistory.slice(-5).reverse().map((w, idx) => (
                <span
                  key={`${w.id}-${idx}`}
                  className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1"
                >
                  <span>{w.emoji}</span>
                  <span>{w.word}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
