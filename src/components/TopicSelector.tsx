import React, { useState } from 'react';
import { Search, Check, Sparkles, BookOpen, Edit3, ArrowLeft } from 'lucide-react';
import { Topic } from '../types';
import { soundEffects } from '../utils/audio';

interface TopicSelectorProps {
  topics: Topic[];
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
  onOpenVocabManager: (topicId: string) => void;
  onBack: () => void;
  soundEnabled: boolean;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  topics,
  selectedTopicId,
  onSelectTopic,
  onOpenVocabManager,
  onBack,
  soundEnabled,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = topics.filter(
    (t) =>
      t.nameVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.descriptionVi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEffects.click(soundEnabled);
              onBack();
            }}
            className="p-2.5 rounded-2xl bg-white hover:bg-sky-50 text-sky-800 border-2 border-sky-100 shadow-sm transition active:scale-95"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-sky-950 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-sky-600" />
              Chọn Chủ Đề Từ Vựng
            </h1>
            <p className="text-slate-600 text-sm">
              Khám phá 15 chủ đề tiếng Anh tiểu học chuẩn chỉnh với hình ảnh và âm thanh sống động.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm chủ đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border-2 border-sky-100 focus:border-sky-400 focus:outline-none text-sm font-semibold shadow-sm text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTopics.map((topic) => {
          const isSelected = topic.id === selectedTopicId;
          const wordCount = topic.words.length;

          return (
            <div
              key={topic.id}
              onClick={() => {
                soundEffects.click(soundEnabled);
                onSelectTopic(topic.id);
              }}
              className={`group relative rounded-3xl p-5 border-2 transition-all cursor-pointer select-none ${
                isSelected
                  ? 'border-sky-500 bg-gradient-to-br from-sky-50 via-white to-sky-100 shadow-lg ring-2 ring-sky-300 scale-[1.01]'
                  : 'border-slate-200 bg-white hover:border-sky-200 hover:shadow-md'
              }`}
            >
              {/* Header inside Card */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${topic.color} flex items-center justify-center text-3xl shadow-md`}
                  >
                    <span>{topic.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-lg text-slate-900 leading-tight">
                      {topic.nameVi}
                    </h3>
                    <p className="text-sm font-bold text-sky-700">{topic.nameEn}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-sm">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-600 mb-4 line-clamp-2">
                {topic.descriptionVi}
              </p>

              {/* Sample words previews */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {topic.words.slice(0, 4).map((w) => (
                  <span
                    key={w.id}
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 flex items-center gap-1 border border-slate-200"
                  >
                    <span>{w.emoji}</span>
                    <span>{w.word}</span>
                  </span>
                ))}
                {topic.words.length > 4 && (
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-lg bg-sky-100 text-sky-800">
                    +{topic.words.length - 4} từ
                  </span>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">
                  Tổng: <strong className="text-slate-800">{wordCount} từ vựng</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEffects.click(soundEnabled);
                      onOpenVocabManager(topic.id);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center gap-1"
                    title="Chỉnh sửa bộ từ này"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Sửa từ</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEffects.click(soundEnabled);
                      onSelectTopic(topic.id);
                      onBack();
                    }}
                    className={`px-3 py-1 rounded-xl font-black transition flex items-center gap-1 ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-sky-100 hover:bg-sky-200 text-sky-800'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isSelected ? 'Đang chọn' : 'Chọn chủ đề'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
