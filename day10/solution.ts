import fs from 'fs/promises';
import path from 'path';
import chunk from 'lodash/chunk';

type SolutionInput = [string, number][];

const getInput = async (): Promise<SolutionInput> => {
  const input = await fs.readFile(path.join(__dirname, './input.txt'), 'utf8');
  const lines = input.split(/\n/g);

  return lines.map((l) => {
    const tokens = l.split(' ');

    return [tokens[0], Number(tokens[1])];
  });
};

const getCycles = (input: SolutionInput) => {
  const cycles: number[] = [1];

  for (const line of input) {
    const [command, arg] = line;
    const currentValue = cycles.slice(-1)[0];

    if (command === 'noop') {
      cycles.push(currentValue);
    }

    if (command === 'addx') {
      cycles.push(currentValue, currentValue + arg);
    }
  };

  return cycles;
};

const solvePartOne = async () => {
  const input = await getInput();
  const cycles = getCycles(input);
  const cyclesToCheckSignalFor = [0, 20, 60, 100, 140, 180, 220];

  return cyclesToCheckSignalFor.reduce((memo, current) => memo + (current * cycles[current - 1]));
};

const doesDrawAtSpritePosition = (pos: number, spritePosition: number) => {
  const crtPos = pos % 40;
  return crtPos >= spritePosition - 1 && crtPos <= spritePosition + 1;
};

const drawCRT = (crt: string[]) => {
  const chunkedCrt = chunk(crt, 40);

  return chunkedCrt.forEach((row) => {
    console.log(row.join(''));
  });
}

const solvePartTwo = async () => {
  const input = await getInput();
  const cycles = getCycles(input);
  
  let spritePosition = 1;
  let position = 0;
  const crt = [];

  for (let i = 0; i < cycles.length - 1; i++) {
    const nextCycle = cycles[i + 1];
    if (doesDrawAtSpritePosition(position, spritePosition)) {
      crt.push('#');
    } else {
      crt.push('.');
    }

    spritePosition = nextCycle;
    position++;
  }

  drawCRT(crt);
};

(async () => {
  console.log(`1. ${await solvePartOne()}`);
  console.log('2.');
  await solvePartTwo();
})();
