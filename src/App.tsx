/**
 * English Bingo Adventure – Vui Học Từ Vựng Tiếng Anh
 * EdTech Web Game for Vietnamese Primary Students & Teachers
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { TopicSelector } from './components/TopicSelector';
import { BingoBoard } from './components/BingoBoard';
import { CalledWordPanel } from './components/CalledWordPanel';
import { Mascot, MascotMood } from './components/Mascot';
import { ResultScreen } from './components/ResultScreen';
import { TeacherDashboard } from './components/TeacherDashboard';
import { VocabManagerModal } from './components/VocabManagerModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { ClassroomPresenter } from './components/ClassroomPresenter';

import {
  Topic,
  GameSettings,
  GameState,
  WordItem,
  CellState,
  Badge,
} from './types';
import {
  getLoadedTopics,
  saveTopics,
  resetTopicsToDefault,
} from './data/vocabulary';
import {
  generateBoard,
  checkWinConditions,
  calculateScore,
  prepareCallerPool,
  evaluateBadges,
} from './game/rules';
import { soundEffects, SpeechService } from './utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowRight, Eye } from 'lucide-react';

const DEFAULT_SETTINGS: GameSettings = {
  topicId: 'animals',
  difficulty: 'easy',
  mode: 'listen',
  boardSize: 4,
  winConditions: ['horizontal', 'vertical', 'diagonal', 'corners', 'fullhouse'],
  showImageHints: true,
  showMeaningHints: true,
  showTextHints: true,
  autoSpeak: true,
  speechRate: 0.88,
  soundEnabled: true,
  hasTimer: false,
  timerSeconds: 15,
  classroomMode: false,
};

export default function App() {
  const [topics, setTopics] = useState<Topic[]>(() => getLoadedTopics());
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'topics' | 'game' | 'result'>('home');

  // Modals state
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showTeacherDashboard, setShowTeacherDashboard] = useState(false);
  const [showVocabManager, setShowVocabManager] = useState(false);
  const [vocabManagerTopicId, setVocabManagerTopicId] = useState<string>('animals');
  const [showBingoVictoryBanner, setShowBingoVictoryBanner] = useState(false);

  // Gameplay state
  const [gameState, setGameState] = useState<GameState>({
    board: [],
    boardSize: 4,
    calledWords: [],
    currentWord: null,
    remainingPool: [],
    score: 0,
    streak: 0,
    maxStreak: 0,
    correctAnswers: 0,
    wrongAttempts: 0,
    isBingo: false,
    winningConditionsAchieved: [],
    gameOver: false,
    startTime: Date.now(),
    elapsedSeconds: 0,
    currentTurnSecondsLeft: 15,
    isPaused: false,
    hasContinuedAfterBingo: false,
  });

  const [shakingCellIndex, setShakingCellIndex] = useState<number | null>(null);
  const [mascotMood, setMascotMood] = useState<MascotMood>('happy');
  const [mascotMessage, setMascotMessage] = useState<string>(
    'Chào mừng bạn đến với English Bingo Adventure! Chúc bạn chơi vui và học thật nhiều từ mới!'
  );

  const activeTopic = topics.find((t) => t.id === settings.topicId) || topics[0];

  // Helper to speak active word
  const speakWord = useCallback((wordText: string) => {
    SpeechService.speak(wordText, {
      rate: settings.speechRate,
      enabled: settings.soundEnabled,
    });
  }, [settings.speechRate, settings.soundEnabled]);

  // Start new game
  const handleStartGame = useCallback(() => {
    try {
      const newBoard = generateBoard(activeTopic.words, settings.boardSize);
      const newPool = prepareCallerPool(newBoard, activeTopic.words);

      const firstWord = newPool[0] || null;
      const remaining = newPool.slice(1);

      setGameState({
        board: newBoard,
        boardSize: settings.boardSize,
        calledWords: firstWord ? [firstWord] : [],
        currentWord: firstWord,
        remainingPool: remaining,
        score: 0,
        streak: 0,
        maxStreak: 0,
        correctAnswers: 0,
        wrongAttempts: 0,
        isBingo: false,
        winningConditionsAchieved: [],
        gameOver: false,
        startTime: Date.now(),
        elapsedSeconds: 0,
        currentTurnSecondsLeft: settings.timerSeconds,
        isPaused: false,
        hasContinuedAfterBingo: false,
      });

      setShowBingoVictoryBanner(false);
      setCurrentScreen('game');
      setMascotMood('happy');
      setMascotMessage(`Bắt đầu chủ đề ${activeTopic.nameVi}! Nghe và tìm từ thật chính xác nhé!`);

      if (firstWord && settings.autoSpeak) {
        setTimeout(() => {
          speakWord(firstWord.word);
        }, 300);
      }
    } catch (err) {
      console.error('Error starting game:', err);
    }
  }, [activeTopic, settings.boardSize, settings.timerSeconds, settings.autoSpeak, speakWord]);

  // Support ?autostart=1 for ultra-mode and testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        handleStartGame();
      }
    }
  }, [handleStartGame]);

  // Timer countdown hook
  useEffect(() => {
    if (currentScreen !== 'game' || gameState.gameOver || gameState.isPaused) return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        const nextElapsed = prev.elapsedSeconds + 1;
        let nextTurnLeft = prev.currentTurnSecondsLeft;

        if (settings.hasTimer) {
          nextTurnLeft = Math.max(0, prev.currentTurnSecondsLeft - 1);
          if (nextTurnLeft <= 3 && nextTurnLeft > 0) {
            soundEffects.tick(settings.soundEnabled);
          }
          if (nextTurnLeft === 0) {
            // Turn timeout: automatically cycle to next word
            soundEffects.wrong(settings.soundEnabled);
            setMascotMood('encourage');
            setMascotMessage('Hết giờ lượt này rồi! Hãy thử sức với từ tiếp theo nhé!');

            if (prev.remainingPool.length > 0) {
              const nextW = prev.remainingPool[0];
              const rest = prev.remainingPool.slice(1);
              if (settings.autoSpeak) {
                speakWord(nextW.word);
              }
              return {
                ...prev,
                elapsedSeconds: nextElapsed,
                currentWord: nextW,
                calledWords: [...prev.calledWords, nextW],
                remainingPool: rest,
                currentTurnSecondsLeft: settings.timerSeconds,
                streak: 0,
              };
            }
          }
        }

        return {
          ...prev,
          elapsedSeconds: nextElapsed,
          currentTurnSecondsLeft: nextTurnLeft,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentScreen, gameState.gameOver, gameState.isPaused, settings.hasTimer, settings.timerSeconds, settings.autoSpeak, settings.soundEnabled, speakWord]);

  // Advance to next word
  const handleNextWord = () => {
    if (gameState.remainingPool.length === 0) {
      // Finished all words
      setGameState((prev) => ({ ...prev, gameOver: true }));
      setCurrentScreen('result');
      return;
    }

    const nextWord = gameState.remainingPool[0];
    const remaining = gameState.remainingPool.slice(1);

    setGameState((prev) => ({
      ...prev,
      currentWord: nextWord,
      calledWords: [...prev.calledWords, nextWord],
      remainingPool: remaining,
      currentTurnSecondsLeft: settings.timerSeconds,
    }));

    if (settings.autoSpeak) {
      speakWord(nextWord.word);
    }
  };

  // Cell click handler
  const handleCellClick = (index: number) => {
    if (!gameState.currentWord || gameState.isPaused) return;

    const targetCell = gameState.board[index];
    if (!targetCell || targetCell.isMarked) return;

    // Check if clicked cell matches current called word
    const isMatch = targetCell.word.id === gameState.currentWord.id;

    if (isMatch) {
      // Correct!
      soundEffects.correct(settings.soundEnabled);

      const scoreResult = calculateScore(gameState.score, true, gameState.streak);
      if (scoreResult.isBonus) {
        soundEffects.streakBonus(settings.soundEnabled);
      }

      // Mark cell
      const updatedBoard = gameState.board.map((c) =>
        c.index === index ? { ...c, isMarked: true } : c
      );

      // Check win condition
      const winCheck = checkWinConditions(
        updatedBoard,
        gameState.boardSize,
        settings.winConditions
      );

      let finalBoard = updatedBoard;
      let newIsBingo = gameState.isBingo;
      let winningConds = gameState.winningConditionsAchieved;

      if (winCheck.isBingo && !gameState.isBingo) {
        newIsBingo = true;
        winningConds = winCheck.winningConditions;
        finalBoard = updatedBoard.map((c) =>
          winCheck.winningCellIndices.includes(c.index)
            ? { ...c, isWinningCell: true }
            : c
        );

        // Win celebration
        soundEffects.bingo(settings.soundEnabled);
        try {
          confetti({
            particleCount: 160,
            spread: 100,
            origin: { y: 0.6 },
          });
        } catch {
          // Fallback
        }

        setShowBingoVictoryBanner(true);
        setMascotMood('bingo');
        setMascotMessage('BINGO! AMAZING JOB! Xuất sắc! Bạn đã chinh phục thử thách từ vựng!');
      } else {
        // Cheerful praise
        const praises = [
          'Great job! Đúng rồi bạn ơi! 🌟',
          'Excellent! Đỉnh quá! 👏',
          'Well done! Tiếp tục phát huy nào! 🚀',
          'Super! Trí nhớ của bạn rất tuyệt! 🎯',
        ];
        const randomPraise = praises[Math.floor(Math.random() * praises.length)];
        setMascotMood('cheer');
        setMascotMessage(randomPraise);
      }

      setGameState((prev) => ({
        ...prev,
        board: finalBoard,
        score: scoreResult.newScore,
        streak: scoreResult.newStreak,
        maxStreak: Math.max(prev.maxStreak, scoreResult.newStreak),
        correctAnswers: prev.correctAnswers + 1,
        isBingo: newIsBingo,
        winningConditionsAchieved: winningConds,
      }));

      // Automatically advance to next word after short pleasant delay if not won or already continued
      if (!winCheck.isBingo || gameState.hasContinuedAfterBingo) {
        setTimeout(() => {
          handleNextWord();
        }, 700);
      }
    } else {
      // Wrong guess
      soundEffects.wrong(settings.soundEnabled);
      setShakingCellIndex(index);
      setTimeout(() => setShakingCellIndex(null), 400);

      const gentleEncouragements = [
        'Good try! Hãy nghe lại nhé! 🎧',
        'Gần đúng rồi! Bạn thử lại nào! 💪',
        'Không sao cả, hãy lắng nghe thật kỹ nhé! 🦉',
      ];
      const randomEncourage =
        gentleEncouragements[Math.floor(Math.random() * gentleEncouragements.length)];

      setMascotMood('encourage');
      setMascotMessage(randomEncourage);

      setGameState((prev) => ({
        ...prev,
        wrongAttempts: prev.wrongAttempts + 1,
        streak: 0,
      }));
    }
  };

  // Continue playing after Bingo
  const handleContinuePlaying = () => {
    setShowBingoVictoryBanner(false);
    setGameState((prev) => ({ ...prev, hasContinuedAfterBingo: true }));
    handleNextWord();
  };

  // View final results
  const handleFinishGame = () => {
    setShowBingoVictoryBanner(false);
    setGameState((prev) => ({ ...prev, gameOver: true }));
    setCurrentScreen('result');
  };

  // Badges calculation
  const totalCalls = gameState.calledWords.length;
  const currentAccuracy =
    totalCalls > 0 ? Math.round((gameState.correctAnswers / totalCalls) * 100) : 100;
  const unlockedBadges = evaluateBadges({
    score: gameState.score,
    correctAnswers: gameState.correctAnswers,
    accuracy: currentAccuracy,
    maxStreak: gameState.maxStreak,
    isBingo: gameState.isBingo,
  });

  return (
    <div className="min-h-screen bg-sky-50/60 flex flex-col font-sans selection:bg-amber-300 selection:text-amber-950">
      {/* Universal EdTech App Header */}
      <Header
        score={gameState.score}
        streak={gameState.streak}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() =>
          setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))
        }
        onOpenHelp={() => setShowHelpModal(true)}
        onOpenTeacher={() => setShowTeacherDashboard(true)}
        onGoHome={() => {
          SpeechService.stop();
          setCurrentScreen('home');
        }}
        currentScreen={currentScreen}
        topicName={activeTopic.nameVi}
        isClassroomMode={settings.classroomMode}
        onToggleClassroomMode={() => {
          const nextVal = !settings.classroomMode;
          setSettings((s) => ({ ...s, classroomMode: nextVal }));
          if (nextVal && currentScreen !== 'game') {
            handleStartGame();
          }
        }}
      />

      {/* Screen Routing */}
      <main className="flex-1 flex flex-col">
        {currentScreen === 'home' && (
          <HomeScreen
            topics={topics}
            settings={settings}
            onUpdateSettings={(newSettings) =>
              setSettings((prev) => ({ ...prev, ...newSettings }))
            }
            onStartGame={handleStartGame}
            onOpenTopics={() => setCurrentScreen('topics')}
            onOpenHelp={() => setShowHelpModal(true)}
            onOpenTeacher={() => setShowTeacherDashboard(true)}
          />
        )}

        {currentScreen === 'topics' && (
          <TopicSelector
            topics={topics}
            selectedTopicId={settings.topicId}
            onSelectTopic={(id) => setSettings((s) => ({ ...s, topicId: id }))}
            onOpenVocabManager={(id) => {
              setVocabManagerTopicId(id);
              setShowVocabManager(true);
            }}
            onBack={() => setCurrentScreen('home')}
            soundEnabled={settings.soundEnabled}
          />
        )}

        {currentScreen === 'game' && (
          <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col justify-between">
            {/* Top Mascot advice bar during gameplay */}
            <div className="mb-4 flex items-center justify-between gap-3 bg-white/80 p-3 sm:p-4 rounded-3xl border border-sky-100 shadow-sm">
              <Mascot mood={mascotMood} message={mascotMessage} size="sm" />

              <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500">
                <span>Chủ đề: <strong className="text-sky-700">{activeTopic.nameVi} ({activeTopic.nameEn})</strong></span>
                <span>•</span>
                <span>Cấp độ: <strong className="text-amber-600 uppercase">{settings.difficulty}</strong></span>
              </div>
            </div>

            {/* Game Core: Left side called word panel, Right side Bingo board */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Called Word Prompt Panel */}
              <div className="lg:col-span-5 w-full">
                <CalledWordPanel
                  currentWord={gameState.currentWord}
                  settings={settings}
                  calledHistory={gameState.calledWords}
                  remainingCount={gameState.remainingPool.length}
                  timerSecondsLeft={gameState.currentTurnSecondsLeft}
                  onReplayAudio={() => {
                    if (gameState.currentWord) {
                      speakWord(gameState.currentWord.word);
                    }
                  }}
                  onNextWord={handleNextWord}
                  soundEnabled={settings.soundEnabled}
                  isPaused={gameState.isPaused}
                />
              </div>

              {/* Interactive Bingo Board */}
              <div className="lg:col-span-7 w-full flex justify-center">
                <BingoBoard
                  board={gameState.board}
                  settings={settings}
                  shakingCellIndex={shakingCellIndex}
                  onCellClick={handleCellClick}
                  disabled={gameState.gameOver}
                />
              </div>
            </div>

            {/* Bottom Quick Bar */}
            <div className="mt-6 pt-3 border-t border-sky-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
              <div className="flex items-center gap-3">
                <span>Số câu đúng: <strong className="text-emerald-600 font-black">{gameState.correctAnswers}</strong></span>
                <span>Số câu sai: <strong className="text-rose-500 font-black">{gameState.wrongAttempts}</strong></span>
                <span>Chuỗi cao nhất: <strong className="text-amber-600 font-black">{gameState.maxStreak}x</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="hover:underline font-bold text-sky-700"
                >
                  Thoát ván chơi
                </button>
              </div>
            </div>
          </div>
        )}

        {currentScreen === 'result' && (
          <ResultScreen
            gameState={gameState}
            badges={unlockedBadges}
            topic={activeTopic}
            onPlayAgain={handleStartGame}
            onChangeTopic={() => setCurrentScreen('topics')}
            onChangeDifficulty={() => {
              setShowTeacherDashboard(true);
            }}
            onGoHome={() => setCurrentScreen('home')}
            soundEnabled={settings.soundEnabled}
          />
        )}
      </main>

      {/* Classroom Presenter Fullscreen Overlay */}
      {settings.classroomMode && currentScreen === 'game' && (
        <ClassroomPresenter
          currentWord={gameState.currentWord}
          calledHistory={gameState.calledWords}
          remainingWords={gameState.remainingPool}
          settings={settings}
          onNextWord={handleNextWord}
          onClose={() => setSettings((s) => ({ ...s, classroomMode: false }))}
          soundEnabled={settings.soundEnabled}
        />
      )}

      {/* Bingo Victory Overlay Banner */}
      {showBingoVictoryBanner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-amber-400 via-rose-400 to-indigo-600 rounded-3xl p-6 sm:p-10 max-w-lg w-full text-center shadow-2xl border-4 border-amber-300 animate-pop text-slate-900">
            <div className="text-6xl sm:text-7xl mb-2 animate-bounce">🎉</div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white drop-shadow-md mb-2">
              BINGO! AMAZING JOB!
            </h2>
            <p className="text-amber-100 text-lg sm:text-xl font-bold mb-4">
              Xuất sắc! Bạn đã hoàn thành đường chiến thắng BINGO!
            </p>
            <div className="bg-white/20 p-3 rounded-2xl text-white text-sm font-semibold mb-6">
              Điểm số hiện tại: <strong className="text-amber-200 text-lg">{gameState.score} điểm</strong> (+20 điểm thưởng hoàn thành BINGO!)
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleContinuePlaying}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-white text-slate-900 font-black hover:bg-slate-100 transition shadow"
              >
                Tiếp tục chơi hết từ 🎯
              </button>
              <button
                onClick={handleFinishGame}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-amber-300 text-amber-950 font-black hover:bg-amber-200 transition shadow"
              >
                Xem tổng kết & Huy hiệu 🏆
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How To Play Modal */}
      {showHelpModal && (
        <HowToPlayModal
          onClose={() => setShowHelpModal(false)}
          soundEnabled={settings.soundEnabled}
        />
      )}

      {/* Teacher Dashboard Modal */}
      {showTeacherDashboard && (
        <TeacherDashboard
          settings={settings}
          onUpdateSettings={(newSettings) =>
            setSettings((prev) => ({ ...prev, ...newSettings }))
          }
          onOpenVocabManager={() => {
            setShowTeacherDashboard(false);
            setVocabManagerTopicId(settings.topicId);
            setShowVocabManager(true);
          }}
          onClose={() => setShowTeacherDashboard(false)}
          onResetGame={handleStartGame}
        />
      )}

      {/* Vocabulary Manager Modal */}
      {showVocabManager && (
        <VocabManagerModal
          topics={topics}
          initialTopicId={vocabManagerTopicId}
          onSaveTopics={(updated) => {
            setTopics(updated);
            saveTopics(updated);
          }}
          onResetToDefault={() => {
            const defaults = resetTopicsToDefault();
            setTopics(defaults);
          }}
          onClose={() => setShowVocabManager(false)}
          soundEnabled={settings.soundEnabled}
        />
      )}
    </div>
  );
}
