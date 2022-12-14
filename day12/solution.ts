import fs from 'fs/promises';
import path from 'path';

type SolutionGrid = string[][];

const getInput = async (): Promise<SolutionGrid> => {
  const input = await fs.readFile(path.join(__dirname, './input.txt'), 'utf8');
  return input.split(/\n/g).map((s) => s.split(''));
};

class Solution {
  private grid: string[][];
  private startPosition: number[];
  private endPosition: number[];
  private distances: number[][];

  constructor (grid: string[][]) {
    this.grid = grid;
    this.startPosition = this.getPositionOf('S')!;
    this.endPosition = this.getPositionOf('E')!;
    this.distances = Array.from({ length: grid.length }, (_, i) => Array.from({ length: grid[i].length }, () => Number.MAX_VALUE));
    this.distances[this.startPosition[0]][this.startPosition[1]] = 0;
  }

  public solvePartOne() {
    const toCheck = [[...this.startPosition, 0]];
    const result = this.climb(toCheck);
    
    return result;
  }

  public solvePartTwo() {
    this.grid[this.startPosition[0]][this.startPosition[1]] = 'a';

    const possibleStarts = this.grid.reduce((memo: number[][], current, row) => {
      current.forEach((value, col) => {
        if (value === 'a') {
          memo.push([row, col, 0]);
        }
      });

      return memo;
    }, []);

    const results: number[] = [];
    possibleStarts.forEach((startingPoint) => {
      this.reset(startingPoint);
      results.push(this.climb([startingPoint]) ?? Number.MAX_VALUE);
    });

    results.sort((a, b) => a - b);

    return results[0];
  }

  private reset (startPosition: number[]) {
    this.grid[this.startPosition[0]][this.startPosition[1]] = 'a';
    this.startPosition = startPosition;
    this.distances = Array.from({ length: this.grid.length }, (_, i) => Array.from({ length: this.grid[i].length }, () => Number.MAX_VALUE));
    this.distances[this.startPosition[0]][this.startPosition[1]] = 0;
  }

  private climb = (toCheck: number[][]) => {
    while (toCheck.length > 0) {
      const [row, col, distance] = toCheck.shift()!;

      if (this.isEnd([row, col])) {
        this.distances[row][col] = distance;
        return this.distances[row][col];
      }

      (<number[][]>this.getAvailableMoves([row, col])).forEach(([r, c]) => {
        if (this.distances[r][c] === Number.MAX_VALUE) {
          this.distances[r][c] = distance + 1;
          toCheck.push([r, c, distance + 1]);
        }
      });
    }
  };

  private getElevation (sign: string) {
    let str;
    switch (sign) {
      case 'S': {
        str = 'a';
        break;
      }
      case 'E': {
        str = 'z';
        break;
      }
      default: str = sign;
    }
  
    return 1 + parseInt(str, 36) - 10;
  };

  private getPositionOf = (character: string) => {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j] === character) return [i, j];
      }
    }
  };

  private isEnd(atPosition: number[]) {
    return atPosition[0] === this.endPosition[0] && atPosition[1] === this.endPosition[1];
  }

  private getAvailableMoves = (currentPosition: number[]) => {
    const [row, col] = currentPosition;
  
    const up = row > 0 ? [row - 1, col] : null;
    const down = row < this.grid.length - 1 ? [row + 1, col] : null;
    const left = col > 0 ? [row, col - 1] : null;
    const right = col < this.grid[row].length - 1 ? [row, col + 1] : null;
  
    const signAtCurrentPosition = this.grid[row][col];
    const currentElevation = this.getElevation(signAtCurrentPosition);
  
    return [up, down, left, right].filter((move) => {
      if (move === null) return false;
  
      const [r, c] = move;
      const sign = this.grid[r][c];
      const elevationAtMove = this.getElevation(sign);
  
      const diff = elevationAtMove - currentElevation;
      if (diff > 1) return false;
  
      return true;
    });
  };
}


(async () => {
  const input = await getInput();

  const s1 = new Solution([...input]);
  console.log(`1. ${s1.solvePartOne()}`);

  const s2 = new Solution([...input]);
  console.log(`2. ${s2.solvePartTwo()}`);
})();
