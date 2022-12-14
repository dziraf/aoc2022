import { Solution } from './solution';
// important: remove iife from solution.ts to run tests
const solution = new Solution();

describe('', () => {
  it('second example should work', () => {
    const result = solution.determineIfPairIsCorrect(
      [[1],[2,3,4]],
      [[1],4],
    );

    expect(result).toBe(true);
  })

  it('third example should work', () => {
    const result = solution.determineIfPairIsCorrect(
      [9],
      [[8,7,6]],
    );

    expect(result).toBe(false);
  })

  it('fourth example should work', () => {
    const result = solution.determineIfPairIsCorrect(
      [[4,4],4,4],
      [[4,4],4,4,4],
    );

    expect(result).toBe(true);
  })

  it('5 example', () => {
    const result = solution.determineIfPairIsCorrect(
      [7,7,7,7],
      [7,7,7],
    );

    expect(result).toBe(false);
  })

  it('5 example 2', () => {
    const result = solution.determineIfPairIsCorrect(
      [7,7,7],
      [7,7,7,7],
    );

    expect(result).toBe(true);
  })

  it('6th example should work', () => {
    const result = solution.determineIfPairIsCorrect(
      [],
      [3],
    );

    expect(result).toBe(true);
  })

  it('7th example should work', () => {
    const result = solution.determineIfPairIsCorrect(
      [[[]]],
      [[]],
    );

    expect(result).toBe(false);
  })

  it('8th example should work', () => {
    const result = solution.determineIfPairIsCorrect(
      [1,[2,[3,[4,[5,6,7]]]],8,9],
      [1,[2,[3,[4,[5,6,0]]]],8,9],
    );

    expect(result).toBe(false);
  })

  it('0', () => {
    const result = solution.determineIfPairIsCorrect(
      [[2,3,4]],
      [4],
    );

    expect(result).toBe(true);
  })

  it('1', () => {
    const result = solution.determineIfPairIsCorrect(
      [[],[[]],4],
      [[],[[]],3],
    );

    expect(result).toBe(false);
  })

  it('2', () => {
    const result = solution.determineIfPairIsCorrect(
      [[5,4],4],
      [[[5,4]],4],
    );

    expect(result).toBe(true);
  })

  it('3', () => {
    const result = solution.determineIfPairIsCorrect(
      [[],7],
      [[3]],
    );

    expect(result).toBe(true);
  })

  it('4', () => {
    const result = solution.determineIfPairIsCorrect(
      [[],3],
      [[1,2,3]],
    );

    expect(result).toBe(true);
  })

  it('5', () => {
    const result = solution.determineIfPairIsCorrect(
      [[[[7],[2,5],[4,1,10,9]],[[],[6,0,2,1],[0],[7,0],9],8,[6],9],[4,[],[]],[2]],
      [[7],[[6,6]]],
    );

    expect(result).toBe(false);
  })

  it('6', () => {
    const result = solution.determineIfPairIsCorrect(
      [[1,[2,[10,8,2,1,1]],0]],
      [[[1]],[[[2,4,10,2],[]],3,8],[9,3,[5,[3,0],[0],[4]],6,[[9,8,3,7],4,[10,10,8],10,[6,6]]],[[[3],7,[],[10,5]],0],[5,[[3,9,0,2,1],0,[4,5,2],[6]]]],
    );

    expect(result).toBe(false);
  })
});
