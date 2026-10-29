import React from 'react';
import { Play, BookOpen, HelpCircle, Settings, Sparkles, Volume2, Image, Brain, Award, Users } from 'lucide-react';
import { Topic, GameSettings, GameMode, GameDifficulty, BoardSize } from '../types';
import { Mascot } from './Mascot';
import { soundEffects } from '../utils/audio';

interface HomeScreenProps {
  topics: Topic[];
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onStartGame: () => void;
  onOpenTopics: () => void;
  onOpenHelp: () => void;
  onOpenTeacher: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  topics,
  settings,
  onUpdateSettings,
  onStartGame,
  onOpenTopics,
  onOpenHelp,
  onOpenTeacher,
}) => {
  const currentTopic = topics.find((t) => t.id === settings.topicId) || topics[0];

  const modes: { id: GameMode; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'listen',
      label: 'Listen & Find',
      desc: 'Nghe phát âm chuẩn rồi tìm từ trên bảng',
      icon: <Volume2 className="w-5 h-5" />,
      color: 'border-sky-300 bg-sky-50 text-sky-800',
    },
    {
      id: 'picture',
      label: 'Picture Bingo',
      desc: 'Nhìn hình minh họa đoán từ tiếng Anh',
      icon: <Image className="w-5 h-5" />,
      color: 'border-amber-300 bg-amber-50 text-amber-800',
    },
    {
      id: 'meaning',
      label: 'Meaning Challenge',
      desc: 'Đọc gợi ý nghĩa tiếng Việt tìm từ tương ứng',
      icon: <Brain className="w-5 h-5" />,
      color: 'border-emerald-300 bg-emerald-50 text-emerald-800',
    },
  ];

  const difficulties: { id: GameDifficulty; label: string; desc: string; stars: string }[] = [
    { id: 'easy', label: 'Easy (Dễ)', desc: 'Có hình ảnh + phát âm + gợi ý rõ ràng', stars: '⭐' },
    { id: 'medium', label: 'Medium (Vừa)', desc: 'Nghe phát âm hoặc nghĩa tiếng Việt', stars: '⭐⭐' },
    { id: 'challenge', label: 'Challenge (Thử thách)', desc: 'Tập trung nghe & phản xạ nhanh', stars: '⭐⭐⭐' },
  ];

  const boardSizes: { size: BoardSize; label: string; desc: string }[] = [
    { size: 3, label: '3 × 3 (9 ô)', desc: 'Nhanh & vui (Lớp 1-2)' },
    { size: 4, label: '4 × 4 (16 ô)', desc: 'Chuẩn lớp học (Lớp 2-4)' },
    { size: 5, label: '5 × 5 (25 ô)', desc: 'Thử thách lớn (Lớp 4-5)' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center">
      {/* Hero Welcome Card */}
      <div className="w-full bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-indigo-200/50 relative overflow-hidden text-center mb-8">
        {/* Floating background decorative bubbles */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-300/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute top-4 right-8 text-3xl opacity-40 select-none">✨</div>
        <div className="absolute bottom-6 left-8 text-3xl opacity-40 select-none">🎈</div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 font-extrabold text-xs sm:text-sm tracking-wide uppercase mb-3 border border-white/25">
            <Sparkles className="w-4 h-4" />
            Game Học Tiếng Anh Cho Trẻ Em & Lớp Học
          </div>

          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight drop-shadow-sm mb-3">
            READY, SET, BINGO!
          </h1>

          <p className="text-sky-100 text-base sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-6">
            Cùng khám phá thế giới từ vựng tiếng Anh và trở thành <span className="text-amber-300 font-black">Bingo Champion</span>! 🌟
          </p>

          <Mascot
            mood="happy"
            message="Xin chào các bạn nhỏ và thầy cô! Hôm nay chúng mình cùng chơi Bingo ôn từ vựng nhé!"
            size="md"
            className="mb-6 justify-center"
          />

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full max-w-2xl">
            <button
              onClick={() => {
                soundEffects.click(settings.soundEnabled);
                onStartGame();
              }}
              className="flex-1 min-w-[200px] py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-lg sm:text-xl shadow-lg shadow-amber-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-amber-300 cursor-pointer"
            >
              <Play className="w-6 h-6 fill-amber-950" />
              <span>BẮT ĐẦU CHƠI NGAY</span>
            </button>

            <button
              onClick={() => {
                soundEffects.click(settings.soundEnabled);
                onOpenTopics();
              }}
              className="py-4 px-5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-base backdrop-blur-md border border-white/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-5 h-5" />
              <span>Chọn Chủ Đề ({topics.length})</span>
            </button>
          </div>

          {/* Secondary Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-sm font-semibold">
            <button
              onClick={() => {
                soundEffects.click(settings.soundEnabled);
                onOpenHelp();
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sky-100 flex items-center gap-1.5 transition active:scale-95"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Hướng dẫn cách chơi</span>
            </button>

            <button
              onClick={() => {
                soundEffects.click(settings.soundEnabled);
                onOpenTeacher();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500/80 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition active:scale-95"
            >
              <Settings className="w-4 h-4" />
              <span>Chế độ giáo viên & Lớp học</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Setup Card */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-sky-100 mb-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-sky-100">
          <div>
            <h2 className="font-heading font-black text-xl sm:text-2xl text-sky-950 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              Tùy Chỉnh Trò Chơi Nhanh
            </h2>
            <p className="text-slate-600 text-sm">
              Chọn chủ đề, chế độ và kích thước bàn cờ phù hợp với lứa tuổi của bạn.
            </p>
          </div>

          {/* Active Topic Badge */}
          <button
            onClick={() => {
              soundEffects.click(settings.soundEnabled);
              onOpenTopics();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 transition text-sm font-bold"
          >
            <span className="text-xl">{currentTopic.icon}</span>
            <div className="text-left hidden sm:block">
              <div className="text-xs text-sky-600">Chủ đề hiện tại</div>
              <div>{currentTopic.nameVi} ({currentTopic.nameEn})</div>
            </div>
            <span className="text-xs bg-sky-200 px-2 py-0.5 rounded-full text-sky-800 font-black">
              Đổi
            </span>
          </button>
        </div>

        {/* Section 1: Game Modes */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-sky-900 mb-2.5">
            1. Chọn Chế Độ Chơi (Game Mode):
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {modes.map((m) => {
              const isSelected = settings.mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    soundEffects.click(settings.soundEnabled);
                    onUpdateSettings({ mode: m.id });
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all active:scale-98 ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50 shadow-md ring-2 ring-sky-300'
                      : 'border-slate-200 hover:border-sky-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div
                      className={`p-2 rounded-xl ${
                        isSelected ? 'bg-sky-500 text-white' : 'bg-white text-slate-700 border'
                      }`}
                    >
                      {m.icon}
                    </div>
                    <span className="font-heading font-black text-base text-slate-900">
                      {m.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">{m.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Difficulty & Board Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Difficulty */}
          <div>
            <label className="block text-sm font-bold text-sky-900 mb-2.5">
              2. Độ Khó (Difficulty):
            </label>
            <div className="space-y-2">
              {difficulties.map((d) => {
                const isSelected = settings.difficulty === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      soundEffects.click(settings.soundEnabled);
                      // Adjust hints automatically according to level
                      const updates: Partial<GameSettings> = { difficulty: d.id };
                      if (d.id === 'easy') {
                        updates.showImageHints = true;
                        updates.showMeaningHints = true;
                        updates.showTextHints = true;
                      } else if (d.id === 'medium') {
                        updates.showImageHints = false;
                        updates.showMeaningHints = true;
                        updates.showTextHints = true;
                      } else {
                        updates.showImageHints = false;
                        updates.showMeaningHints = false;
                        updates.showTextHints = false;
                      }
                      onUpdateSettings(updates);
                    }}
                    className={`w-full p-3 rounded-2xl border-2 text-left flex items-center justify-between transition ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50 font-bold text-indigo-950 ring-2 ring-indigo-200'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-black flex items-center gap-1.5">
                        <span>{d.label}</span>
                        <span className="text-xs">{d.stars}</span>
                      </div>
                      <div className="text-xs text-slate-500 font-normal">{d.desc}</div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Board Size */}
          <div>
            <label className="block text-sm font-bold text-sky-900 mb-2.5">
              3. Kích Thước Bảng Bingo:
            </label>
            <div className="space-y-2">
              {boardSizes.map((b) => {
                const isSelected = settings.boardSize === b.size;
                return (
                  <button
                    key={b.size}
                    onClick={() => {
                      soundEffects.click(settings.soundEnabled);
                      onUpdateSettings({ boardSize: b.size });
                    }}
                    className={`w-full p-3 rounded-2xl border-2 text-left flex items-center justify-between transition ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-950 ring-2 ring-emerald-200'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-black">{b.label}</div>
                      <div className="text-xs text-slate-500 font-normal">{b.desc}</div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Classroom Projector Banner */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-indigo-950">Chế độ trình chiếu lớp học (Classroom Presenter)</div>
              <div className="text-xs text-indigo-700">Dành cho giáo viên chiếu bảng gọi từ lên tivi/máy chiếu cho cả lớp chơi theo thẻ cá nhân.</div>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.classroomMode}
              onChange={(e) => {
                soundEffects.click(settings.soundEnabled);
                onUpdateSettings({ classroomMode: e.target.checked });
              }}
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};
