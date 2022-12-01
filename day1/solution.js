const fs = require('fs/promises');
const path = require('path');

(async () => {
  const input = await fs.readFile(path.join(__dirname, './input.txt'), 'utf8');
  const calories = input.split(/\n{2,}/g).reduce((memo, line, index) => {
    const caloriesByElf = line.split('\n').reduce((sum, val) => sum + Number(val), 0);

    memo.push([index + 1, caloriesByElf]);

    return memo;
  }, []).sort((a, b) => b[1] - a[1]);

  const elfWithMostCalories = calories[0][0];
  const mostCalories = calories[0][1];
  const topThreeTotalCalories = calories[0][1] + calories[1][1] + calories [2][1];

  console.log(`1. Elf #${elfWithMostCalories} is carrying ${mostCalories} calories`);
  console.log(`2. Total calories carried by top 3 elves: ${topThreeTotalCalories}`);
})()
