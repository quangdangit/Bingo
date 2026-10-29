import React, { useState } from 'react';
import { Volume2, ArrowRight, Play, Pause, Trophy, Sparkles, CheckCircle2, RotateCcw, X, Presentation } from 'lucide-react';
import { WordItem, GameSettings } from '../types';
import { soundEffects, SpeechService } from '../utils/audio';
import confetti from 'canvas-confetti';

interface ClassroomPresenterProps {
  currentWord: WordItem | null;
  calledHistory: WordItem[];
  remainingWords: WordItem[];
  settings: GameSettings;
  onNextWord: () => void;
  onClose: () => void;
  soundEnabled: boolean;
}

export const ClassroomPresenter: React.FC<ClassroomPresenterProps> = ({
  currentWord,
  calledHistory,
  remainingWords,
  settings,
  onNextWord,
  onClose,
  soundEnabled,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winnerName, setWinnerName] = useState('');

  const handleSpeak = (text: string) => {
    SpeechService.speak(text, {
      rate: settings.speechRate,
      enabled: settings.soundEnabled,
    });
  };

  const handleDeclareWinner = () => {
    soundEffects.bingo(soundEnabled);
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      // Confetti fallback
    }
    setShowWinnerModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col p-4 sm:p-8 text-white overflow-y-auto">
      {/* Top Bar for Presenter Mode */}
      <div className="flex items-center justify-between pb-4 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg">
            <Presentation className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-black text-xl sm:text-2xl text-amber-300">
              CHẾ ĐỘ TRÌNH CHIẾU LỚP HỌC (CLASSROOM BINGO)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Chiếu lên máy chiếu/TV cho cả lớp theo dõi. Học sinh dùng phiếu Bingo trên giấy hoặc thiết bị cá nhân.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition"
          title="Đóng chế độ máy chiếu"
          aria-label="Đóng chế độ máy chiếu"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Classroom Projection Display */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 my-6 max-w-7xl mx-auto w-full">
        {/* Giant Active Word Card */}
        <div className="flex-1 w-full max-w-2xl bg-white/10 border-2 border-white/20 rounded-3xl p-6 sm:p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-4 left-6 text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-amber-200">
            Từ số: {calledHistory.length} / {calledHistory.length + remainingWords.length}
          </div>

          {currentWord ? (
            <>
              {/* Giant Emoji Illustration */}
              <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-3xl bg-white/20 border-4 border-white/30 flex items-center justify-center text-7xl sm:text-9xl mb-6 shadow-inner animate-float">
                <span>{currentWord.emoji}</span>
              </div>

              {/* Huge English Word */}
              <h2 className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight mb-2 drop-shadow-md">
                {currentWord.word}
              </h2>

              {/* IPA pronunciation */}
              {currentWord.ipa && (
                <div className="text-xl sm:text-2xl font-mono text-sky-300 font-semibold mb-3">
                  {currentWord.ipa}
                </div>
              )}

              {/* Vietnamese Meaning */}
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 mb-4 bg-black/20 px-6 py-2 rounded-2xl border border-white/10">
                "{currentWord.meaningVi}"
              </div>

              {/* Example sentence */}
              {currentWord.example && (
                <p className="text-base sm:text-lg text-slate-300 italic mb-6 max-w-md">
                  💡 {currentWord.example}
                </p>
              )}

              {/* Big Teacher Control Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 w-full">
                <button
                  onClick={() => handleSpeak(currentWord.word)}
                  className="px-6 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-black text-lg flex items-center gap-2 shadow-lg transition active:scale-95"
                >
                  <Volume2 className="w-6 h-6" />
                  <span>Phát âm lại 🔊</span>
                </button>

                <button
                  onClick={() => {
                    soundEffects.click(soundEnabled);
                    onNextWord();
                  }}
                  disabled={isPaused || remainingWords.length === 0}
                  className="px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-lg flex items-center gap-2 shadow-lg transition active:scale-95 disabled:opacity-50"
                >
                  <span>GỌI TỪ TIẾP THEO 📢</span>
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            <div className="py-12">
              <p className="text-xl text-slate-300 mb-6">Chưa có từ nào được gọi.</p>
              <button
                onClick={onNextWord}
                className="px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xl shadow-lg"
              >
                BẮT ĐẦU GỌI TỪ ĐẦU TIÊN
              </button>
            </div>
          )}
        </div>

        {/* Sidebar: Teacher Controls & Word History Table */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
          {/* Quick Classroom Status */}
          <div className="bg-white/10 rounded-3xl p-5 border border-white/20">
            <h3 className="font-heading font-black text-base text-amber-300 mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Điều Khiển Lớp Học
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition ${
                  isPaused
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {isPaused ? <Play className="w-5 h-5 fill-white" /> : <Pause className="w-5 h-5" />}
                <span>{isPaused ? 'Tiếp tục gọi từ' : 'Tạm dừng trò chơi'}</span>
              </button>

              <button
                onClick={handleDeclareWinner}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-300 hover:to-rose-300 text-amber-950 font-black flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
              >
                <Sparkles className="w-5 h-5 fill-amber-950" />
                <span>XÁC NHẬN HỌC SINH BINGO! 🎉</span>
              </button>
            </div>
          </div>

          {/* List of Called Words */}
          <div className="bg-white/10 rounded-3xl p-5 border border-white/20 flex-1 flex flex-col max-h-[380px]">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm text-sky-200">
                Danh sách từ đã gọi ({calledHistory.length})
              </span>
              <span className="text-xs text-slate-400">Còn lại: {remainingWords.length}</span>
            </div>

            <div className="overflow-y-auto pr-1 space-y-2 flex-1">
              {calledHistory.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Chưa có từ nào trong danh sách.</p>
              ) : (
                [...calledHistory].reverse().map((w, index) => (
                  <div
                    key={`${w.id}-${index}`}
                    onClick={() => handleSpeak(w.word)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 cursor-pointer text-xs transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{w.emoji}</span>
                      <div>
                        <div className="font-bold text-white">{w.word}</div>
                        <div className="text-[11px] text-amber-200">{w.meaningVi}</div>
                      </div>
                    </div>
                    <Volume2 className="w-4 h-4 text-sky-300 hover:text-white" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Winner Celebration Modal */}
      {showWinnerModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-amber-400 via-rose-400 to-indigo-600 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border-4 border-amber-300 animate-pop text-slate-900">
            <div className="text-6xl mb-3">👑</div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white drop-shadow-md mb-2">
              BINGO CHAMPION!
            </h2>
            <p className="text-white text-base font-bold mb-4">
              Chúc mừng bạn học sinh xuất sắc đã hô BINGO thành công!
            </p>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Nhập tên học sinh chiến thắng..."
                value={winnerName}
                onChange={(e) => setWinnerName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white text-slate-900 font-bold border-2 border-amber-300 text-center text-lg focus:outline-none focus:ring-4 focus:ring-amber-200"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWinnerModal(false)}
                className="flex-1 py-3 rounded-2xl bg-white text-slate-800 font-black hover:bg-slate-100 transition"
              >
                Tiếp tục ván chơi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
