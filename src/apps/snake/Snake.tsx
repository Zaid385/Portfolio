import { useEffect, useRef, useState } from 'react';
import { audioManager } from '../../audio/audio-manager';

interface SnakeProps {
  windowId: string;
  isFocused?: boolean;
  isMinimized?: boolean;
}

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const INITIAL_SPEED = 150;

export function Snake({ windowId: _windowId, isFocused, isMinimized }: SnakeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const snakeRef = useRef<Point[]>([{ x: 5, y: 5 }]);
  const dirRef = useRef<Direction>('RIGHT');
  const nextDirRef = useRef<Direction>('RIGHT');
  const foodRef = useRef<Point>({ x: 10, y: 5 });
  const speedRef = useRef(INITIAL_SPEED);
  const lastTickRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  
  const isPaused = isMinimized || !isFocused;

  // Calculate GRID_SIZE based on available space to maintain reasonable cell sizes
  const GRID_SIZE = Math.max(15, Math.floor(Math.min(dimensions.width, dimensions.height) / 25));

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const spawnFood = (snake: Point[], canvasW: number, canvasH: number, gridSize: number) => {
    let newFood: Point;
    const cols = Math.floor(canvasW / gridSize);
    const rows = Math.floor(canvasH / gridSize);
    
    // Fallback if dimensions are too small
    if (cols === 0 || rows === 0) {
      foodRef.current = { x: 0, y: 0 };
      return;
    }

    while (true) {
      newFood = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows)
      };
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    foodRef.current = newFood;
  };

  const resetGame = () => {
    snakeRef.current = [{ x: 5, y: 5 }];
    dirRef.current = 'RIGHT';
    nextDirRef.current = 'RIGHT';
    speedRef.current = INITIAL_SPEED;
    setScore(0);
    setGameOver(false);
    setHasStarted(true);
    spawnFood(snakeRef.current, dimensions.width, dimensions.height, GRID_SIZE);
    lastTickRef.current = performance.now();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused) return;
      if (gameOver && e.key === 'Enter') {
        resetGame();
        return;
      }
      if (!hasStarted && (e.key.startsWith('Arrow') || ['w','a','s','d'].includes(e.key.toLowerCase()))) {
        resetGame();
      }

      const currentDir = dirRef.current;
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          e.preventDefault();
          if (currentDir !== 'DOWN') nextDirRef.current = 'UP';
          break;
        case 'arrowdown':
        case 's':
          e.preventDefault();
          if (currentDir !== 'UP') nextDirRef.current = 'DOWN';
          break;
        case 'arrowleft':
        case 'a':
          e.preventDefault();
          if (currentDir !== 'RIGHT') nextDirRef.current = 'LEFT';
          break;
        case 'arrowright':
        case 'd':
          e.preventDefault();
          if (currentDir !== 'LEFT') nextDirRef.current = 'RIGHT';
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, gameOver, hasStarted, dimensions, GRID_SIZE]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = (timestamp: number) => {
      if (!lastTickRef.current) lastTickRef.current = timestamp;

      // Draw dark background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Draw subtle grid lines
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 1;
      const cols = Math.floor(dimensions.width / GRID_SIZE);
      const rows = Math.floor(dimensions.height / GRID_SIZE);
      
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, dimensions.height);
        ctx.stroke();
      }
      for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(dimensions.width, i * GRID_SIZE);
        ctx.stroke();
      }

      const snake = snakeRef.current;
      const food = foodRef.current;

      // Draw food (glow + bright red)
      const foodCenterX = food.x * GRID_SIZE + GRID_SIZE / 2;
      const foodCenterY = food.y * GRID_SIZE + GRID_SIZE / 2;
      const radius = (GRID_SIZE / 2) - 2;

      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
      ctx.fillStyle = '#ff2222';
      ctx.beginPath();
      ctx.arc(foodCenterX, foodCenterY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw snake
      snake.forEach((segment, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? '#4ade80' : '#22c55e'; // brighter green for head, slightly darker for body
        
        const x = segment.x * GRID_SIZE + 1; // 1px gap
        const y = segment.y * GRID_SIZE + 1;
        const size = GRID_SIZE - 2;

        if (ctx.roundRect) {
          ctx.beginPath();
          ctx.roundRect(x, y, size, size, isHead ? 4 : 2);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, size, size);
        }
      });

      if (hasStarted && !gameOver && !isPaused) {
        if (timestamp - lastTickRef.current >= speedRef.current) {
          dirRef.current = nextDirRef.current;
          const head = snake[0];
          const newHead = { ...head };

          switch (dirRef.current) {
            case 'UP': newHead.y -= 1; break;
            case 'DOWN': newHead.y += 1; break;
            case 'LEFT': newHead.x -= 1; break;
            case 'RIGHT': newHead.x += 1; break;
          }

          if (
            newHead.x < 0 || newHead.x >= cols ||
            newHead.y < 0 || newHead.y >= rows ||
            snake.some(s => s.x === newHead.x && s.y === newHead.y)
          ) {
            setGameOver(true);
            audioManager.play('snake-gameover');
          } else {
            snake.unshift(newHead);
            if (newHead.x === food.x && newHead.y === food.y) {
              setScore(s => s + 10);
              audioManager.play('snake-eat');
              speedRef.current = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 5);
              spawnFood(snake, dimensions.width, dimensions.height, GRID_SIZE);
            } else {
              snake.pop();
            }
          }
          lastTickRef.current = timestamp;
        }
      }

      rafRef.current = requestAnimationFrame(gameLoop);
    };

    rafRef.current = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(rafRef.current);
  }, [gameOver, hasStarted, isPaused, score, dimensions, GRID_SIZE]);

  return (
    <div className="flex flex-col w-full h-full bg-[#ece9d8] font-['Tahoma'] select-none">
      {/* XP Style Toolbar / Header */}
      <div className="flex justify-between items-center px-3 py-2 bg-gradient-to-b from-[#f2f2f2] to-[#d4d0c8] border-b border-[#a0a0a0] text-sm shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="flex items-center text-black">
          <span className="font-bold mr-2 text-[#333]">Score:</span>
          <span className="bg-white border border-[#7f9db9] px-2 py-0.5 min-w-[60px] text-right shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)] font-mono text-[13px]">
            {score}
          </span>
        </div>
        <button 
          onClick={resetGame}
          className="px-4 py-[3px] bg-[#ece9d8] border border-[#716f64] rounded hover:bg-[#c1d2ee] hover:border-[#316ac5] active:bg-[#98b4e2] transition-colors shadow-[1px_1px_0_white_inset]"
        >
          {hasStarted && !gameOver ? 'Restart' : 'New Game'}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center bg-[#808080] relative shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] overflow-hidden">
        <div ref={containerRef} className="w-full h-full relative">
          <canvas 
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="block"
          />
          
          {(!hasStarted || gameOver) && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white font-bold p-4 text-center backdrop-blur-sm">
              {gameOver ? (
                <>
                  <h2 className="text-4xl mb-3 text-red-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wider">GAME OVER</h2>
                  <p className="text-xl mb-8 text-gray-200">Final Score: <span className="text-[#4ade80]">{score}</span></p>
                  <button 
                    onClick={resetGame}
                    className="px-8 py-3 bg-gradient-to-b from-[#ece9d8] to-[#d4d0c8] text-black border border-[#716f64] rounded hover:from-[#c1d2ee] hover:to-[#98b4e2] active:from-[#98b4e2] active:to-[#c1d2ee] shadow-[1px_1px_0_white_inset,0_2px_4px_rgba(0,0,0,0.3)] transition-all font-bold text-lg"
                  >
                    Play Again (Enter)
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl mb-6 text-[#4ade80] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-widest">SNAKE</h2>
                  <div className="space-y-2 mb-8 text-gray-300 bg-black/40 p-4 rounded-lg border border-gray-700">
                    <p>Use <span className="text-white font-mono bg-gray-800 px-1 rounded">Arrow Keys</span> or <span className="text-white font-mono bg-gray-800 px-1 rounded">WASD</span> to move.</p>
                    <p>Eat the glowing red food to grow.</p>
                  </div>
                  <button 
                    onClick={resetGame}
                    className="px-8 py-3 bg-gradient-to-b from-[#ece9d8] to-[#d4d0c8] text-black border border-[#716f64] rounded hover:from-[#c1d2ee] hover:to-[#98b4e2] active:from-[#98b4e2] active:to-[#c1d2ee] shadow-[1px_1px_0_white_inset,0_2px_4px_rgba(0,0,0,0.3)] transition-all font-bold text-lg"
                  >
                    Start Game
                  </button>
                </>
              )}
            </div>
          )}
          
          {isPaused && hasStarted && !gameOver && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white backdrop-blur-sm">
              <h2 className="text-3xl font-bold tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">PAUSED</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
