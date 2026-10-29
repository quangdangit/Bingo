import React from 'react';

export type MascotMood = 'happy' | 'cheer' | 'thinking' | 'encourage' | 'bingo';

interface MascotProps {
  mood?: MascotMood;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = 'happy',
  message,
  size = 'md',
  className = '',
}) => {
  const getEmoji = () => {
    switch (mood) {
      case 'cheer':
        return '🥳';
      case 'bingo':
        return '👑';
      case 'thinking':
        return '🤔';
      case 'encourage':
        return '💪';
      case 'happy':
      default:
        return '🦉';
    }
  };

  const getBadgeText = () => {
    switch (mood) {
      case 'cheer':
        return 'Xuất sắc!';
      case 'bingo':
        return 'BINGO CHAMPION!';
      case 'thinking':
        return 'Đang lắng nghe...';
      case 'encourage':
        return 'Cố lên nào!';
      case 'happy':
      default:
        return 'Cú Bibo';
    }
  };

  const sizeClasses = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Mascot Avatar */}
      <div className="relative group select-none">
        <div
          className={`${sizeClasses[size]} rounded-3xl bg-gradient-to-tr from-amber-300 via-rose-300 to-sky-300 p-1 shadow-lg shadow-sky-200/50 flex items-center justify-center transform transition group-hover:scale-105 animate-float`}
        >
          <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
            <span role="img" aria-label="Mascot Bibo">
              {getEmoji()}
            </span>
          </div>
        </div>
        {/* Little name tag */}
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full bg-sky-600 text-white text-[10px] font-black tracking-wide shadow-sm">
          {getBadgeText()}
        </span>
      </div>

      {/* Speech bubble */}
      {message && (
        <div className="relative bg-white border-2 border-sky-200 rounded-2xl px-4 py-2.5 shadow-sm max-w-xs sm:max-w-md text-sm text-sky-950 font-medium">
          {/* Bubble tail */}
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white"></div>
          <p className="leading-snug">{message}</p>
        </div>
      )}
    </div>
  );
};
