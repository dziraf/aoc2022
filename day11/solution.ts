import fs from 'fs/promises';
import path from 'path';

type MonkeyInfo = {
  id: number;
  items: number[];
  operation: {
    operator: string;
    by: number | null; // null = self
  };
  test: {
    divisibleBy: number;
    ifTrue: number;
    ifFalse: number;
  };
  inspections: number;
};

type SolutionInput = MonkeyInfo[];

const getInput = async (): Promise<SolutionInput> => {
  const input = await fs.readFile(path.join(__dirname, './input.txt'), 'utf8');
  const monkeys = input.split(/\n{2,}/g);

  return monkeys.map((monkey: string) => {
    const monkeyInfoLines = monkey.split(/\n/g);

    const id = Number((monkeyInfoLines[0].match(/\d+/g) ?? [])[0]);
    const items = (monkeyInfoLines[1].match(/\d+/g) ?? []).map(Number);
    const [operator, by] = (monkeyInfoLines[2].match(/[*+]|\d+/g) ?? []);
    const divisibleBy = Number((monkeyInfoLines[3].match(/\d+/g) ?? [])[0]);
    const ifTrue = Number((monkeyInfoLines[4].match(/\d+/g) ?? [])[0]);
    const ifFalse = Number((monkeyInfoLines[5].match(/\d+/g) ?? [])[0]);

    const info: MonkeyInfo = {
      id,
      items,
      operation: {
        operator: operator!,
        by: by ? Number(by) : null,
      },
      test: {
        divisibleBy,
        ifTrue: ifTrue,
        ifFalse: ifFalse,
      },
      inspections: 0,
    };

    return info;
  });
};

const handleMonkeyTurn = (currentState: MonkeyInfo[], monkey: MonkeyInfo, divideBy: number) => {
  const { items, operation, test } = monkey;
  const { operator, by } = operation;
  const { divisibleBy, ifTrue, ifFalse } = test;

  for (const item of items) {
    let worryLevel = item;
    const operateBy = by === null ? worryLevel : by;

    switch (operator) {
      case '*': {
        worryLevel *= operateBy;
        break;
      }
      case '+': {
        worryLevel += operateBy;
        break;
      }
    }

    const divided = Math.floor(worryLevel / divideBy);
    if (divided % divisibleBy === 0) {
      currentState[ifTrue].items.push(divided);
    } else {
      currentState[ifFalse].items.push(divided);
    }

    monkey.inspections += 1;
  }

  monkey.items = [];
};

const handleRound = (currentState: MonkeyInfo[], divideBy: number) => {
  for (const monkey of currentState) {
    handleMonkeyTurn(currentState, monkey, divideBy);
  }
};

const solvePartOne = async () => {
  const state = await getInput();
  let rounds = 20;
  
  for (let i = 0; i < rounds; i++) {
    handleRound(state, 3);
  }

  const inspectionsFromHighestToLowest = state.map(({ inspections }) => inspections).sort((a, b) => b - a);

  return inspectionsFromHighestToLowest[0] * inspectionsFromHighestToLowest[1];
};

const solvePartTwo = async () => {
  const state = await getInput();
  let rounds = 10000;
  
  for (let i = 0; i < rounds; i++) {
    handleRound(state, 1);
  }

  console.log(state);
  const inspectionsFromHighestToLowest = state.map(({ inspections }) => inspections).sort((a, b) => b - a);

  return inspectionsFromHighestToLowest[0] * inspectionsFromHighestToLowest[1];
};

(async () => {
  console.log(`1. ${await solvePartOne()}`);
  console.log(`1. ${await solvePartTwo()}`);
})();
