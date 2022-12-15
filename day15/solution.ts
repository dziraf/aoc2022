import fs from 'fs/promises';
import path from 'path';

const getInput = async () => {
  const input = await fs.readFile(path.join(__dirname, './input.txt'), 'utf8');
  const lines = input.split(/\n/g);

  return lines.reduce((memo: any[], line: string) => {
    const coordinates = line.match(/-?\d+/g)?.map(Number);

    memo.push(coordinates);

    return memo;
  }, []);
}

class Solution {
  private coordinates: number[][];

  constructor(coordinates: number[][]) {
    this.coordinates = coordinates;
  }

  public solvePartOne() {
    const checkY = 2000000;
    let count = 0;

    const { minX, maxX } = this.getMinMaxX();
    const eps = Math.abs(minX - maxX) / 10;

    for (const positions of this.coordinates) {
      const [x, y, xB, yB] = positions;
      const distanceBetweenSensorAndBeacon = this.getDistance([x, y], [xB, yB]);

      positions.push(distanceBetweenSensorAndBeacon);
    }

    let currentX = minX - eps - 1;
    while (currentX < maxX + eps) {      
      const isValidLocation = this.coordinates.every((pos) => {
        const [x, y, xB, yB, closestDistance] = pos;
        const testedDistance = this.getDistance([x, y], [currentX, checkY]);
        
        if (currentX === x && checkY === y) return false;
        if (currentX === xB && checkY === yB) return false;

        return testedDistance > closestDistance;
      });

      if (!isValidLocation) {
        count++;
      }

      currentX++;
    }

    return count;
  }

  private getMinMaxX() {
    let minX = Number.MAX_SAFE_INTEGER, maxX = Number.MIN_SAFE_INTEGER;
  
    for (const coordinates of this.coordinates) {
      const [sX, _sY, bX, _bY] = coordinates;
      const mX = Math.min(sX, bX, minX);

      minX = Math.min(sX, bX, minX);
      maxX = Math.max(sX, bX, maxX);
    }

    return {
      minX,
      maxX,
    };
  }

  private getDistance(pos1: number[], pos2: number[]) {
    const [x1, y1] = pos1;
    const [x2, y2] = pos2;

    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
  }
}

(async () => {
  const input = await getInput();

  const s1 = new Solution([...input]);

  console.log(`1. ${s1.solvePartOne()}`);
})()
