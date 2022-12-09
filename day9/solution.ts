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

const hasPositionChanged = (movements: string[][], oldTail: number[], newTail: number[], tailNumber: number) => {
  const [oldRow, oldCol] = oldTail;
  const [newRow, newCol] = newTail;

  const currentValue = movements[oldRow][oldCol];
  const valueAtNewPosition = movements[newRow][newCol];
  if (tailNumber <= Number(currentValue)) return false;
  if (valueAtNewPosition !== '.' && tailNumber <= Number(valueAtNewPosition)) return false;

  return oldRow !== newRow || oldCol !== newCol;
}

const drawMovementsP2 = (movements: string[][], input: SolutionInput, positions: number[][], marker?: string) => {
  for (let i = 0; i < input.length; i++) {
    const [direction, count] = input[i];
    let moveCount = 0;
    while (moveCount < count) {
      const tmpPositions = [...positions];
      // console.log(positions);
      let headIndex = 0;
      let lastTailMoved = true;
      do {
        let tailIndex = headIndex + 1;
        const head = tmpPositions[headIndex]
        const tail = tmpPositions[tailIndex];
        const { newHeadPos, newTailPos } = getMove(movements, direction, head!, tail);

        if (lastTailMoved) {
          positions[headIndex][0] = newHeadPos[0];
          positions[headIndex][1] = newHeadPos[1];
        }

        const positionChanged = hasPositionChanged(movements, tail, newTailPos, tailIndex);
        if (positionChanged) {
          // console.log('tail', tail, newTailPos, tailIndex);

          movements[newTailPos[0]][newTailPos[1]] = tailIndex.toString();

          positions[tailIndex][0] = newTailPos[0];
          positions[tailIndex][1] = newTailPos[1];

          lastTailMoved = true;
        } else {
          lastTailMoved = false;
        }

        headIndex++;
      } while (headIndex < tmpPositions.length - 1 && lastTailMoved)

      moveCount++;
      // console.log(`Iteration: ${i + 1} | Move: ${moveCount}`);
      // console.log(drawGrid(movements));
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
  const newTailPos = [...tailPos];
  const newHeadPos = [...headPos];
  let [row, col] = newTailPos;

  if (direction === 'R') {
    newHeadPos[1] += 1;
    if (!isTailAdjacentToHead(movements, newHeadPos, newTailPos)) {
      col += 1;
      row = newHeadPos[0];
    }
  }
  if (direction === 'L') {
    newHeadPos[1] -= 1;
    if (!isTailAdjacentToHead(movements, newHeadPos, newTailPos)) {
      col -= 1;
      row = newHeadPos[0];
    }
  }
  if (direction === 'U') {
    newHeadPos[0] -= 1;
    if (!isTailAdjacentToHead(movements, newHeadPos, newTailPos)) {
      row -= 1;
      col = newHeadPos[1];
    }
  }
  if (direction === 'D') {
    newHeadPos[0] += 1;
    if (!isTailAdjacentToHead(movements, newHeadPos, newTailPos)) {
      row += 1;
      col = newHeadPos[1];
    }
  }
  newTailPos[0] = row;
  newTailPos[1] = col;

  return { newTailPos, newHeadPos };
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

  return countMovements(movements);
};

const solvePartTwo = async () => {
  const gridSize = 30; // optimize?
  const input = await getInput();
  const movements = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => '.'));

  const startRow = gridSize / 2;
  const startCol = gridSize / 2;
  movements[startRow][startCol] = 's';
  drawMovementsP2(movements, input, Array.from({ length: 10 }, () => ([startRow, startCol])));

  const total = countMovements(movements);
  return total
};

(async () => {
  console.log(`1. ${await solvePartOne()}`);
  console.log(`2. ${await solvePartTwo()}`);
})();
