import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, Play, RotateCcw, Cpu } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 80;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const directionRef = useRef(direction);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
    gameContainerRef.current?.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameOver) resetGame();
        else setIsPaused(p => !p);
        return;
      }

      if (isPaused || gameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, gameOver]);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const currentDir = directionRef.current;
        const newHead = {
          x: head.x + currentDir.x,
          y: head.y + currentDir.y
        };

        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        setDirection(currentDir);
        return newSnake;
      });
    };

    const speed = Math.max(30, BASE_SPEED - Math.floor(score / 50) * 5);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [isPaused, gameOver, food, score, highScore, generateFood]);

  return (
    <div 
      className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto outline-none"
      tabIndex={0}
      ref={gameContainerRef}
    >
      <div className="flex justify-between w-full px-4 py-2 bg-black border-2 border-cyan-500">
        <div className="flex items-center gap-3">
          <Cpu className="w-8 h-8 text-cyan-400" />
          <div className="text-cyan-400 text-2xl font-bold tracking-wider uppercase">
            MEM: <span className="text-magenta-500">{score.toString().padStart(4, '0')}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-cyan-400 text-2xl font-bold tracking-wider uppercase">
          <Trophy className="w-8 h-8 text-magenta-500" />
          <span>MAX: <span className="text-magenta-500">{highScore.toString().padStart(4, '0')}</span></span>
        </div>
      </div>

      <div className="relative bg-black border-4 border-magenta-500 p-1 w-full max-w-[500px] overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
        <div 
          className="grid w-full h-full bg-gray-800 gap-[1px]"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const snakeIdx = snake.findIndex(s => s.x === x && s.y === y);
            const isSnakeHead = snakeIdx === 0;
            const isSnakeBody = snakeIdx > 0;
            const isFood = food.x === x && food.y === y;

            let classes = "w-full h-full ";

            if (isSnakeHead) {
              classes += "bg-cyan-300";
            } else if (isSnakeBody) {
              classes += "bg-cyan-500";
            } else if (isFood) {
              classes += "bg-magenta-500 animate-pulse";
            } else {
              classes += "bg-black";
            }

            return (
              <div 
                key={i} 
                className={classes}
              />
            );
          })}
        </div>

        {(isPaused || gameOver) && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 p-4">
            {gameOver ? (
              <div className="text-center">
                <h2 className="text-4xl sm:text-6xl font-black text-magenta-500 mb-2 tracking-widest uppercase glitch" data-text="FATAL_ERROR">FATAL_ERROR</h2>
                <p className="text-cyan-400 mb-8 text-xl sm:text-2xl uppercase">SECTORS CORRUPTED: {score}</p>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-3 mx-auto px-6 py-3 sm:px-8 sm:py-4 bg-black text-cyan-400 border-4 border-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors font-bold tracking-widest text-xl sm:text-2xl uppercase"
                >
                  <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8" />
                  REBOOT_SYS
                </button>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-3xl sm:text-5xl font-black text-cyan-400 mb-8 tracking-widest uppercase glitch" data-text="AWAITING_INPUT">AWAITING_INPUT</h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="flex items-center gap-3 mx-auto px-6 py-3 sm:px-8 sm:py-4 bg-black text-magenta-500 border-4 border-magenta-500 hover:bg-magenta-500 hover:text-black transition-colors font-bold tracking-widest text-xl sm:text-2xl uppercase"
                >
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
                  INITIATE
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
