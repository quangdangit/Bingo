import React from 'react';
import { Star, Check } from 'lucide-react';
import { CellState, GameSettings } from '../types';

interface BingoCellProps {
  cell: CellState;
  settings: GameSettings;
  isShaking: boolean;
  onClick: () => void;
  disabled: boolean;
}

export const BingoCell: React.FC<BingoCellProps> = ({
  cell,
  settings,
  isShaking,
  onClick,
  disabled,
}) => {
  const { word, isMarked, isWinningCell } = cell;

  // Visual appearance depending on marked/winning state
  let bgClass = 'bg-white hover:bg-sky-50 text-slate-800 border-2 border-sky-100 hover:border-sky-300 shadow-sm';
  if (isWinningCell) {
    bgClass = 'bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-400 text-amber-950 border-3 border-amber-500 shadow-lg animate-pop animate-pulse-glow';
  } else if (isMarked) {
    bgClass = 'bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-950 border-2 border-emerald-400 shadow-inner';
  }

  const shakeClass = isShaking ? 'animate-gentle-shake ring-2 ring-rose-400 border-rose-300' : '';

  // Adaptive font and padding according to board size
  const sizeStyles = {
    3: {
      padding: 'p-3 sm:p-5',
      emoji: 'text-3xl sm:text-5xl mb-1.5',
      text: 'text-base sm:text-2xl font-black',
      ipa: 'text-xs sm:text-sm',
      vi: 'text-xs sm:text-sm',
    },
    4: {
      padding: 'p-2 sm:p-3.5',
      emoji: 'text-2xl sm:text-4xl mb-1',
      text: 'text-sm sm:text-xl font-black',
      ipa: 'text-[11px] sm:text-xs',
      vi: 'text-[11px] sm:text-xs',
    },
    5: {
      padding: 'p-1.5 sm:p-2.5',
      emoji: 'text-xl sm:text-3xl mb-0.5',
      text: 'text-xs sm:text-base font-black',
      ipa: 'text-[10px] sm:text-[11px]',
      vi: 'text-[10px] sm:text-[11px]',
    },
  }[settings.boardSize];

  return (
    <button
      onClick={onClick}
      disabled={disabled || isMarked}
      aria-label={`Ô số ${cell.index + 1}: ${word.word}. Nghĩa tiếng Việt: ${word.meaningVi}. ${isMarked ? 'Đã đánh dấu đúng' : 'Chưa đánh dấu'}`}
      className={`relative w-full aspect-square rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center text-center transition-all select-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-sky-400/50 active:scale-95 disabled:cursor-default ${bgClass} ${shakeClass} ${sizeStyles.padding}`}
    >
      {/* Marked / Star Badge Indicator */}
      {isMarked && (
        <div
          className={`absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 rounded-full flex items-center justify-center shadow-md animate-pop ${
            isWinningCell
              ? 'w-6 h-6 sm:w-8 sm:h-8 bg-amber-500 text-white'
              : 'w-5 h-5 sm:w-7 sm:h-7 bg-emerald-500 text-white'
          }`}
        >
          {isWinningCell ? (
            <Star className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-white" />
          ) : (
            <Check className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 stroke-[3]" />
          )}
        </div>
      )}

      {/* Emoji / Illustration */}
      {settings.showImageHints && (
        <span className={`select-none transition-transform group-hover:scale-110 ${sizeStyles.emoji}`}>
          {word.emoji}
        </span>
      )}

      {/* English Word (Primary) */}
      <span className={`tracking-tight leading-tight line-clamp-1 ${sizeStyles.text} ${isMarked ? 'text-emerald-950 font-black' : 'text-slate-800'}`}>
        {word.word}
      </span>

      {/* IPA Hint (optional) */}
      {settings.showTextHints && word.ipa && settings.difficulty === 'easy' && (
        <span className={`text-slate-400 font-mono tracking-tight ${sizeStyles.ipa}`}>
          {word.ipa}
        </span>
      )}

      {/* Meaning in Vietnamese */}
      {settings.showMeaningHints && (
        <span className={`text-slate-500 font-medium line-clamp-1 mt-0.5 ${sizeStyles.vi}`}>
          {word.meaningVi}
        </span>
      )}
    </button>
  );
};
