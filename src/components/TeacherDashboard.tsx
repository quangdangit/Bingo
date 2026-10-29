import React from 'react';
import { X, Settings, Volume2, Clock, Eye, Trophy, BookOpen, RotateCcw, Presentation } from 'lucide-react';
import { GameSettings, BoardSize, GameDifficulty, WinConditionType } from '../types';
import { soundEffects } from '../utils/audio';

interface TeacherDashboardProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onOpenVocabManager: () => void;
  onClose: () => void;
  onResetGame: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  settings,
  onUpdateSettings,
  onOpenVocabManager,
  onClose,
  onResetGame,
}) => {
  const winConditionOptions: { id: WinConditionType; label: string; desc: string }[] = [
    { id: 'horizontal', label: 'Hàng Ngang (Horizontal)', desc: 'Hoàn thành 1 hàng bất kỳ' },
    { id: 'vertical', label: 'Cột Dọc (Vertical)', desc: 'Hoàn thành 1 cột bất kỳ' },
    { id: 'diagonal', label: 'Đường Chéo (Diagonal)', desc: 'Hoàn thành 1 đường chéo' },
    { id: 'corners', label: 'Bốn Góc (Four Corners)', desc: 'Đánh dấu đủ 4 ô ở 4 góc' },
    { id: 'fullhouse', label: 'Toàn Bảng (Full House)', desc: 'Đánh dấu tất cả các ô trên bảng' },
  ];

  const toggleWinCondition = (condition: WinConditionType) => {
    soundEffects.click(settings.soundEnabled);
    let updated = [...settings.winConditions];
    if (updated.includes(condition)) {
      if (updated.length > 1) {
        updated = updated.filter((c) => c !== condition);
      }
    } else {
      updated.push(condition);
    }
    onUpdateSettings({ winConditions: updated });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border-4 border-sky-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading font-black text-xl sm:text-2xl">
                BẢNG ĐIỀU KHIỂN GIÁO VIÊN
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm font-medium">
                Cấu hình luật chơi, luật thắng, âm thanh và từ vựng phù hợp cho tiết học
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition active:scale-95"
            aria-label="Đóng bảng điều khiển"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Section: Win Conditions */}
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-2.5 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              1. Điều kiện chiến thắng BINGO (Có thể chọn nhiều)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {winConditionOptions.map((opt) => {
                const isActive = settings.winConditions.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleWinCondition(opt.id)}
                    className={`p-3 rounded-2xl border-2 text-left flex items-start justify-between transition ${
                      isActive
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-black">{opt.label}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{opt.desc}</div>
                    </div>
                    <div
                      className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center ${
                        isActive ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {isActive && <span className="text-[10px] font-black">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Board Size & Hints */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Board Size */}
            <div>
              <h3 className="text-sm font-black text-slate-900 mb-2">2. Kích thước bảng Bingo</h3>
              <div className="flex gap-2">
                {[3, 4, 5].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      soundEffects.click(settings.soundEnabled);
                      onUpdateSettings({ boardSize: size as BoardSize });
                    }}
                    className={`flex-1 py-2.5 rounded-xl border-2 font-black text-xs sm:text-sm transition ${
                      settings.boardSize === size
                        ? 'border-sky-500 bg-sky-50 text-sky-900 ring-2 ring-sky-200'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {size} × {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Turn Timer */}
            <div>
              <h3 className="text-sm font-black text-slate-900 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-600" />
                3. Đồng hồ đếm ngược mỗi lượt
              </h3>
              <div className="flex gap-1.5">
                {[
                  { label: 'Tắt', sec: 0 },
                  { label: '10s', sec: 10 },
                  { label: '15s', sec: 15 },
                  { label: '20s', sec: 20 },
                  { label: '30s', sec: 30 },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      soundEffects.click(settings.soundEnabled);
                      onUpdateSettings({
                        hasTimer: item.sec > 0,
                        timerSeconds: item.sec || 15,
                      });
                    }}
                    className={`flex-1 py-2 rounded-xl border-2 font-bold text-xs transition ${
                      (!settings.hasTimer && item.sec === 0) ||
                      (settings.hasTimer && settings.timerSeconds === item.sec)
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Hint Display Controls */}
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-2 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-500" />
              4. Cấu hình hiển thị gợi ý trên các ô
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label className="p-3 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-slate-800">Gợi ý hình ảnh (Emoji)</span>
                <input
                  type="checkbox"
                  checked={settings.showImageHints}
                  onChange={(e) => {
                    soundEffects.click(settings.soundEnabled);
                    onUpdateSettings({ showImageHints: e.target.checked });
                  }}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-400"
                />
              </label>

              <label className="p-3 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-slate-800">Nghĩa tiếng Việt</span>
                <input
                  type="checkbox"
                  checked={settings.showMeaningHints}
                  onChange={(e) => {
                    soundEffects.click(settings.soundEnabled);
                    onUpdateSettings({ showMeaningHints: e.target.checked });
                  }}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-400"
                />
              </label>

              <label className="p-3 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-slate-800">Phiên âm IPA</span>
                <input
                  type="checkbox"
                  checked={settings.showTextHints}
                  onChange={(e) => {
                    soundEffects.click(settings.soundEnabled);
                    onUpdateSettings({ showTextHints: e.target.checked });
                  }}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-400"
                />
              </label>
            </div>
          </div>

          {/* Section: Pronunciation & Audio */}
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-2 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-sky-600" />
              5. Giọng đọc tiếng Anh (Speech Synthesis)
            </h3>
            <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Tự động phát âm khi từ mới xuất hiện
                </span>
                <input
                  type="checkbox"
                  checked={settings.autoSpeak}
                  onChange={(e) => {
                    soundEffects.click(settings.soundEnabled);
                    onUpdateSettings({ autoSpeak: e.target.checked });
                  }}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Tốc độ đọc tiếng Anh: {Math.round(settings.speechRate * 100)}%</span>
                  <span className="text-slate-500 font-normal">
                    {settings.speechRate < 0.85 ? 'Chậm (Dành cho Lớp 1-2)' : 'Chuẩn'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.2"
                  step="0.05"
                  value={settings.speechRate}
                  onChange={(e) =>
                    onUpdateSettings({ speechRate: parseFloat(e.target.value) })
                  }
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section: Shortcuts to Vocab Manager & Reset */}
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => {
                soundEffects.click(settings.soundEnabled);
                onOpenVocabManager();
              }}
              className="flex-1 min-w-[200px] py-3 px-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-black text-xs sm:text-sm border border-indigo-200 flex items-center justify-center gap-2 transition"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Quản Lý & Chỉnh Sửa Bộ Từ Vựng</span>
            </button>

            <button
              onClick={() => {
                soundEffects.click(settings.soundEnabled);
                onResetGame();
                onClose();
              }}
              className="py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-black text-xs sm:text-sm border border-rose-200 flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <span>Đặt Lại Ván Chơi Mới</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow transition"
          >
            Áp dụng và Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
