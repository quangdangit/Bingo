import React from 'react';
import { CellState, GameSettings } from '../types';
import { BingoCell } from './BingoCell';
import { Trophy, CheckCircle2 } from 'lucide-react';

interface BingoBoardProps {
  board: CellState[];
  settings: GameSettings;
  shakingCellIndex: number | null;
  onCellClick: (index: number) => void;
  disabled: boolean;
}

export const BingoBoard: React.FC<BingoBoardProps> = ({
  board,
  settings,
  shakingCellIndex,
  onCellClick,
  disabled,
}) => {
  const markedCount = board.filter((c) => c.isMarked).length;
  const totalCount = board.length;
  const progressPercent = Math.round((markedCount / totalCount) * 100);

  const gridColsClass = {
    3: 'grid-cols-3 max-w-md',
    4: 'grid-cols-4 max-w-xl',
    5: 'grid-cols-5 max-w-2xl',
  }[settings.boardSize];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Board Card Container */}
      <div className={`w-full ${gridColsClass} bg-sky-100/70 p-3 sm:p-5 rounded-3xl border-3 border-sky-200 shadow-lg relative`}>
        {/* Top Info Bar */}
        <div className="flex items-center justify-between mb-3 px-1 text-xs sm:text-sm font-bold text-sky-900">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Bảng Bingo ({settings.boardSize}×{settings.boardSize})</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>{markedCount}/{totalCount} ô</span>
            </div>
            {/* Mini Progress meter */}
            <div className="w-16 sm:w-24 h-2.5 bg-sky-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Grid Cells */}
        <div className={`grid gap-2 sm:gap-3 ${gridColsClass.split(' ')[0]}`}>
          {board.map((cell) => (
            <BingoCell
              key={cell.index}
              cell={cell}
              settings={settings}
              isShaking={shakingCellIndex === cell.index}
              onClick={() => onCellClick(cell.index)}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
