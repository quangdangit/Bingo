import test from 'node:test';
import assert from 'node:assert/strict';
import { generateBoard, checkWinConditions, calculateScore, prepareCallerPool, evaluateBadges } from './rules.ts';
import type { WordItem, CellState } from '../types/index.ts';

const mockWords: WordItem[] = Array.from({ length: 25 }, (_, i) => ({
  id: `test-${i}`,
  word: `word-${i}`,
  meaningVi: `nghĩa-${i}`,
  emoji: '🍎',
  topicId: 'test-topic',
}));

test('generateBoard creates expected size and distinct items', () => {
  const board3x3 = generateBoard(mockWords, 3);
  assert.equal(board3x3.length, 9);
  const words3 = new Set(board3x3.map((c) => c.word.id));
  assert.equal(words3.size, 9);

  const board4x4 = generateBoard(mockWords, 4);
  assert.equal(board4x4.length, 16);
  const words4 = new Set(board4x4.map((c) => c.word.id));
  assert.equal(words4.size, 16);

  const board5x5 = generateBoard(mockWords, 5);
  assert.equal(board5x5.length, 25);
  const words5 = new Set(board5x5.map((c) => c.word.id));
  assert.equal(words5.size, 25);
});

test('checkWinConditions detects horizontal row', () => {
  const board: CellState[] = Array.from({ length: 16 }, (_, idx) => ({
    index: idx,
    row: Math.floor(idx / 4),
    col: idx % 4,
    word: mockWords[idx],
    isMarked: false,
  }));

  // Mark entire first row (0, 1, 2, 3)
  board[0].isMarked = true;
  board[1].isMarked = true;
  board[2].isMarked = true;
  board[3].isMarked = true;

  const res = checkWinConditions(board, 4, ['horizontal']);
  assert.equal(res.isBingo, true);
  assert.ok(res.winningConditions.includes('horizontal'));
  assert.deepEqual(res.winningCellIndices.sort((a, b) => a - b), [0, 1, 2, 3]);
});

test('checkWinConditions detects vertical column', () => {
  const board: CellState[] = Array.from({ length: 9 }, (_, idx) => ({
    index: idx,
    row: Math.floor(idx / 3),
    col: idx % 3,
    word: mockWords[idx],
    isMarked: false,
  }));

  // Mark column 1 (indices 1, 4, 7)
  board[1].isMarked = true;
  board[4].isMarked = true;
  board[7].isMarked = true;

  const res = checkWinConditions(board, 3, ['vertical']);
  assert.equal(res.isBingo, true);
  assert.ok(res.winningConditions.includes('vertical'));
  assert.deepEqual(res.winningCellIndices.sort((a, b) => a - b), [1, 4, 7]);
});

test('checkWinConditions detects diagonal win', () => {
  const board: CellState[] = Array.from({ length: 9 }, (_, idx) => ({
    index: idx,
    row: Math.floor(idx / 3),
    col: idx % 3,
    word: mockWords[idx],
    isMarked: false,
  }));

  // Main diagonal: 0, 4, 8
  board[0].isMarked = true;
  board[4].isMarked = true;
  board[8].isMarked = true;

  const res = checkWinConditions(board, 3, ['diagonal']);
  assert.equal(res.isBingo, true);
  assert.ok(res.winningConditions.includes('diagonal'));
  assert.deepEqual(res.winningCellIndices.sort((a, b) => a - b), [0, 4, 8]);
});

test('checkWinConditions detects four corners', () => {
  const board: CellState[] = Array.from({ length: 16 }, (_, idx) => ({
    index: idx,
    row: Math.floor(idx / 4),
    col: idx % 4,
    word: mockWords[idx],
    isMarked: false,
  }));

  // Corners of 4x4: (0,0)->0, (0,3)->3, (3,0)->12, (3,3)->15
  board[0].isMarked = true;
  board[3].isMarked = true;
  board[12].isMarked = true;
  board[15].isMarked = true;

  const res = checkWinConditions(board, 4, ['corners']);
  assert.equal(res.isBingo, true);
  assert.ok(res.winningConditions.includes('corners'));
});

test('calculateScore awards points and combo bonus correctly', () => {
  // Step 1: First correct
  const s1 = calculateScore(0, true, 0);
  assert.equal(s1.newScore, 10);
  assert.equal(s1.newStreak, 1);
  assert.equal(s1.isBonus, false);

  // Step 2: Second correct
  const s2 = calculateScore(s1.newScore, true, s1.newStreak);
  assert.equal(s2.newScore, 20);
  assert.equal(s2.newStreak, 2);
  assert.equal(s2.isBonus, false);

  // Step 3: Third correct (streak = 3 => +10 + 5 bonus = +15)
  const s3 = calculateScore(s2.newScore, true, s2.newStreak);
  assert.equal(s3.newScore, 35);
  assert.equal(s3.newStreak, 3);
  assert.equal(s3.isBonus, true);

  // Step 4: Incorrect answer resets streak but does not deduct score
  const s4 = calculateScore(s3.newScore, false, s3.newStreak);
  assert.equal(s4.newScore, 35);
  assert.equal(s4.newStreak, 0);
});

test('prepareCallerPool contains all board words and no duplicates', () => {
  const board = generateBoard(mockWords, 3);
  const pool = prepareCallerPool(board, mockWords);

  assert.equal(pool.length, mockWords.length);
  // All board words must exist in pool
  const poolIds = new Set(pool.map((w) => w.id));
  board.forEach((c) => {
    assert.ok(poolIds.has(c.word.id));
  });
});

test('evaluateBadges unlocks badges based on criteria', () => {
  const badges = evaluateBadges({
    score: 95,
    correctAnswers: 6,
    accuracy: 85,
    maxStreak: 5,
    isBingo: true,
  });

  const unlocked = badges.filter((b) => b.unlocked);
  assert.equal(unlocked.length, 4);
});
