import { useState, useEffect, useRef } from 'react';
import { audioManager } from '../../audio/audio-manager';

interface MinesweeperProps {
  windowId: string;
  isFocused?: boolean;
  isMinimized?: boolean;
}

const ROWS = 16;
const COLS = 30;
const MINES = 99;

type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export function Minesweeper({ isFocused: _isFocused, isMinimized }: MinesweeperProps) {
  const [grid, setGrid] = useState<CellState[][]>([]);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [minesLeft, setMinesLeft] = useState(MINES);
  const [time, setTime] = useState(0);
  
  const timerRef = useRef<number | null>(null);

  // Initialize empty grid
  useEffect(() => {
    initGrid();
  }, []);

  const initGrid = () => {
    const newGrid: CellState[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: CellState[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setStatus('idle');
    setMinesLeft(MINES);
    setTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Start timer
  useEffect(() => {
    if (status === 'playing' && !isMinimized) {
      timerRef.current = window.setInterval(() => {
        setTime(t => Math.min(t + 1, 999));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, isMinimized]);

  const placeMines = (firstR: number, firstC: number, currentGrid: CellState[][]) => {
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      
      // Avoid placing mine on first click or if already a mine
      if (!currentGrid[r][c].isMine && !(r === firstR && c === firstC)) {
        currentGrid[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!currentGrid[r][c].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const nr = r + i;
              const nc = c + j;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && currentGrid[nr][nc].isMine) {
                count++;
              }
            }
          }
          currentGrid[r][c].neighborMines = count;
        }
      }
    }
  };

  const revealCell = (r: number, c: number) => {
    if (status === 'won' || status === 'lost') return;
    
    const newGrid = [...grid.map(row => [...row])];
    
    if (status === 'idle') {
      placeMines(r, c, newGrid);
      setStatus('playing');
    }

    if (newGrid[r][c].isRevealed || newGrid[r][c].isFlagged) return;

    if (newGrid[r][c].isMine) {
      // Game over
      newGrid[r][c].isRevealed = true;
      setStatus('lost');
      audioManager.play('error');
      // Reveal all mines
      newGrid.forEach(row => row.forEach(cell => {
        if (cell.isMine) cell.isRevealed = true;
      }));
      setGrid(newGrid);
      return;
    }

    // Flood fill
    const stack = [[r, c]];
    while (stack.length > 0) {
      const [currR, currC] = stack.pop()!;
      if (currR < 0 || currR >= ROWS || currC < 0 || currC >= COLS) continue;
      
      const cell = newGrid[currR][currC];
      if (cell.isRevealed || cell.isFlagged || cell.isMine) continue;

      cell.isRevealed = true;

      if (cell.neighborMines === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            stack.push([currR + i, currC + j]);
          }
        }
      }
    }

    setGrid(newGrid);
    audioManager.play('click');
    checkWinCondition(newGrid);
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (status === 'won' || status === 'lost') return;
    if (grid[r][c].isRevealed) return;

    const newGrid = [...grid.map(row => [...row])];
    const cell = newGrid[r][c];
    
    if (!cell.isFlagged && minesLeft > 0) {
      cell.isFlagged = true;
      setMinesLeft(prev => prev - 1);
    } else if (cell.isFlagged) {
      cell.isFlagged = false;
      setMinesLeft(prev => prev + 1);
    }

    setGrid(newGrid);
    audioManager.play('click');
  };

  const checkWinCondition = (currentGrid: CellState[][]) => {
    let unrevealedSafeCells = 0;
    currentGrid.forEach(row => {
      row.forEach(cell => {
        if (!cell.isMine && !cell.isRevealed) unrevealedSafeCells++;
      });
    });

    if (unrevealedSafeCells === 0) {
      setStatus('won');
      audioManager.play('notification');
      // Auto flag remaining mines
      const newGrid = [...currentGrid.map(row => [...row])];
      newGrid.forEach(row => row.forEach(cell => {
        if (cell.isMine) cell.isFlagged = true;
      }));
      setGrid(newGrid);
      setMinesLeft(0);
    }
  };

  const getNumberColor = (num: number) => {
    const colors = [
      '', '#0000ff', '#008000', '#ff0000', '#000080', 
      '#800000', '#008080', '#000000', '#808080'
    ];
    return colors[num];
  };

  const formatLedNumber = (num: number) => {
    if (num < 0) return `-${Math.abs(num).toString().padStart(2, '0')}`;
    return num.toString().padStart(3, '0');
  };

  return (
    <div className="flex flex-col items-center p-2 bg-[#bdbdbd] border-l-2 border-t-2 border-white border-r-2 border-b-2 border-[#7b7b7b] select-none h-full w-full">
      
      {/* Header / HUD */}
      <div className="flex justify-between items-center w-full p-1 bg-[#bdbdbd] border-l-2 border-t-2 border-[#7b7b7b] border-r-2 border-b-2 border-white mb-2 h-[38px]">
        {/* Mine Counter */}
        <div 
          className="bg-black text-red-500 font-mono text-[22px] w-[50px] h-[26px] flex items-center justify-center border-l-2 border-t-2 border-[#7b7b7b] border-r-2 border-b-2 border-white leading-none pt-[2px] tracking-tighter"
          title="Mines remaining (Right-click cells to place flags)"
        >
          {formatLedNumber(minesLeft)}
        </div>

        {/* Smiley Reset Button */}
        <button 
          onClick={initGrid}
          className="w-[26px] h-[26px] flex items-center justify-center bg-[#bdbdbd] border-l-2 border-t-2 border-white border-r-2 border-b-2 border-[#7b7b7b] active:border-l-[#7b7b7b] active:border-t-[#7b7b7b] active:border-r-white active:border-b-white text-[16px] select-none outline-none pb-[2px]"
          title="New Game"
        >
          {status === 'won' ? '😎' : status === 'lost' ? '😵' : '🙂'}
        </button>

        {/* Timer */}
        <div 
          className="bg-black text-red-500 font-mono text-[22px] w-[50px] h-[26px] flex items-center justify-center border-l-2 border-t-2 border-[#7b7b7b] border-r-2 border-b-2 border-white leading-none pt-[2px] tracking-tighter"
          title="Time elapsed"
        >
          {formatLedNumber(time)}
        </div>
      </div>

      {/* Grid */}
      <div className="bg-[#7b7b7b] border-l-2 border-t-2 border-[#7b7b7b] border-r-2 border-b-2 border-white p-[1px]">
        {grid.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => (
              <div 
                key={`${r}-${c}`}
                onClick={() => revealCell(r, c)}
                onContextMenu={(e) => toggleFlag(e, r, c)}
                className={`
                  w-5 h-5 flex items-center justify-center font-bold text-sm select-none
                  ${cell.isRevealed 
                    ? 'bg-[#bdbdbd] border-r border-b border-[#7b7b7b] border-t border-l border-[#bdbdbd]' 
                    : 'bg-[#bdbdbd] border-t-2 border-l-2 border-white border-r-2 border-b-2 border-[#7b7b7b] hover:bg-[#c0c0c0]'
                  }
                `}
                style={{ color: cell.isRevealed ? getNumberColor(cell.neighborMines) : 'black' }}
              >
                {cell.isRevealed && !cell.isMine && cell.neighborMines > 0 && cell.neighborMines}
                {cell.isRevealed && cell.isMine && !cell.isFlagged && '💣'}
                {cell.isFlagged && !cell.isRevealed && '🚩'}
                {status === 'lost' && !cell.isRevealed && cell.isMine && !cell.isFlagged && '💣'}
                {status === 'lost' && cell.isFlagged && !cell.isMine && '❌'}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
