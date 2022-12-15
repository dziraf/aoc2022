import fs from 'fs/promises';
import path from 'path';
import intersection from 'lodash/intersection';

const getInput = async () => {
  const input = await fs.readFile(path.join(__dirname, './input.txt'), 'utf8');
  const lines = input.split(/\n/g);

  return lines.reduce((memo: any[], line: string) => {
    const coordinates = line.match(/-?\d+/g)?.map(Number);

    memo.push(coordinates);

    return memo;
  }, []);
}

const mergeRanges = (ranges: number[][]) => {
  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [ranges[0]];

  for (let i = 1; i < ranges.length; i++) {
    const [start, end] = ranges[i];
    let prev = merged[merged.length - 1];
    if (prev[1] >= start) {
      prev[1] = Math.max(prev[1], end);
    } else merged.push(ranges[i]);
  }
  return merged;
};

class Solution {
  private coordinates: number[][];

  constructor(coordinates: number[][]) {
    this.coordinates = coordinates;
    this.extendCoordinatesWithDistances();
  }

  public solvePartOne() {
    const checkY = 2000000;
    let count = 0;

    const { minX, maxX } = this.getMinMaxX();
    const eps = Math.abs(minX - maxX) / 10;

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

  public solvePartTwo() {
    console.time();
    const minX = 0;
    const minY = 0;
    // const maxX = 20;
    // const maxY = 20;
    const maxX = 4000000;
    const maxY = 4000000;
    const multiplier = 4000000;

    let xCoordinate = -1;
    let yCoordinate = -1;
    for (let y = minY; y <= maxY && yCoordinate === -1; y++) {
      const ranges = this.getPossibleRanges(y, [minX, maxX]);
      
      let currentX = minX;
      for (const r of ranges) {
        const [minRangeX, maxRangeX] = r;
        if (currentX < minRangeX) {
          xCoordinate = currentX;
          yCoordinate = y;
        }
        if (maxRangeX >= currentX) {
          currentX = maxRangeX + 1
        }
      }
    }

    console.timeEnd();
    return xCoordinate * multiplier + yCoordinate;
  }

  private getPossibleRanges(y: number, xRange: number[]) {
    const ranges: number[][] = [];

    for (const position of this.coordinates) {
      const [xS, yS, _xB, _yB, distance] = position;
      const verticalDistance = Math.abs(yS - y);
      const maxHorizontalDistance = distance - verticalDistance;

      if (maxHorizontalDistance > 0) {
        const minX = Math.max(xRange[0], xS - maxHorizontalDistance);
        const maxX = Math.min(xRange[1], xS + maxHorizontalDistance);
        if (minX <= maxX) {
          ranges.push([minX, maxX]);
        }
      }
    }

    return mergeRanges(ranges);
  }

  private getMinMaxX() {
    let minX = Number.MAX_SAFE_INTEGER, maxX = Number.MIN_SAFE_INTEGER;
  
    for (const coordinates of this.coordinates) {
      const [sX, _sY, bX, _bY] = coordinates;

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

  private extendCoordinatesWithDistances() {
    for (const positions of this.coordinates) {
      const [x, y, xB, yB] = positions;
      const distanceBetweenSensorAndBeacon = this.getDistance([x, y], [xB, yB]);

      positions.push(distanceBetweenSensorAndBeacon);
    }
  }
}

(async () => {
  const input = await getInput();

  const s1 = new Solution([...input]);
  // console.log(`1. ${s1.solvePartOne()}`);

  const s2 = new Solution([...input]);
  console.log(`2. ${s2.solvePartTwo()}`);
})()
