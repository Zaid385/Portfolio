import { useState, useEffect, useRef } from 'react';
import { audioManager } from '../../audio/audio-manager';

interface MinesweeperProps {
  windowId: string;
  isFocused?: boolean;
  isMinimized?: boolean;
}

// Intermediate difficulty
const ROWS = 16;
const COLS = 16;
const MINES = 40;

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
  const [pressedCell, setPressedCell] = useState<{r: number, c: number} | null>(null);
  const [smileyPressed, setSmileyPressed] = useState(false);
  
  const timerRef = useRef<number | null>(null);

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
    setPressedCell(null);
    if (timerRef.current) clearInterval(timerRef.current);
  };

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
      
      if (!currentGrid[r][c].isMine && !(r === firstR && c === firstC)) {
        currentGrid[r][c].isMine = true;
        minesPlaced++;
      }
    }

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

  const handleCellMouseDown = (e: React.MouseEvent, r: number, c: number) => {
    if (e.button !== 0 || status === 'won' || status === 'lost') return;
    if (!grid[r][c].isRevealed && !grid[r][c].isFlagged) {
      setPressedCell({r, c});
    }
  };

  const handleCellMouseEnter = (r: number, c: number) => {
    if (pressedCell && !grid[r][c].isRevealed && !grid[r][c].isFlagged) {
      setPressedCell({r, c});
    }
  };

  const handleCellMouseLeave = () => {
    if (pressedCell) {
      setPressedCell(null);
    }
  };

  const handleMouseUp = () => {
    setPressedCell(null);
    setSmileyPressed(false);
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
      newGrid[r][c].isRevealed = true;
      setStatus('lost');
      audioManager.play('error');
      newGrid.forEach(row => row.forEach(cell => {
        if (cell.isMine) cell.isRevealed = true;
      }));
      setGrid(newGrid);
      return;
    }

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
      audioManager.play('click');
    } else if (cell.isFlagged) {
      cell.isFlagged = false;
      setMinesLeft(prev => prev + 1);
      audioManager.play('click');
    }

    setGrid(newGrid);
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
    <div 
      className="flex flex-col items-center justify-center p-4 bg-[#bdbdbd] select-none h-full w-full font-sans"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="bg-[#bdbdbd] border-l-[3px] border-t-[3px] border-white border-r-[3px] border-b-[3px] border-[#7b7b7b] p-2 inline-flex flex-col shadow-sm">
        
        {/* Header / HUD */}
        <div className="flex justify-between items-center p-[6px] bg-[#bdbdbd] border-l-[2px] border-t-[2px] border-[#7b7b7b] border-r-[2px] border-b-[2px] border-white mb-[8px] h-[50px]">
          {/* Mine Counter */}
          <div className="bg-black text-[#ff0000] font-mono text-[28px] w-[60px] h-[36px] flex items-center justify-center border-l-[2px] border-t-[2px] border-[#7b7b7b] border-r-[2px] border-b-[2px] border-white leading-none pt-[2px]">
            {formatLedNumber(minesLeft)}
          </div>

          {/* Smiley Reset Button */}
          <button 
            onClick={initGrid}
            onMouseDown={(e) => { if (e.button === 0) setSmileyPressed(true); }}
            className={`
              w-[36px] h-[36px] flex items-center justify-center bg-[#bdbdbd] text-[20px] select-none outline-none pb-[2px]
              ${smileyPressed 
                ? 'border-l-[2px] border-t-[2px] border-[#7b7b7b] border-r-[2px] border-b-[2px] border-[#bdbdbd] bg-[#d3d3d3]' 
                : 'border-l-[2px] border-t-[2px] border-white border-r-[2px] border-b-[2px] border-[#7b7b7b] active:border-l-[2px] active:border-t-[2px] active:border-[#7b7b7b] active:border-r-white active:border-b-white'
              }
            `}
            title="New Game"
          >
            {status === 'won' ? '😎' : status === 'lost' ? '😵' : (pressedCell ? '😮' : '🙂')}
          </button>

          {/* Timer */}
          <div className="bg-black text-[#ff0000] font-mono text-[28px] w-[60px] h-[36px] flex items-center justify-center border-l-[2px] border-t-[2px] border-[#7b7b7b] border-r-[2px] border-b-[2px] border-white leading-none pt-[2px]">
            {formatLedNumber(time)}
          </div>
        </div>

        {/* Grid Area */}
        <div className="bg-[#7b7b7b] border-l-[3px] border-t-[3px] border-[#7b7b7b] border-r-[3px] border-b-[3px] border-white flex flex-col">
          {grid.map((row, r) => (
            <div key={r} className="flex h-[28px]">
              {row.map((cell, c) => {
                const isPressed = pressedCell?.r === r && pressedCell?.c === c;
                return (
                  <div 
                    key={`${r}-${c}`}
                    onMouseDown={(e) => handleCellMouseDown(e, r, c)}
                    onMouseEnter={() => handleCellMouseEnter(r, c)}
                    onMouseLeave={handleCellMouseLeave}
                    onMouseUp={() => revealCell(r, c)}
                    onContextMenu={(e) => toggleFlag(e, r, c)}
                    className={`
                      w-[28px] h-[28px] flex items-center justify-center font-bold text-[18px] select-none
                      ${cell.isRevealed || isPressed
                        ? 'bg-[#bdbdbd] border-r border-b border-[#7b7b7b] border-t border-l border-[#8a8a8a]' 
                        : 'bg-[#bdbdbd] border-t-[2px] border-l-[2px] border-white border-r-[2px] border-b-[2px] border-[#7b7b7b] hover:brightness-105'
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
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
