import fs from 'fs/promises';
import path from 'path';

type Matrix = number[][];
type MatrixInput = {
  value: number;
  row: number;
  col: number;
}

const getInput = async () => {
  const input = await fs.readFile(path.join(__dirname, './input.txt'), 'utf8');
  const lines = input.split(/\n/g);

  return lines.map((l) => l.split('').map(Number));
};

const checkUp = (matrix: Matrix, { value, row, col }: MatrixInput) => {
  while (row >= 0) {
    if (matrix[--row][col] >= value) return false;
    if (row === 0) return true;
  }

  return false;
};

const checkDown = (matrix: Matrix, { value, row, col }: MatrixInput) => {
  while (row < matrix.length) {
    if (matrix[++row][col] >= value) return false;
    if (row === matrix.length - 1) return true;
  }

  return false;
};

const checkRight = (matrix: Matrix, { value, row, col }: MatrixInput) => {
  while (col < matrix[row].length) {
    if (matrix[row][++col] >= value) return false;
    if (col === matrix.length - 1) return true;
  }

  return false;
};

const checkLeft = (matrix: Matrix, { value, row, col }: MatrixInput) => {
  while (col >= 0) {
    if (matrix[row][--col] >= value) return false;
    if (col === 0) return true;
  }

  return false;
};

const checkVisibility = (matrix: Matrix, { value, row, col }: MatrixInput) => {
  if (row === 0 || col === 0 || row === matrix.length - 1 || col === matrix[row].length - 1) {
    return true;
  }
  if (checkUp(matrix, { value, row, col })) return true;
  if (checkDown(matrix, { value, row, col })) return true;
  if (checkLeft(matrix, { value, row, col })) return true;
  if (checkRight(matrix, { value, row, col })) return true;

  return false;
};

const countUp = (matrix: Matrix, { value, row, col }: MatrixInput) => {
  let count = 0;
  let currentValue = -1;
  do {
    currentValue = matrix[--row]?.[col];
    if (currentValue !== undefined) count++;
  } while (row >= 0 && currentValue < value);

  return count;
};

const countDown = (matrix: Matrix, { value, row, col }: MatrixInput) => {
  let count = 0;
  let currentValue = -1;
  do {
    currentValue = matrix[++row]?.[col];
    if (currentValue !== undefined) count++;
  } while (row < matrix.length && currentValue < value);

  return count;
};

const countRight = (matrix: Matrix, { value, row, col }: MatrixInput) => {
  let count = 0;
  let currentValue = -1;
  do {
    currentValue = matrix[row]?.[++col];
    if (currentValue !== undefined) count++;
  } while (col < matrix[row].length && currentValue < value);

  return count;
};

const countLeft = (matrix: Matrix, { value, row, col }: MatrixInput) => {
  let count = 0;
  let currentValue = -1;
  do {
    currentValue = matrix[row]?.[--col];
    if (currentValue !== undefined) count++;
  } while (col >= 0 && currentValue < value);

  return count;
};

const getScenicScore = (matrix: Matrix, { value, row, col }: MatrixInput) => {
  const up = countUp(matrix, { value, row, col });
  const down = countDown(matrix, { value, row, col });
  const left = countLeft(matrix, { value, row, col });
  const right = countRight(matrix, { value, row, col });

  // console.log({
  //   value,
  //   up,
  //   down,
  //   left,
  //   right,
  //   score: up * down * left * right,
  // });
  return up * down * left * right;
};

const solvePartOne = async () => {
  const matrix = await getInput();

  let visible = 0;
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (checkVisibility(matrix, { row, col, value: matrix[row][col] })) {
        visible++;
      }
    }
  }

  return visible;
};

const solvePartTwo = async () => {
  const matrix = await getInput();

  let maxScore = 0;
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      const score = getScenicScore(matrix, {
        row,
        col,
        value: matrix[row][col],
      });

      if (score > maxScore) maxScore = score;
    }
  }

  return maxScore;
};

(async () => {
  console.log(`1. ${await solvePartOne()}`);
  console.log(`2. ${await solvePartTwo()}`);
})();
