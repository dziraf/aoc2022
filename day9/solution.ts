import fs from 'fs/promises';
import path from 'path';

var tailNineCount = 0;

type SolutionInput = [string, number][];

const getInput = async (): Promise<SolutionInput> => {
  const input = await fs.readFile(path.join(__dirname, './input.txt'), 'utf8');
  const lines = input.split(/\n/g);

  return lines.map((l) => {
    const tokens = l.split(' ');

    return [tokens[0], Number(tokens[1])];
  });
};

const drawMovements = (movements: string[][], input: SolutionInput, startRow: number, startCol: number, marker?: string) => {
  let headPos = [startRow, startCol];
  let tailPos = [startRow, startCol];

  for (let i = 0; i < input.length; i++) {
    const move = input[i];
    const [direction, count] = move;
    let moveCount = 0;

    while (moveCount < count) {
      const { newHeadPos, newTailPos } = getMove(movements, direction, headPos, tailPos);
      movements[newTailPos[0]][newTailPos[1]] = marker ?? '#';
      headPos = newHeadPos;
      tailPos = newTailPos;

      moveCount++;
    }
  }

  return movements;
}

const drawMovementsP2 = (movements: string[][], input: SolutionInput, startRow: number, startCol: number, marker?: string) => {
  console.log(startRow, startCol);
  let headPos = [startRow, startCol];
  let tailPos = [startRow, startCol];

  for (let i = 0; i < input.length; i++) {
    const move = input[i];
    const [direction, count] = move;
    let moveCount = 0;

    while (moveCount < count) {
      const { newHeadPos, newTailPos } = getMove(movements, direction, headPos, tailPos);
      movements[newTailPos[0]][newTailPos[1]] = marker ?? '#';

      if (newTailPos[0] !== tailPos[0] || newTailPos[1] !== tailPos[1]) {
        let tailCount = 1;
        while (tailCount <= 9) {
          drawMovementsP2(movements, [move], newTailPos[0], newTailPos[1], tailCount.toString());
          tailCount++;
        }
      }

      headPos = newHeadPos;
      tailPos = newTailPos;

      moveCount++;
    }
  }

  return movements;
};

const isTailAdjacentToHead = (grid: string[][], headPos: number[], tailPos: number[]) => {
  const [headRow, headCol] = headPos;
  const [tailRow, tailCol] = tailPos;

  if (headRow === tailRow && headCol === tailCol) return true;

  if (headRow < 0 || headRow >= grid.length || headCol < 0 || headCol >= grid[0].length ||
    tailRow < 0 || tailRow >= grid.length || tailCol < 0 || tailCol >= grid[0].length) {
    return false;
  }

  const dx = Math.abs(headRow - tailRow);
  const dy = Math.abs(headCol - tailCol);
  
  return (dx <= 1 && dy <= 1 && (dx === 0 || dy === 0 || dx === dy));
}

const getMove = (movements: string[][], direction: string, headPos: number[], tailPos: number[]) => {
  let moveCount = 0;
  let [row, col] = tailPos;

  if (direction === 'R') {
    headPos[1] += 1;
    if (!isTailAdjacentToHead(movements, headPos, tailPos)) {
      col += 1;
      row = headPos[0];
    }
  }
  if (direction === 'L') {
    headPos[1] -= 1;
    if (!isTailAdjacentToHead(movements, headPos, tailPos)) {
      col -= 1;
      row = headPos[0];
    }
  }
  if (direction === 'U') {
    headPos[0] -= 1;
    if (!isTailAdjacentToHead(movements, headPos, tailPos)) {
      row -= 1;
      col = headPos[1];
    }
  }
  if (direction === 'D') {
    headPos[0] += 1;
    if (!isTailAdjacentToHead(movements, headPos, tailPos)) {
      row += 1;
      col = headPos[1];
    }
  }
  tailPos[0] = row;
  tailPos[1] = col;

  return { newTailPos: tailPos, newHeadPos: headPos };
}

const drawGrid = (grid: string[][]) => {
  for (const row of grid) {
    console.log(row.join(' '));
  }
}

const countMovements = (grid: string[][]) => {
  let count = 0;

  for (const row of grid) {
    count += row.reduce((memo, character) => ['#', 's'].includes(character) ? memo + 1 : memo, 0);
  }

  return count;
}

const solvePartOne = async () => {
  const gridSize = 30; // optimize?
  const input = await getInput();
  const movements = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => '.'));

  const startRow = gridSize / 2;
  const startCol = gridSize / 2;
  movements[startRow][startCol] = 's';
  drawMovements(movements, input, startRow, startCol);
  console.log(drawGrid(movements));

  return countMovements(movements);
};

const solvePartTwo = async () => {
  const gridSize = 30; // optimize?
  const input = await getInput();
  const movements = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => '.'));

  const startRow = gridSize / 2;
  const startCol = gridSize / 2;
  movements[startRow][startCol] = 's';
  drawMovementsP2(movements, input, startRow, startCol);

  const total = countMovements(movements);
  console.log(drawGrid(movements));
  return total
};

(async () => {
  console.log(`1. ${await solvePartOne()}`);
  console.log(`2. ${await solvePartTwo()}`);
})();
