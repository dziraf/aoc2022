const fs = require('fs/promises');
const path = require('path');

const getInput = async () => {
  const input = await fs.readFile(path.join(__dirname, './input.txt'), 'utf8');
  const parts = input.split(/\n{2,}/g);

  const [cratesInput, ...movesInput] = parts;
  const moves = movesInput[0] // [quantity, from, to]
    .split(/\n/g)
    .map((m) => m.split(/[a-zA-Z\s]+/g).slice(-3).map(Number));

  const cratesPlacement = convertCratesStringToArray(cratesInput);

  return { cratesPlacement, moves };
}

const convertCratesStringToArray = (cratesInput) => {
  const lines = cratesInput.split(/\n/g);
  const lastLine = lines.slice(-1)[0];
  const columns = lastLine.replaceAll(' ', '').length;
  const placements = lines.slice(0, -1);

  const matrix = Array.from({ length: columns}, () => ([]));
  const filledPlacements = placements.reduce((memo, row) => {
    const filledRow = row
      .replace(/[[\]]/g, '')
      .split('')
      .reduce((newRow, character, i) => {
        if (character === ' ' && i % 4 === 0) {
          newRow.push('*');
        } else if (character !== ' ') newRow.push(character);

        return newRow;
      }, [])
    
    memo.push(filledRow);

    return memo;
  }, []);

  filledPlacements.reverse().forEach((placement) => {
    placement.forEach((value, i) => {
      if (value !== '*') matrix[i].push(value);
    });
  });

  return matrix;
}

const move = (crates, [quantity, from, to], isNewCrateMover = false) => {
  const objectsToMove = crates[from - 1]
    .splice(crates[from - 1].length - quantity, quantity);

  crates[to - 1] = [...crates[to - 1], ...(isNewCrateMover ? objectsToMove : objectsToMove.reverse())];
};

const solvePartOne = async () => {
  const { cratesPlacement, moves } = await getInput();
  const crates = [...cratesPlacement];
  moves.forEach((m) => move(crates, m));

  return crates.map((col) => col[col.length - 1]).join('');
};

const solvePartTwo = async () => {
  const { cratesPlacement, moves } = await getInput();
  const crates = [...cratesPlacement];
  moves.forEach((m) => move(crates, m, true));

  return crates.map((col) => col[col.length - 1]).join('');
};

(async () => {
  console.log(`1. ${await solvePartOne()}`);
  console.log(`2. ${await solvePartTwo()}`);
})();
