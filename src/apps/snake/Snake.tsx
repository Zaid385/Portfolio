import { useEffect, useRef, useState } from 'react';
import { audioManager } from '../../audio/audio-manager';

interface SnakeProps {
  windowId: string;
  isFocused?: boolean;
  isMinimized?: boolean;
}

const GRID_SIZE = 20;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export function Snake({ windowId: _windowId, isFocused, isMinimized }: SnakeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const dirRef = useRef<Direction>('RIGHT');
  const nextDirRef = useRef<Direction>('RIGHT');
  const foodRef = useRef<Point>({ x: 15, y: 10 });
  const speedRef = useRef(INITIAL_SPEED);
  const lastTickRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  
  const isPaused = isMinimized || !isFocused;

  const spawnFood = (snake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE))
      };
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    foodRef.current = newFood;
  };

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    dirRef.current = 'RIGHT';
    nextDirRef.current = 'RIGHT';
    speedRef.current = INITIAL_SPEED;
    setScore(0);
    setGameOver(false);
    setHasStarted(true);
    spawnFood(snakeRef.current);
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
  }, [isFocused, gameOver, hasStarted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = (timestamp: number) => {
      if (!lastTickRef.current) lastTickRef.current = timestamp;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const snake = snakeRef.current;
      const food = foodRef.current;

      ctx.fillStyle = '#ff0000';
      ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);

      snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#00ff00' : '#00cc00';
        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
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
            newHead.x < 0 || newHead.x >= CANVAS_WIDTH / GRID_SIZE ||
            newHead.y < 0 || newHead.y >= CANVAS_HEIGHT / GRID_SIZE ||
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
              spawnFood(snake);
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
  }, [gameOver, hasStarted, isPaused, score]);

  return (
    <div className="flex flex-col w-full h-full bg-[#ece9d8] font-['Tahoma'] select-none">
      <div className="flex justify-between items-center px-2 py-1 bg-gradient-to-b from-[#f2f2f2] to-[#d4d0c8] border-b border-[#a0a0a0] text-sm">
        <div>
          <span className="font-bold mr-2">Score:</span>
          <span>{score}</span>
        </div>
        <button 
          onClick={resetGame}
          className="px-3 py-[2px] bg-[#ece9d8] border border-[#716f64] rounded hover:bg-[#c1d2ee] active:bg-[#98b4e2] shadow-[1px_1px_0_white_inset]"
        >
          {hasStarted && !gameOver ? 'Restart' : 'New Game'}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-600 relative overflow-hidden shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)]">
        <canvas 
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="bg-black shadow-[0_0_10px_rgba(0,0,0,1)]"
        />
        
        {(!hasStarted || gameOver) && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white font-bold p-4 text-center">
            {gameOver ? (
              <>
                <h2 className="text-3xl mb-2 text-red-500 text-shadow-md">GAME OVER</h2>
                <p className="text-lg mb-6">Final Score: {score}</p>
                <button 
                  onClick={resetGame}
                  className="px-6 py-2 bg-[#ece9d8] text-black border border-[#716f64] rounded hover:bg-[#c1d2ee] active:bg-[#98b4e2] shadow-[1px_1px_0_white_inset]"
                >
                  Play Again (Enter)
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl mb-4 text-[#00ff00] text-shadow-md">SNAKE</h2>
                <p className="text-sm mb-2 text-gray-300">Use Arrow Keys or WASD to move.</p>
                <p className="text-sm mb-6 text-gray-300">Eat the red food to grow.</p>
                <button 
                  onClick={resetGame}
                  className="px-6 py-2 bg-[#ece9d8] text-black border border-[#716f64] rounded hover:bg-[#c1d2ee] active:bg-[#98b4e2] shadow-[1px_1px_0_white_inset]"
                >
                  Start Game
                </button>
              </>
            )}
          </div>
        )}
        
        {isPaused && hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
            <h2 className="text-2xl font-bold tracking-widest text-shadow-md">PAUSED</h2>
          </div>
        )}
      </div>
    </div>
  );
}
