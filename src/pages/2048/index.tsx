import { useEffect, useState, useRef, useCallback } from 'react';
import { useWindowSize } from 'react-use';
import G2048 from './g2048';
import styles from './index.module.less';

interface Tile {
  id: string;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
}

export default function Component() {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const [gameSize, setGameSize] = useState<number>(4);
  const [game, setGame] = useState<G2048 | null>(null);
  const [score, setScore] = useState<number>(0);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [continueAfterWin, setContinueAfterWin] = useState<boolean>(false);
  
  // Touch handling states
  const touchStartRef = useRef<{ x: number; y: number; } | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize game
  useEffect(() => {
    const boardSize = Math.min(windowWidth, windowHeight) > 600 ? 4 : 4;
    const newGame = new G2048({ width: boardSize, winTile: 2048 });
    
    setGame(newGame);
    setGameSize(boardSize);
    updateGameState(newGame);
  }, []);
  
  // Transform grid data into tile objects with unique IDs
  const updateGameState = useCallback((gameInstance: G2048) => {
    if (!gameInstance) return;
    
    const gameState = gameInstance.getGameState();
    setScore(gameState.score);
    setIsGameOver(gameState.isGameOver);
    
    if (gameState.hasWon && !hasWon && !continueAfterWin) {
      setHasWon(true);
    }
    
    const newTiles: Tile[] = [];
    let tileId = 0;
    
    // Convert grid to tiles with position data
    gameState.grid.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value !== 0) {
          // Try to find existing tile at this position
          const existingTileIndex = tiles.findIndex(
            tile => tile.row === rowIndex && tile.col === colIndex && tile.value === value
          );
          
          if (existingTileIndex !== -1) {
            // Keep existing tile's ID for continuity
            newTiles.push({
              ...tiles[existingTileIndex],
              isNew: false,
              isMerged: false
            });
          } else {
            // Check if this might be a merged tile
            const possibleMergedTiles = tiles.filter(
              tile => (tile.row === rowIndex && tile.col === colIndex)
            );
            
            const isMerged = possibleMergedTiles.length > 1;
            
            // New tile or merged result
            newTiles.push({
              id: `tile-${Date.now()}-${tileId++}`,
              value,
              row: rowIndex,
              col: colIndex,
              isNew: possibleMergedTiles.length === 0,
              isMerged
            });
          }
        }
      });
    });

    setTiles(newTiles);
  }, [tiles, hasWon, continueAfterWin]);

  // Reset game
  const resetGame = () => {
    if (game) {
      game.reset();
      updateGameState(game);
      setHasWon(false);
      setContinueAfterWin(false);
    }
  };
  
  // Continue playing after winning
  const continueGame = () => {
    setContinueAfterWin(true);
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!game || (hasWon && !continueAfterWin)) return;
      
      let direction: 'up' | 'down' | 'left' | 'right' | null = null;
      
      switch (event.key) {
        case 'ArrowUp':
          direction = 'up';
          break;
        case 'ArrowDown':
          direction = 'down';
          break;
        case 'ArrowLeft':
          direction = 'left';
          break;
        case 'ArrowRight':
          direction = 'right';
          break;
        default:
          return;
      }
      
      if (direction) {
        event.preventDefault();
        const moved = game.move(direction);
        if (moved) {
          updateGameState(game);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game, hasWon, continueAfterWin, updateGameState]);

  // Handle touch input
  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      if (!game || (hasWon && !continueAfterWin)) return;
      
      const touch = event.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY
      };
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!game || !touchStartRef.current || (hasWon && !continueAfterWin)) return;
      
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const threshold = 30; // Minimum swipe distance
      
      // Determine the direction of the swipe
      let direction: 'up' | 'down' | 'left' | 'right' | null = null;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > threshold) {
          direction = deltaX > 0 ? 'right' : 'left';
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > threshold) {
          direction = deltaY > 0 ? 'down' : 'up';
        }
      }
      
      if (direction) {
        event.preventDefault();
        const moved = game.move(direction);
        if (moved) {
          updateGameState(game);
        }
      }
      
      touchStartRef.current = null;
    };

    const gameElement = gameContainerRef.current;
    if (gameElement) {
      gameElement.addEventListener('touchstart', handleTouchStart, { passive: false });
      gameElement.addEventListener('touchend', handleTouchEnd, { passive: false });
    }
    
    return () => {
      if (gameElement) {
        gameElement.removeEventListener('touchstart', handleTouchStart);
        gameElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [game, hasWon, continueAfterWin, updateGameState]);

  // Generate tile elements
  const renderTiles = () => {
    return tiles.map((tile) => {
      const tileClass = `${styles.tile} ${styles[`tile-${tile.value}`]} ${
        tile.isNew ? styles.tileNew : ''
      } ${tile.isMerged ? styles.tileMerged : ''}`;
      
      return (
        <div
          key={tile.id}
          className={tileClass}
          style={{
            top: `calc(${tile.row * 25}% + 10px)`,
            left: `calc(${tile.col * 25}% + 10px)`,
            width: 'calc(25% - 20px)',
            height: 'calc(25% - 20px)'
          }}
        >
          {tile.value}
        </div>
      );
    });
  };

  // Generate grid cells
  const renderGrid = () => {
    const cells = [];
    for (let row = 0; row < gameSize; row++) {
      for (let col = 0; col < gameSize; col++) {
        cells.push(
          <div key={`cell-${row}-${col}`} className={styles.gridCell}></div>
        );
      }
    }
    return cells;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>2048</div>
        <div className={styles.scores}>
          <div className={styles.scoreBox}>
            <div className={styles.scoreLabel}>SCORE</div>
            <div className={styles.scoreValue}>{score}</div>
          </div>
        </div>
        <div className={styles.intro}>
          Join the tiles, get to <strong>2048!</strong>
          <br />
          Use <strong>arrow keys</strong> or <strong>swipe</strong> to move tiles.
        </div>
        <button className={styles.resetButton} onClick={resetGame}>
          New Game
        </button>
      </div>

      <div 
        className={styles.gameContainer} 
        ref={gameContainerRef}
      >
        <div className={styles.gridContainer}>
          {renderGrid()}
        </div>

        <div className={styles.tileContainer}>
          {renderTiles()}
        </div>

        {isGameOver && (
          <div className={styles.gameMessage}>
            <div className={styles.messageContent}>
              <p>Game over!</p>
              <button className={styles.retryButton} onClick={resetGame}>
                Try again
              </button>
            </div>
          </div>
        )}

        {hasWon && !continueAfterWin && (
          <div className={styles.gameMessage}>
            <div className={styles.messageContent}>
              <p>You win!</p>
              <div className={styles.messageButtons}>
                <button className={styles.retryButton} onClick={resetGame}>
                  Start Over
                </button>
                <button className={styles.continueButton} onClick={continueGame}>
                  Keep going
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}