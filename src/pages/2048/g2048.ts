interface GridType {
  grid: number[][];
}

interface GameState {
  grid: number[][];
  score: number;
  isGameOver: boolean;
  hasWon: boolean;
  hasMoved: boolean;
}

interface MoveResult {
  hasMoved: boolean;
  mergeScore: number;
}

interface IConfig {
  width: number;
  winTile?: number;
}

type Direction = 'up' | 'down' | 'left' | 'right';

export default class G2048 {
  config: IConfig;
  grid: number[][];
  score: number;
  isGameOver: boolean;
  hasWon: boolean;
  winTile: number;
  
  constructor(config: IConfig) {
    this.config = config;
    this.winTile = config.winTile || 2048;
    this.reset();
  }

  init() {
    this.reset();
  }

  reset() {
    const { width } = this.config;
    this.grid = Array(width).fill(0).map(() => Array(width).fill(0));
    this.score = 0;
    this.isGameOver = false;
    this.hasWon = false;
    
    // Add two initial tiles
    this.addRandomTile();
    this.addRandomTile();
  }

  getGameState(): GameState {
    return {
      grid: this.getGridCopy(),
      score: this.score,
      isGameOver: this.isGameOver,
      hasWon: this.hasWon,
      hasMoved: true
    };
  }

  getGridCopy(): number[][] {
    return this.grid.map(row => [...row]);
  }

  /**
   * Add a new tile (2 or 4) to a random empty cell
   * @returns Position and value of the new tile, or null if no empty cell
   */
  addRandomTile(): { x: number, y: number, value: number } | null {
    const emptyCells = this.getEmptyCells();
    
    if (emptyCells.length === 0) {
      return null;
    }
    
    const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    // 90% chance for 2, 10% chance for 4
    const value = Math.random() < 0.9 ? 2 : 4;
    
    this.grid[y][x] = value;
    
    return { x, y, value };
  }

  getEmptyCells(): { x: number, y: number }[] {
    const emptyCells: { x: number, y: number }[] = [];
    
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.grid[y][x] === 0) {
          emptyCells.push({ x, y });
        }
      }
    }
    
    return emptyCells;
  }

  move(direction: Direction): boolean {
    if (this.isGameOver || this.hasWon) {
      return false;
    }

    // Store previous grid state to check if anything changed
    const previousGrid = this.getGridCopy();
    let result: MoveResult = { hasMoved: false, mergeScore: 0 };

    switch (direction) {
      case 'up':
        result = this.moveUp();
        break;
      case 'down':
        result = this.moveDown();
        break;
      case 'left':
        result = this.moveLeft();
        break;
      case 'right':
        result = this.moveRight();
        break;
    }

    // If tiles moved, add a new random tile
    if (result.hasMoved) {
      this.score += result.mergeScore;
      this.addRandomTile();
      
      // Check win/lose conditions
      this.checkWinCondition();
      if (!this.hasWon) {
        this.checkGameOverCondition();
      }
    }

    return result.hasMoved;
  }

  moveLeft(): MoveResult {
    return this.moveHorizontal(true);
  }

  moveRight(): MoveResult {
    return this.moveHorizontal(false);
  }

  moveUp(): MoveResult {
    return this.moveVertical(true);
  }

  moveDown(): MoveResult {
    return this.moveVertical(false);
  }

  moveHorizontal(toLeft: boolean): MoveResult {
    let hasMoved = false;
    let mergeScore = 0;
    
    for (let y = 0; y < this.grid.length; y++) {
      const row = [...this.grid[y]];
      const { newLine, score, moved } = this.processSingleLine(row, toLeft);
      
      if (moved) {
        hasMoved = true;
        mergeScore += score;
        this.grid[y] = newLine;
      }
    }
    
    return { hasMoved, mergeScore };
  }

  moveVertical(toTop: boolean): MoveResult {
    let hasMoved = false;
    let mergeScore = 0;
    const size = this.grid.length;
    
    for (let x = 0; x < size; x++) {
      // Extract column as an array
      const column = [];
      for (let y = 0; y < size; y++) {
        column.push(this.grid[y][x]);
      }
      
      const { newLine, score, moved } = this.processSingleLine(column, toTop);
      
      if (moved) {
        hasMoved = true;
        mergeScore += score;
        
        // Put the processed column back into the grid
        for (let y = 0; y < size; y++) {
          this.grid[y][x] = newLine[y];
        }
      }
    }
    
    return { hasMoved, mergeScore };
  }

  /**
   * Process a single line (row or column) according to 2048 rules
   */
  processSingleLine(line: number[], toStart: boolean): { newLine: number[], score: number, moved: boolean } {
    // Remove zeros and compress the line
    const nonZeroTiles = line.filter(tile => tile !== 0);
    
    if (nonZeroTiles.length === 0) {
      return { newLine: [...line], score: 0, moved: false };
    }
    
    // If we're processing right-to-left or bottom-to-top, reverse the array
    if (!toStart) {
      nonZeroTiles.reverse();
    }
    
    const result: number[] = [];
    let score = 0;
    let index = 0;
    
    while (index < nonZeroTiles.length) {
      const current = nonZeroTiles[index];
      
      // Check if the next tile is the same, if so merge them
      if (index < nonZeroTiles.length - 1 && current === nonZeroTiles[index + 1]) {
        const mergedValue = current * 2;
        result.push(mergedValue);
        score += mergedValue;
        index += 2; // Skip the next tile since we merged it
      } else {
        result.push(current);
        index++;
      }
    }
    
    // Fill the rest of the line with zeros
    while (result.length < line.length) {
      result.push(0);
    }
    
    // If we were processing in reverse, reverse the result back
    if (!toStart) {
      result.reverse();
    }
    
    // Check if the line has changed
    const moved = !line.every((value, index) => value === result[index]);
    
    return { newLine: result, score, moved };
  }

  checkWinCondition(): void {
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.grid[y][x] >= this.winTile) {
          this.hasWon = true;
          return;
        }
      }
    }
  }

  checkGameOverCondition(): void {
    // If there are empty cells, the game is not over
    if (this.getEmptyCells().length > 0) {
      this.isGameOver = false;
      return;
    }
    
    // Check if any adjacent cells have the same value (horizontal)
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length - 1; x++) {
        if (this.grid[y][x] === this.grid[y][x + 1]) {
          this.isGameOver = false;
          return;
        }
      }
    }
    
    // Check if any adjacent cells have the same value (vertical)
    for (let y = 0; y < this.grid.length - 1; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.grid[y][x] === this.grid[y + 1][x]) {
          this.isGameOver = false;
          return;
        }
      }
    }
    
    // No moves left, game over
    this.isGameOver = true;
  }

  canMove(): boolean {
    // If there are empty cells or the player has already won, movement is possible
    if (this.getEmptyCells().length > 0 || this.hasWon) {
      return true;
    }

    // Check if any adjacent cells have the same value (horizontal)
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length - 1; x++) {
        if (this.grid[y][x] === this.grid[y][x + 1]) {
          return true;
        }
      }
    }
    
    // Check if any adjacent cells have the same value (vertical)
    for (let y = 0; y < this.grid.length - 1; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.grid[y][x] === this.grid[y + 1][x]) {
          return true;
        }
      }
    }
    
    return false;
  }
}