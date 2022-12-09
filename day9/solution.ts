import fs from 'fs/promises';
import path from 'path';

type SolutionInput = [string, number][];

const getInput = async (): Promise<SolutionInput> => {
  const input = await fs.readFile(path.join(__dirname, './input.txt'), 'utf8');
  const lines = input.split(/\n/g);

  return lines.map((l) => {
    const tokens = l.split(' ');

    return [tokens[0], Number(tokens[1])];
  });
};

const drawMovements = (movements: string[][], input: SolutionInput, positions: number[][]) => {
  for (let i = 0; i < input.length; i++) {
    const [direction, count] = input[i];
    let moveCount = 0;
    while (moveCount < count) {
      let head = positions.slice(0, 1)[0];
      const tail = positions.slice(1);
      
      switch (direction) {
        case 'D':
          head[1] -= 1;
          break;
        case 'U':
          head[1] += 1;
          break;
        case 'L':
          head[0] -= 1;
          break;
        case 'R':
          head[0] += 1;
          break;
      }

      tail.forEach((tailPos) => {
        if (!isTailAdjacentToHead(head, tailPos)) {
          if (head[0] === tailPos[0]) {
            tailPos[1] += Math.sign(head[1] - tailPos[1]);
          } else if (head[1] === tailPos[1]) {
            tailPos[0] += Math.sign(head[0] - tailPos[0]);
          } else {
            if (direction === 'U' || direction === 'D') {
              tailPos[0] += Math.sign(head[0] - tailPos[0]);
              tailPos[1] += Math.sign(head[1] - tailPos[1]);
            } else {
              tailPos[1] += Math.sign(head[1] - tailPos[1]);
              tailPos[0] += Math.sign(head[0] - tailPos[0]);
            }
          }
        }
    
        head = tailPos.slice();
    
        if (tailPos === positions[positions.length - 1]) {
          movements[tailPos[0]][tailPos[1]] = '#';
        }
      });

      moveCount++;
    }
  }

  return movements;
};

const isTailAdjacentToHead = (headPos: number[], tailPos: number[]) => {
  const [headRow, headCol] = headPos;
  const [tailRow, tailCol] = tailPos;

  if (headRow === tailRow && headCol === tailCol) return true;

  const dx = Math.abs(headRow - tailRow);
  const dy = Math.abs(headCol - tailCol);
  
  return (dx <= 1 && dy <= 1 && (dx === 0 || dy === 0 || dx === dy));
}

const countMovements = (grid: string[][]) => {
  let count = 0;

  for (const row of grid) {
    count += row.reduce((memo, character) => ['#', 's'].includes(character) ? memo + 1 : memo, 0);
  }

  return count;
}

const solvePartOne = async () => {
  const gridSize = 800; // optimize?
  const input = await getInput();
  const movements = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => '.'));

  const startRow = gridSize / 2;
  const startCol = gridSize / 2;
  const startStack = Array.from({ length: 2 }, () => ([startRow, startCol]));
  movements[startRow][startCol] = 's';
  drawMovements(movements, input, startStack);

  return countMovements(movements);
};

const solvePartTwo = async () => {
  const gridSize = 800; // optimize?
  const input = await getInput();
  const movements = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => '.'));

  const startRow = gridSize / 2;
  const startCol = gridSize / 2;
  const startStack = Array.from({ length: 10 }, () => ([startRow, startCol]));
  movements[startRow][startCol] = 's';

  drawMovements(movements, input, startStack);

  return countMovements(movements);
};

(async () => {
  console.log(`1. ${await solvePartOne()}`);
  console.log(`2. ${await solvePartTwo()}`);
})();
