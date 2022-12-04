const fs = require('fs/promises');
const path = require('path');

const getPairs = async () => {
  const input = await fs.readFile(path.join(__dirname, './input.txt'), 'utf8');
  const pairs = input.split(/\n/g);

  return pairs.map((p) => p.split(',').map((e) => e.split('-').map(Number)));
}

const isFullyContained = ([startA, endA], [startB, endB]) => {
  // B in A
  if (startB >= startA && endB <= endA) {
    return true;
  }

  // A in B
  if (startA >= startB && endA <= endB) {
    return true;
  }

  return false;
}

const isOverlapping = ([startA, endA], [startB, endB]) => {
  return !(startB > endA || startA > endB);
};

const solvePartOne = async () => {
  const pairs = await getPairs();

  const sum = pairs.reduce((memo, current) => {
    const [a, b] = current;

    if (isFullyContained(a, b)) return memo + 1;

    return memo;
  }, 0);

  return sum;
};

const solvePartTwo = async () => {
  const pairs = await getPairs();

  const sum = pairs.reduce((memo, current) => {
    const [a, b] = current;

    if (isOverlapping(a, b)) return memo + 1;

    return memo;
  }, 0);

  return sum;
};

(async () => {
  console.log(`1. ${await solvePartOne()}`);
  console.log(`2. ${await solvePartTwo()}`);
})();
