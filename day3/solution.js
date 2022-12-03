const fs = require('fs/promises');
const path = require('path');
const chunk = require('lodash/chunk');

const itemPoints = (str) => {
  const basePosition = 1 + parseInt(str, 36) - 10;

  if (str.toUpperCase() === str) {
    return basePosition + 26;
  }

  return basePosition;
}


const getRucksacks = async () => {
  const input = await fs.readFile(path.join(__dirname, './input.txt'), 'utf8');
  const rucksacks = input.split(/\n/g);

  return rucksacks;
}

const intersection = (str1, str2) => {
  return (str2.match(new RegExp(`[${str1}]`, 'g')) || []);
}

const solvePartOne = async () => {
  const rucksacks = (await getRucksacks()).map((contents) => ([
    contents.slice(0, contents.length / 2),
    contents.slice(contents.length / 2, contents.length),
  ]));

  return rucksacks.reduce((memo, current) => {
    const match = intersection(current[0], current[1])[0];
    
    return memo + itemPoints(match);
  }, 0);
}

const solvePartTwo = async () => {
  const rucksacks = await getRucksacks();
  const groupedRucksacks = chunk(rucksacks, 3);

  return groupedRucksacks.reduce((memo, group) => {
    const m1 = intersection(group[0], group[1]).join('');
    const m2 = intersection(group[1], group[2]).join('');
    const item = intersection(m1, m2)[0];

    return memo + itemPoints(item);
  }, 0);
}

(async () => {
  console.log(`1. ${await solvePartOne()}`);
  console.log(`2. ${await solvePartTwo()}`);
})()
