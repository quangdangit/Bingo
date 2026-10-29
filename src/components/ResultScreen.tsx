import React, { useEffect } from 'react';
import { Trophy, RotateCcw, BookOpen, Sliders, Home, Star, Award, CheckCircle, Clock } from 'lucide-react';
import { GameState, Badge, Topic } from '../types';
import { soundEffects } from '../utils/audio';
import confetti from 'canvas-confetti';

interface ResultScreenProps {
  gameState: GameState;
  badges: Badge[];
  topic: Topic;
  onPlayAgain: () => void;
  onChangeTopic: () => void;
  onChangeDifficulty: () => void;
  onGoHome: () => void;
  soundEnabled: boolean;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  gameState,
  badges,
  topic,
  onPlayAgain,
  onChangeTopic,
  onChangeDifficulty,
  onGoHome,
  soundEnabled,
}) => {
  const { score, correctAnswers, calledWords, startTime, elapsedSeconds } = gameState;
  const totalCalled = calledWords.length;
  const accuracy = totalCalled > 0 ? Math.round((correctAnswers / totalCalled) * 100) : 100;

  useEffect(() => {
    soundEffects.bingo(soundEnabled);
    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
      });
    } catch {
      // Confetti fallback
    }
  }, [soundEnabled]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Celebration Header Card */}
      <div className="w-full bg-gradient-to-br from-amber-400 via-rose-400 to-indigo-600 rounded-3xl p-6 sm:p-10 text-white text-center shadow-xl shadow-indigo-200/50 relative overflow-hidden mb-8">
        <div className="text-6xl sm:text-7xl mb-2 animate-bounce">👑</div>

        <h1 className="font-heading font-black text-3xl sm:text-5xl tracking-tight drop-shadow-md mb-2">
          YOU DID IT!
        </h1>
        <p className="text-xl sm:text-2xl font-bold text-amber-200 mb-2">
          BINGO! AMAZING JOB!
        </p>
        <p className="text-sm sm:text-base text-sky-100 max-w-lg mx-auto">
          Xuất sắc! Bạn đã chinh phục thử thách từ vựng chủ đề{' '}
          <strong className="text-white underline">{topic.nameVi}</strong>!
        </p>
      </div>

      {/* Stats Summary Grid */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="bg-white p-4 rounded-3xl border-2 border-amber-200 shadow-sm text-center">
          <div className="text-xs font-bold text-slate-500 mb-1">Điểm Số Cuối Cùng</div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-amber-600">
            {score}
          </div>
          <div className="text-[11px] text-amber-700 font-bold">Điểm thưởng</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border-2 border-emerald-200 shadow-sm text-center">
          <div className="text-xs font-bold text-slate-500 mb-1">Đáp Án Đúng</div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-emerald-600">
            {correctAnswers}
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">/ {totalCalled} lượt gọi</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border-2 border-sky-200 shadow-sm text-center">
          <div className="text-xs font-bold text-slate-500 mb-1">Độ Chính Xác</div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-sky-600">
            {accuracy}%
          </div>
          <div className="text-[11px] text-sky-700 font-bold">Rất xuất sắc!</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border-2 border-purple-200 shadow-sm text-center">
          <div className="text-xs font-bold text-slate-500 mb-1">Thời Gian Chơi</div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-purple-600">
            {formatTime(elapsedSeconds)}
          </div>
          <div className="text-[11px] text-purple-700 font-bold">Phút : Giây</div>
        </div>
      </div>

      {/* Badges Earned Section */}
      <div className="w-full bg-white rounded-3xl p-6 border-2 border-sky-100 shadow-sm mb-8">
        <h2 className="font-heading font-black text-lg sm:text-xl text-sky-950 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Huy Hiệu & Thành Tích Đạt Được
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition ${
                b.unlocked
                  ? 'bg-amber-50/70 border-amber-300 text-amber-950 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                  b.unlocked ? 'bg-amber-400 text-white shadow-sm' : 'bg-slate-200 text-slate-400'
                }`}
              >
                <span>{b.icon}</span>
              </div>
              <div>
                <div className="font-heading font-black text-sm">{b.titleVi}</div>
                <div className="text-xs font-bold text-slate-500">{b.title}</div>
                <div className="text-[11px] text-slate-600 leading-tight mt-0.5">
                  {b.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="w-full flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <button
          onClick={() => {
            soundEffects.click(soundEnabled);
            onPlayAgain();
          }}
          className="flex-1 min-w-[200px] py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-base sm:text-lg shadow-lg shadow-amber-400/40 transition active:scale-95 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>CHƠI LẠI VÁN MỚI</span>
        </button>

        <button
          onClick={() => {
            soundEffects.click(soundEnabled);
            onChangeTopic();
          }}
          className="py-4 px-5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm sm:text-base shadow-sm transition active:scale-95 flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>Đổi Chủ Đề</span>
        </button>

        <button
          onClick={() => {
            soundEffects.click(soundEnabled);
            onChangeDifficulty();
          }}
          className="py-4 px-5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold text-sm sm:text-base transition active:scale-95 flex items-center justify-center gap-2"
        >
          <Sliders className="w-4 h-4" />
          <span>Đổi Cấp Độ</span>
        </button>

        <button
          onClick={() => {
            soundEffects.click(soundEnabled);
            onGoHome();
          }}
          className="p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition active:scale-95 flex items-center justify-center"
          title="Trang chủ"
          aria-label="Về trang chủ"
        >
          <Home className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
