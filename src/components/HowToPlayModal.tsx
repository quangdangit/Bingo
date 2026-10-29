import React from 'react';
import { X, Trophy, Volume2, CheckCircle2, Star, Sparkles } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface HowToPlayModalProps {
  onClose: () => void;
  soundEnabled: boolean;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose, soundEnabled }) => {
  const steps = [
    {
      num: '1',
      title: 'Chọn Chủ Đề Từ Vựng',
      desc: 'Chọn 1 trong 15 chủ đề quen thuộc như Động vật, Trái cây, Gia đình, Đồ dùng học tập...',
      icon: '📚',
      color: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      num: '2',
      title: 'Chọn Cấp Độ & Kích Thước Bảng',
      desc: 'Bảng 3×3 (9 ô), 4×4 (16 ô) hoặc 5×5 (25 ô) với độ khó Easy, Medium hoặc Challenge.',
      icon: '📐',
      color: 'bg-sky-100 text-sky-800 border-sky-300',
    },
    {
      num: '3',
      title: 'Lắng Nghe Hoặc Xem Gợi Ý',
      desc: 'Nghe phát âm tiếng Anh chuẩn bản xứ hoặc xem hình ảnh, gợi ý nghĩa tiếng Việt.',
      icon: '🎧',
      color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    },
    {
      num: '4',
      title: 'Tìm & Đánh Dấu Ô Đúng',
      desc: 'Nhấn vào ô chứa từ vựng tương ứng trên bảng Bingo của bạn để nhận +10 điểm!',
      icon: '🎯',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      num: '5',
      title: 'Đạt Bingo Chiến Thắng!',
      desc: 'Hoàn thành 1 hàng ngang, cột dọc, đường chéo hoặc 4 góc để hô vang BINGO!',
      icon: '👑',
      color: 'bg-rose-100 text-rose-800 border-rose-300',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border-4 border-amber-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 text-2xl">
              🦉
            </div>
            <div>
              <h2 className="font-heading font-black text-xl sm:text-2xl drop-shadow-sm">
                CÁCH CHƠI ENGLISH BINGO
              </h2>
              <p className="text-amber-100 text-xs sm:text-sm font-medium">
                5 bước đơn giản để cùng Bibo trở thành Bingo Champion!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEffects.click(soundEnabled);
              onClose();
            }}
            className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition active:scale-95"
            aria-label="Đóng hướng dẫn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {steps.map((st) => (
            <div
              key={st.num}
              className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-100 hover:border-sky-200 transition"
            >
              <div
                className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center text-xl shrink-0 font-heading font-black shadow-sm ${st.color}`}
              >
                <span>{st.icon}</span>
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-slate-900 mb-0.5 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs flex items-center justify-center">
                    {st.num}
                  </span>
                  {st.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}

          {/* Win conditions visual diagram */}
          <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200">
            <h4 className="font-heading font-black text-xs sm:text-sm text-sky-950 mb-2 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              Các Kiểu Đường Thắng BINGO Hợp Lệ:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-bold text-sky-900">
              <div className="bg-white p-2 rounded-xl border border-sky-200">
                <div className="text-lg">➡️</div>
                <div>Hàng Ngang</div>
              </div>
              <div className="bg-white p-2 rounded-xl border border-sky-200">
                <div className="text-lg">⬇️</div>
                <div>Cột Dọc</div>
              </div>
              <div className="bg-white p-2 rounded-xl border border-sky-200">
                <div className="text-lg">↗️ ↘️</div>
                <div>Đường Chéo</div>
              </div>
              <div className="bg-white p-2 rounded-xl border border-sky-200">
                <div className="text-lg">🔲</div>
                <div>Bốn Góc</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
          <button
            onClick={() => {
              soundEffects.click(soundEnabled);
              onClose();
            }}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-base shadow-md transition active:scale-95"
          >
            ĐÃ HIỂU, CÙNG CHƠI THÔI! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
