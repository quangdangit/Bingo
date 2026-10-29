import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, RotateCcw, Save, CheckCircle2, Volume2 } from 'lucide-react';
import { Topic, WordItem } from '../types';
import { soundEffects, SpeechService } from '../utils/audio';

interface VocabManagerModalProps {
  topics: Topic[];
  initialTopicId: string;
  onSaveTopics: (topics: Topic[]) => void;
  onResetToDefault: () => void;
  onClose: () => void;
  soundEnabled: boolean;
}

export const VocabManagerModal: React.FC<VocabManagerModalProps> = ({
  topics,
  initialTopicId,
  onSaveTopics,
  onResetToDefault,
  onClose,
  soundEnabled,
}) => {
  const [activeTopicId, setActiveTopicId] = useState(initialTopicId);
  const [editingWordId, setEditingWordId] = useState<string | null>(null);

  // New word form state
  const [newWord, setNewWord] = useState('');
  const [newMeaningVi, setNewMeaningVi] = useState('');
  const [newEmoji, setNewEmoji] = useState('🌟');
  const [newIpa, setNewIpa] = useState('');
  const [newExample, setNewExample] = useState('');

  // Edit word state
  const [editWord, setEditWord] = useState('');
  const [editMeaningVi, setEditMeaningVi] = useState('');
  const [editEmoji, setEditEmoji] = useState('');
  const [editIpa, setEditIpa] = useState('');
  const [editExample, setEditExample] = useState('');

  const currentTopic = topics.find((t) => t.id === activeTopicId) || topics[0];

  const handleStartEdit = (item: WordItem) => {
    soundEffects.click(soundEnabled);
    setEditingWordId(item.id);
    setEditWord(item.word);
    setEditMeaningVi(item.meaningVi);
    setEditEmoji(item.emoji);
    setEditIpa(item.ipa || '');
    setEditExample(item.example || '');
  };

  const handleSaveEdit = (wordId: string) => {
    if (!editWord.trim() || !editMeaningVi.trim()) return;
    soundEffects.click(soundEnabled);

    const updatedTopics = topics.map((top) => {
      if (top.id !== activeTopicId) return top;
      return {
        ...top,
        words: top.words.map((w) =>
          w.id === wordId
            ? {
                ...w,
                word: editWord.trim(),
                meaningVi: editMeaningVi.trim(),
                emoji: editEmoji.trim() || '🌟',
                ipa: editIpa.trim() || undefined,
                example: editExample.trim() || undefined,
              }
            : w
        ),
      };
    });

    onSaveTopics(updatedTopics);
    setEditingWordId(null);
  };

  const handleDeleteWord = (wordId: string) => {
    soundEffects.click(soundEnabled);
    const updatedTopics = topics.map((top) => {
      if (top.id !== activeTopicId) return top;
      return {
        ...top,
        words: top.words.filter((w) => w.id !== wordId),
      };
    });
    onSaveTopics(updatedTopics);
  };

  const handleAddNewWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaningVi.trim()) return;
    soundEffects.correct(soundEnabled);

    const wordItem: WordItem = {
      id: `custom-${Date.now()}`,
      word: newWord.trim(),
      meaningVi: newMeaningVi.trim(),
      emoji: newEmoji.trim() || '✨',
      ipa: newIpa.trim() || undefined,
      example: newExample.trim() || undefined,
      topicId: activeTopicId,
    };

    const updatedTopics = topics.map((top) => {
      if (top.id !== activeTopicId) return top;
      return {
        ...top,
        words: [wordItem, ...top.words],
      };
    });

    onSaveTopics(updatedTopics);

    // Reset input fields
    setNewWord('');
    setNewMeaningVi('');
    setNewEmoji('🌟');
    setNewIpa('');
    setNewExample('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border-4 border-indigo-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-sky-600 to-teal-500 p-5 text-white flex items-center justify-between">
          <div>
            <h2 className="font-heading font-black text-xl sm:text-2xl">
              QUẢN LÝ BỘ TỪ VỰNG TIẾNG ANH
            </h2>
            <p className="text-indigo-100 text-xs sm:text-sm font-medium">
              Thêm mới, chỉnh sửa hoặc xóa từ vựng trong bộ từ giảng dạy
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition active:scale-95"
            aria-label="Đóng quản lý từ vựng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Topic Selector Tabs */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto flex gap-2">
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                soundEffects.click(soundEnabled);
                setActiveTopicId(t.id);
                setEditingWordId(null);
              }}
              className={`shrink-0 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                t.id === activeTopicId
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.nameVi}</span>
              <span className="text-[10px] opacity-80">({t.words.length})</span>
            </button>
          ))}
        </div>

        {/* Content Body: Add Form & Word Table */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Add New Word Form */}
          <form
            onSubmit={handleAddNewWord}
            className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200"
          >
            <h3 className="font-heading font-black text-sm text-sky-950 mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-sky-600" />
              Thêm từ vựng mới vào chủ đề "{currentTopic.nameVi}"
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Từ tiếng Anh *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. dolphin"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Nghĩa tiếng Việt *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. cá heo"
                  value={newMeaningVi}
                  onChange={(e) => setNewMeaningVi(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Biểu tượng / Emoji
                </label>
                <input
                  type="text"
                  placeholder="🐬"
                  value={newEmoji}
                  onChange={(e) => setNewEmoji(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Phiên âm IPA (tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="/ˈdɒl.fɪn/"
                  value={newIpa}
                  onChange={(e) => setNewIpa(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <input
                type="text"
                placeholder="Câu ví dụ ngắn cho trẻ em (tùy chọn): The dolphin jumps high."
                value={newExample}
                onChange={(e) => setNewExample(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
              />

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs whitespace-nowrap shadow-sm transition active:scale-95"
              >
                + Thêm từ này
              </button>
            </div>
          </form>

          {/* Words List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-black text-sm text-slate-900">
                Danh sách từ hiện tại ({currentTopic.words.length} từ)
              </span>
              <button
                onClick={() => {
                  soundEffects.click(soundEnabled);
                  if (confirm('Bạn có chắc muốn đặt lại danh sách từ vựng về dữ liệu chuẩn ban đầu?')) {
                    onResetToDefault();
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại về mặc định</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {currentTopic.words.map((item) => {
                const isEditing = editingWordId === item.id;

                if (isEditing) {
                  return (
                    <div key={item.id} className="p-3 bg-amber-50/60 flex flex-col gap-2">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <input
                          type="text"
                          value={editWord}
                          onChange={(e) => setEditWord(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border bg-white text-xs font-bold"
                          placeholder="Từ tiếng Anh"
                        />
                        <input
                          type="text"
                          value={editMeaningVi}
                          onChange={(e) => setEditMeaningVi(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border bg-white text-xs"
                          placeholder="Nghĩa tiếng Việt"
                        />
                        <input
                          type="text"
                          value={editEmoji}
                          onChange={(e) => setEditEmoji(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border bg-white text-xs"
                          placeholder="Emoji"
                        />
                        <input
                          type="text"
                          value={editIpa}
                          onChange={(e) => setEditIpa(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border bg-white text-xs font-mono"
                          placeholder="IPA"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editExample}
                          onChange={(e) => setEditExample(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 rounded-lg border bg-white text-xs"
                          placeholder="Câu ví dụ"
                        />
                        <button
                          onClick={() => handleSaveEdit(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Lưu</span>
                        </button>
                        <button
                          onClick={() => setEditingWordId(null)}
                          className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <div className="font-heading font-black text-sm text-slate-900 flex items-center gap-2">
                          <span>{item.word}</span>
                          {item.ipa && (
                            <span className="text-slate-400 font-mono text-xs font-normal">
                              {item.ipa}
                            </span>
                          )}
                          <button
                            onClick={() =>
                              SpeechService.speak(item.word, { enabled: soundEnabled })
                            }
                            className="text-sky-500 hover:text-sky-700"
                            title="Nghe phát âm"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-xs text-slate-600 font-medium">
                          {item.meaningVi}
                          {item.example && (
                            <span className="text-slate-400 italic ml-2">"{item.example}"</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                        title="Chỉnh sửa từ này"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteWord(item.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Xóa từ này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow transition"
          >
            Hoàn tất & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
