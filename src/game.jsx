import React, { useState, useEffect } from 'react';

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [food, setFood] = useState(generateFoodPosition());
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateSnake();
    }, 100);

    return () => clearInterval(interval);
  }, [snake, food, direction, isGameOver]);

  useEffect(() => {
    const handleGameOver = () => {
      setIsGameOver(false);
    };

    if (isGameOver) {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleGameOver);
    };
  }, [isGameOver]);

  function handleKeyDown(event) {
    switch (event.key) {
      case 'ArrowUp':
        if (direction.y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        if (direction.y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        if (direction.x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        if (direction.x !== -1) setDirection({ x: 1, y: 0 });
        break;
      default:
        break;
    }
  }

  function generateFoodPosition() {
    let newFood;
    do {
      newFood = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
    } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }

  const updateSnake = () => {
    if (isGameOver) return;

    const newSnake = [...snake];
    const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
      setIsGameOver(false);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(generateFoodPosition());
      setScore(score + 1);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        let cellClass = '';
        if (snake.some((segment) => segment.x === x && segment.y === y)) {
          cellClass = 'snake';
        } else if (food.x === x && food.y === y) {
          cellClass = 'food';
        } else {
          cellClass = 'cell';
        }
        grid.push(<div key={`${x}-${y}`} className={cellClass} />);
      }
    }
    return grid;
  };

  return (
    
    <div className="game-container">
      <div className="game-board">{renderGrid()}</div>
    </div>
  );
};

export default SnakeGame;

