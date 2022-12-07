const fs = require('fs/promises');
const path = require('path');
const set = require('lodash/set');

const MAX_SIZE = 100000;
const DISK_SPACE = 70000000;
const MIN_SPACE = 30000000;

const getInput = async () => {
  const input = await fs.readFile(path.join(__dirname, './input.txt'), 'utf8');
  const lines = input.split(/\n/g);

  return lines;
};

const handleLine = (line, structure, fp) => {
  const tokens = line.split(' ');

  if (tokens[0] === '$') {
    if (tokens[1] === 'cd') {
      if (tokens[2] === '/') {
        fp = [];
      } else if (tokens[2] === '..') {
        fp.pop();
      } else {
        fp.push(tokens[2]);
      }
    }
  }

  if (tokens[0] === 'dir') {
    const pathString = [...fp, tokens[1].replace('.', '_')].join('.');
    structure = set(structure, pathString, {});
  }

  if (!Number.isNaN(Number(tokens[0]))) {
    const pathString = [...fp, tokens[1].replace('.', '_')].join('.');
    structure = set(structure, pathString, Number(tokens[0]));
  }
}

const assignDirectorySizes = (structure, dirs, allDir = false) => {
  let dirSize = 0;

  for (const value of Object.values(structure)) {
    let v = value;
    if (typeof value === 'object') {
      v = assignDirectorySizes(value, dirs, allDir);
    }

    dirSize += v;
  }

  if (!allDir && dirSize <= MAX_SIZE) dirs.push(dirSize);
  else if (allDir) dirs.push(dirSize);

  return dirSize;
}

const solvePartOne = async () => {
  const lines = await getInput();
  const structure = {};
  let path = [];

  for (const line of lines) {
    handleLine(line, structure, path);
  }

  const dirs = [];
  assignDirectorySizes(structure, dirs);

  return dirs.reduce((memo, c) => c <= MAX_SIZE ? memo + c : memo);
};

const solvePartTwo = async () => {
  const lines = await getInput();
  const structure = {};
  let path = [];

  for (const line of lines) {
    handleLine(line, structure, path);
  }

  const dirs = [];
  assignDirectorySizes(structure, dirs, true);
  dirs.sort((a, b) => b - a);

  const totalSize = dirs[0];
  const freeSpace = DISK_SPACE - totalSize;
  const sizeToFree = MIN_SPACE - freeSpace;
  const viableDirs = dirs.filter((dir) => dir >= sizeToFree);

  return viableDirs[viableDirs.length - 1];
};

(async () => {
  console.log(`1. ${await solvePartOne()}`);
  console.log(`2. ${await solvePartTwo()}`);
})();
