import type { BoardSize, CellState, WinConditionType, WordItem, Badge } from '../types/index.ts';

/**
 * Fisher-Yates array shuffle (deterministic or random)
 */
export function shuffleArray<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generates an N x N bingo board from word pool.
 * Guarantees no duplicate words if words.length >= size * size.
 */
export function generateBoard(words: WordItem[], size: BoardSize): CellState[] {
  const needed = size * size;
  if (words.length === 0) {
    throw new Error('Word pool cannot be empty.');
  }

  // Pick unique words first
  const shuffled = shuffleArray(words);
  let picked: WordItem[] = [];

  if (shuffled.length >= needed) {
    picked = shuffled.slice(0, needed);
  } else {
    // If not enough words, cycle safely
    picked = [...shuffled];
    while (picked.length < needed) {
      picked.push(...shuffled);
    }
    picked = picked.slice(0, needed);
  }

  const cells: CellState[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;
      cells.push({
        index: idx,
        row: r,
        col: c,
        word: picked[idx],
        isMarked: false,
        isWinningCell: false,
      });
    }
  }

  return cells;
}

export interface WinCheckResult {
  isBingo: boolean;
  winningConditions: WinConditionType[];
  winningCellIndices: number[];
}

/**
 * Validates active win conditions against the current board.
 */
export function checkWinConditions(
  board: CellState[],
  size: BoardSize,
  activeConditions: WinConditionType[] = ['horizontal', 'vertical', 'diagonal', 'corners', 'fullhouse']
): WinCheckResult {
  const winningConditions: WinConditionType[] = [];
  const winningIndicesSet = new Set<number>();

  const getCell = (r: number, c: number): CellState | undefined => board[r * size + c];

  // 1. Horizontal rows
  if (activeConditions.includes('horizontal')) {
    for (let r = 0; r < size; r++) {
      let rowComplete = true;
      const rowIndices: number[] = [];
      for (let c = 0; c < size; c++) {
        const cell = getCell(r, c);
        if (!cell || !cell.isMarked) {
          rowComplete = false;
          break;
        }
        rowIndices.push(r * size + c);
      }
      if (rowComplete) {
        if (!winningConditions.includes('horizontal')) {
          winningConditions.push('horizontal');
        }
        rowIndices.forEach((i) => winningIndicesSet.add(i));
      }
    }
  }

  // 2. Vertical columns
  if (activeConditions.includes('vertical')) {
    for (let c = 0; c < size; c++) {
      let colComplete = true;
      const colIndices: number[] = [];
      for (let r = 0; r < size; r++) {
        const cell = getCell(r, c);
        if (!cell || !cell.isMarked) {
          colComplete = false;
          break;
        }
        colIndices.push(r * size + c);
      }
      if (colComplete) {
        if (!winningConditions.includes('vertical')) {
          winningConditions.push('vertical');
        }
        colIndices.forEach((i) => winningIndicesSet.add(i));
      }
    }
  }

  // 3. Diagonals
  if (activeConditions.includes('diagonal')) {
    // Main diagonal (\)
    let mainDiagComplete = true;
    const mainIndices: number[] = [];
    for (let i = 0; i < size; i++) {
      const cell = getCell(i, i);
      if (!cell || !cell.isMarked) {
        mainDiagComplete = false;
        break;
      }
      mainIndices.push(i * size + i);
    }
    if (mainDiagComplete) {
      if (!winningConditions.includes('diagonal')) {
        winningConditions.push('diagonal');
      }
      mainIndices.forEach((i) => winningIndicesSet.add(i));
    }

    // Anti diagonal (/)
    let antiDiagComplete = true;
    const antiIndices: number[] = [];
    for (let i = 0; i < size; i++) {
      const cell = getCell(i, size - 1 - i);
      if (!cell || !cell.isMarked) {
        antiDiagComplete = false;
        break;
      }
      antiIndices.push(i * size + (size - 1 - i));
    }
    if (antiDiagComplete) {
      if (!winningConditions.includes('diagonal')) {
        winningConditions.push('diagonal');
      }
      antiIndices.forEach((i) => winningIndicesSet.add(i));
    }
  }

  // 4. Four Corners
  if (activeConditions.includes('corners')) {
    const corners = [
      getCell(0, 0),
      getCell(0, size - 1),
      getCell(size - 1, 0),
      getCell(size - 1, size - 1),
    ];
    const allCornersMarked = corners.every((c) => c && c.isMarked);
    if (allCornersMarked) {
      winningConditions.push('corners');
      winningIndicesSet.add(0);
      winningIndicesSet.add(size - 1);
      winningIndicesSet.add((size - 1) * size);
      winningIndicesSet.add(size * size - 1);
    }
  }

  // 5. Full House
  if (activeConditions.includes('fullhouse')) {
    const allMarked = board.length === size * size && board.every((c) => c.isMarked);
    if (allMarked) {
      winningConditions.push('fullhouse');
      board.forEach((_, idx) => winningIndicesSet.add(idx));
    }
  }

  const isBingo = winningConditions.length > 0;
  return {
    isBingo,
    winningConditions,
    winningCellIndices: Array.from(winningIndicesSet),
  };
}

/**
 * Calculates score updates based on answer outcome.
 */
export function calculateScore(
  currentScore: number,
  isCorrect: boolean,
  currentStreak: number
): { newScore: number; newStreak: number; pointsAwarded: number; isBonus: boolean } {
  if (!isCorrect) {
    return {
      newScore: currentScore,
      newStreak: 0,
      pointsAwarded: 0,
      isBonus: false,
    };
  }

  const newStreak = currentStreak + 1;
  const isBonus = newStreak > 0 && newStreak % 3 === 0;
  const pointsAwarded = 10 + (isBonus ? 5 : 0);
  const newScore = currentScore + pointsAwarded;

  return {
    newScore,
    newStreak,
    pointsAwarded,
    isBonus,
  };
}

/**
 * Prepares the calling pool for a bingo game.
 * Ensures that words present on the player's board are in the pool,
 * plus remaining words from the topic pool, shuffled randomly.
 */
export function prepareCallerPool(board: CellState[], allTopicWords: WordItem[]): WordItem[] {
  const boardWordIds = new Set(board.map((c) => c.word.id));
  const boardWords = board.map((c) => c.word);

  // Other topic words not on the board
  const otherWords = allTopicWords.filter((w) => !boardWordIds.has(w.id));

  // Combine and shuffle thoroughly
  return shuffleArray([...boardWords, ...otherWords]);
}

/**
 * Determines badges earned based on final stats
 */
export function evaluateBadges(stats: {
  score: number;
  correctAnswers: number;
  accuracy: number;
  maxStreak: number;
  isBingo: boolean;
}): Badge[] {
  return [
    {
      id: 'vocab-explorer',
      title: 'Vocabulary Explorer',
      titleVi: 'Nhà Thám Hiểm Từ Vựng',
      icon: '🧭',
      description: 'Chinh phục từ vựng và hoàn thành ván chơi xuất sắc.',
      unlocked: stats.correctAnswers >= 5,
    },
    {
      id: 'super-listener',
      title: 'Super Listener',
      titleVi: 'Đôi Tai Siêu Đẳng',
      icon: '🎧',
      description: 'Đạt độ chính xác từ 80% trở lên.',
      unlocked: stats.accuracy >= 80 && stats.correctAnswers >= 4,
    },
    {
      id: 'bingo-star',
      title: 'Bingo Star',
      titleVi: 'Ngôi Sao Bingo',
      icon: '⭐',
      description: 'Đạt được đường Bingo chiến thắng!',
      unlocked: stats.isBingo,
    },
    {
      id: 'english-champion',
      title: 'English Champion',
      titleVi: 'Nhà Vô Địch Tiếng Anh',
      icon: '🏆',
      description: 'Đạt chuỗi đúng liên tiếp 5 câu và trên 100 điểm.',
      unlocked: stats.maxStreak >= 4 && stats.score >= 80,
    },
  ];
}
