import fs from 'fs/promises';
import path from 'path';

const getInput = async () => {
  const input = await fs.readFile(path.join(__dirname, './input.txt'), 'utf8');
  const lines = input.split(/\n/g);

  return lines.reduce((memo: any[], line: string) => {
    const tokens = line.split(' -> ');
    const value = tokens.map((token) => token.split(',').map(Number));

    memo.push(value);

    return memo;
  }, []);
}

enum Marker {
  Air = '.',
  Rock = '#',
  Start = '+',
  Sand = 'o'
}

class Solution {
  private grid?: string[][];
  private horizontalModifier!: number;
  private verticalModifier!: number;

  public async solvePartOne() {
   const { startingX, startingY } = await this.prepareGrid(0, false);

    let count = 0;
    while (this.drawSand([startingX, startingY])) {
      count += 1;
    }

    this.displayGrid();

    return count;
  }

  public async solvePartTwo() {
    const { startingX, startingY } = await this.prepareGrid(150, true);

    let count = 0;
    while (this.drawSand([startingX, startingY])) {
      count += 1;
    }

    this.displayGrid();

    return count + 1; // add start
  }

  private displayGrid () {
    return this.grid?.forEach((row) => {
      console.log(row.join(''));
    });
  }

  private drawSand(from: number[]): boolean {
    const [x, y] = from;
    let currentHeight = x;

    let nextMarker = null;
    do {
      let nextHeight = this.grid![currentHeight + 1];
      if (!nextHeight || y < 0) return false;

      nextMarker = nextHeight[y];

      if (nextMarker === Marker.Rock || nextMarker === Marker.Sand) {
        if (this.grid![currentHeight + 1][y - 1] === Marker.Air) {
          return this.drawSand([currentHeight, y - 1]);
        }

        if (this.grid![currentHeight + 1][y + 1] === Marker.Air) {
          return this.drawSand([currentHeight, y + 1]);
        }

        if (this.grid![currentHeight][y] === Marker.Air) {
          this.grid![currentHeight][y] = Marker.Sand;
          return true;
        }

        return false;
      }

      currentHeight++;
    } while (currentHeight < this.grid!.length && y > 0 && y < this.grid![0].length - 1);

    return false;
  }

  private getMinYmaxX (input: any[]) {
    let maxX = 0, minX = Number.MAX_SAFE_INTEGER, maxY = 500, minY = Number.MAX_SAFE_INTEGER;
    for (const coordinates of input) {
      const maxXInCoordinates = coordinates.reduce((memo: number, current: number[]) => {
        const [_, x] = current;
        if (x > memo) memo = x;

        return memo;
      }, maxX);
      const minXInCoordinates = coordinates.reduce((memo: number, current: number[]) => {
        const [_, x] = current;
        if (x < memo) memo = x;

        return memo;
      }, minX);
      const maxYInCoordinates = coordinates.reduce((memo: number, current: number[]) => {
        const [y, _] = current;
        if (y > memo) memo = y;

        return memo;
      }, maxY);
      const minYInCoordinates = coordinates.reduce((memo: number, current: number[]) => {
        const [y, _] = current;
        if (y < memo) memo = y;

        return memo;
      }, minY);

      if (maxX < maxXInCoordinates) maxX = maxXInCoordinates;
      if (minX > minXInCoordinates) minX = minXInCoordinates;
      if (minY > minYInCoordinates) minY = minYInCoordinates;
      if (maxY > maxYInCoordinates) maxY = maxYInCoordinates;
    }

    return {
      minX,
      maxX,
      minY,
      maxY,
    };
  }

  private drawRocksFromCoordinates(coordinates: number[][]) {
    for (let i = 0; i < coordinates.length - 1; i++) {
      const from = coordinates[i];
      const to = coordinates[i + 1];

      const optFrom = this.getOptimizedCoordinates(from);
      const optTo = this.getOptimizedCoordinates(to);

      this.drawRocks(optFrom, optTo);
    }
  }

  private getOptimizedCoordinates = (coordinates: number[]) => {
    const [y, x] = coordinates;

    return [y - this.horizontalModifier, x - this.verticalModifier];
  };

  private drawRocks(from: number[], to: number[]) {
    const [fromY, fromX] = from;
    const [toY, toX] = to;

    const directionY = Math.sign(toY - fromY);
    const directionX = Math.sign(toX - fromX);

    let currentX = fromX;
    let currentY = fromY;
    while (currentX !== (toX + directionX) || currentY !== (toY + directionY)) {
      this.grid![currentX][currentY] = Marker.Rock;

      currentX += directionX;
      currentY += directionY;
    }
  }

  private async prepareGrid(customSpacing: number = 20, addFloorLevel: boolean = false) {
    const input = await getInput();

    const {
      minX,
      maxX,
      minY,
      maxY,
    } = this.getMinYmaxX(input);

    const spacing = Math.min(500, customSpacing);
    this.verticalModifier = 0;
    this.horizontalModifier = minY - spacing;

    const startingY = 500 - this.horizontalModifier;
    const startingX = 0;

    const width = maxY - this.horizontalModifier + startingY + 1;
    const height = maxX + 1;
    this.grid = Array.from({ length: height }, () => Array.from({ length: width }, () => Marker.Air));
    this.grid[startingX][startingY] = Marker.Start;

    if (addFloorLevel) {
      this.grid.push(Array.from({ length: width }, () => Marker.Air));
      this.grid.push(Array.from({ length: width }, () => Marker.Rock));
    }

    for (const coordinates of input) {
      this.drawRocksFromCoordinates(coordinates);
    }

    return { startingX, startingY, floor: maxX + 2 };
  }
}

(async () => {
  const s1 = new Solution();
  console.log(`1. ${await s1.solvePartOne()}`);

  const s2 = new Solution();
  console.log(`2. ${await s2.solvePartTwo()}`);
})();
