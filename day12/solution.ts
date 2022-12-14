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
  private visited: string[][];

  static Visited = 'X';
  static Open = '.';

  constructor (grid: string[][]) {
    this.grid = grid;
    this.startPosition = this.getPositionOf('S')!;
    this.endPosition = this.getPositionOf('E')!;
    this.visited = Array.from({ length: grid.length }, (_, i) => Array.from({ length: grid[i].length }, () => Solution.Open));
  }

  public solvePartOne() {
    this.travel(this.startPosition);

    this.drawVisited();

    return this.calculatePath()
  }

  public drawVisited() {  
    return this.visited.forEach((row) => {
      console.log(row.join(' '));
    });
  }

  private calculatePath () {
    let length = 0;
    for (const row of this.visited) {
      length += row.filter((c) => ['^', 'v', '<', '>'].includes(c)).length;
    }

    return length;
  }

  private travel (position: number[]) {
    if (!this.isValidMove(position)) {
      return false;
    }

    if (this.isEnd(position)) {
      this.visited[position[0]][position[1]] = this.getDirection(position);
      return true;
    } else {
      this.visited[position[0]][position[1]] = Solution.Visited;
    }

    const moves = (this.getAvailableMoves(position) as number[][])
      .sort(this.distanceComparator);

    for (const move of moves) {
      const [row, col] = move;
      if (this.travel(move)) {
        this.visited[row][col] = this.getDirection(move);
        return true;
      }
    }

    return false;
  }

  private distanceComparator = (a: number[], b: number[]) => {
    const aDistance = this.getDistance(a, this.endPosition) - this.getDistance(a, this.startPosition);
    const bDistance = this.getDistance(b, this.endPosition) - this.getDistance(b, this.startPosition);

    return aDistance - bDistance;
  }

  private getDistance (pos1: number[], pos2: number[]) {
    const dx = pos1[0] - pos2[0];
    const dy = pos1[1] - pos2[1];
  
    return Math.sqrt(dx * dx + dy * dy);
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

  private isValidMove(atPosition: number[]) {
    return this.visited[atPosition[0]][atPosition[1]] === Solution.Open;
  }

  private getDirection (move: number[]) {
    const [_r, _c, dirCode] = move;
    switch (dirCode) {
      case 101: return '^';
      case 102: return 'v';
      case 103: return '<';
      case 104: return '>';
    }

    return '?';
  }

  private getAvailableMoves = (currentPosition: number[]) => {
    const [row, col] = currentPosition;
  
    const up = row > 0 ? [row - 1, col, 101] : null;
    const down = row < this.grid.length - 1 ? [row + 1, col, 102] : null;
    const left = col > 0 ? [row, col - 1, 103] : null;
    const right = col < this.grid[row].length - 1 ? [row, col + 1, 104] : null;
  
    const signAtCurrentPosition = this.grid[row][col];
    const currentElevation = this.getElevation(signAtCurrentPosition);
  
    return [up, down, left, right].filter((move) => {
      if (move === null) return false;
  
      const [r, c] = move;
      if (this.visited[r][c] !== Solution.Open) return false;
      if (r === this.startPosition[0] && c === this.startPosition[1]) return false;

      const sign = this.grid[r][c];
      const elevationAtMove = this.getElevation(sign);
  
      const diff = elevationAtMove - currentElevation;
      if (diff > 1) return false;
  
      return true;
    });
  };
}

const solvePartOne = async () => {
  const input = await getInput();

  const solution = new Solution(input);

  return solution.solvePartOne();
};

(async () => {
  console.log(`1. ${await solvePartOne()}`);
})();
