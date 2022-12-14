import fs from 'fs/promises';
import path from 'path';

const getInput = async (): Promise<any[]> => {
  const input = await fs.readFile(path.join(__dirname, './input.txt'), 'utf8');
  const lines = input.split(/\n{2,}/g);

  return lines.map((line) => {
    const pairs = line.split('\n');

    return pairs.map((s) => JSON.parse(s));
  });
};

export class Solution {
  public async solvePartOne() {
    const input = await getInput();

    const validPairs: any[] = [];
    const validIndices: number[] = [];

    input.forEach((pair, i) => {
      if (this.determineIfPairIsCorrect(pair[0], pair[1])) {
        validPairs.push(pair);
        validIndices.push(i + 1);
      }
    });

    return validIndices.reduce((memo, num) => memo + num, 0);
  }

  public determineIfPairIsCorrect(left: any, right: any): boolean | undefined {
    if (typeof left === 'number' && typeof right === 'number') {
      if (left < right) return true;
      if (left > right) return false;

      return undefined;
    }

    if (left === undefined && right !== undefined) {
      return true;
    }

    if (right === undefined && left !== undefined) {
      return false;
    }

    let leftList = left, rightList = right;
    if (typeof leftList === 'number') leftList = [leftList];
    if (typeof rightList === 'number') rightList = [rightList];

    const len = Math.max(leftList.length, rightList.length);
    for (let i = 0; i < len; i++) {
      const isValid = this.determineIfPairIsCorrect(leftList[i], rightList[i]);

      if (isValid !== undefined) return isValid;
    }

    return undefined;
  };
}

(async () => {
  const solution = new Solution();
  console.log(`1. ${await solution.solvePartOne()}`);
})();
