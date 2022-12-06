const fs = require('fs/promises');
const path = require('path');

const getInput = async () => {
  const input = await fs.readFile(path.join(__dirname, './input.txt'), 'utf8');
  
  return input;
};

const solve = async (sequenceLength) => {
  const text = await getInput();
  const textArray = text.split('');

  return textArray.findIndex((character, index) => {
    const sequence = textArray.slice(index - sequenceLength + 1, index + 1);
    
    const uniqCharactersInSequence = Array.from(new Set(sequence));

    return uniqCharactersInSequence.length === sequenceLength;
  }) + 1;
};

(async () => {
  console.log(`1. ${await solve(4)}`);
  console.log(`2. ${await solve(14)}`);
})();
