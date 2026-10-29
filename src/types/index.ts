export interface WordItem {
  id: string;
  word: string;
  meaningVi: string;
  emoji: string;
  ipa?: string;
  example?: string;
  topicId: string;
}

export interface Topic {
  id: string;
  nameEn: string;
  nameVi: string;
  icon: string;
  descriptionVi: string;
  color: string;
  words: WordItem[];
}

export type GameDifficulty = 'easy' | 'medium' | 'challenge';

export type GameMode = 'listen' | 'picture' | 'meaning';

export type BoardSize = 3 | 4 | 5;

export type WinConditionType = 'horizontal' | 'vertical' | 'diagonal' | 'corners' | 'fullhouse';

export interface GameSettings {
  topicId: string;
  difficulty: GameDifficulty;
  mode: GameMode;
  boardSize: BoardSize;
  winConditions: WinConditionType[];
  showImageHints: boolean;
  showMeaningHints: boolean;
  showTextHints: boolean;
  autoSpeak: boolean;
  speechRate: number; // 0.7 - 1.2
  soundEnabled: boolean;
  hasTimer: boolean;
  timerSeconds: number; // e.g. 15s per word or total
  classroomMode: boolean; // teacher presenter mode
}

export interface CellState {
  index: number; // 0 to N*N - 1
  row: number;
  col: number;
  word: WordItem;
  isMarked: boolean;
  isWinningCell?: boolean;
}

export interface GameState {
  board: CellState[];
  boardSize: BoardSize;
  calledWords: WordItem[];
  currentWord: WordItem | null;
  remainingPool: WordItem[];
  score: number;
  streak: number;
  maxStreak: number;
  correctAnswers: number;
  wrongAttempts: number;
  isBingo: boolean;
  winningConditionsAchieved: WinConditionType[];
  gameOver: boolean;
  startTime: number;
  elapsedSeconds: number;
  currentTurnSecondsLeft: number;
  isPaused: boolean;
  hasContinuedAfterBingo: boolean;
}

export interface Badge {
  id: string;
  title: string;
  titleVi: string;
  icon: string;
  description: string;
  unlocked: boolean;
}
