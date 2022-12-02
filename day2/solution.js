const fs = require('fs/promises');
const path = require('path');

const choiceScores = {
  X: 1, // Rock
  Y: 2, // Paper
  Z: 3, // Scissors
  A: 1,
  B: 2,
  C: 3,
};

const resultScores = {
  win: 6,
  loss: 0,
  draw: 3,
};

const counterChoices = {
  A: 'Y', // rock by paper
  B: 'Z', // paper by scissors
  C: 'X', // scissors by rock
};

const losingChoices = {
  A: 'Z',
  B: 'X',
  C: 'Y',
};

const counterparts = {
  A: 'X',
  B: 'Y',
  C: 'Z',
};

(async () => {
  const input = await fs.readFile(path.join(__dirname, './input.txt'), 'utf8');

  const strategy = input.split(/\n{1,}/g).reduce((memo, current) => ([
    ...memo,
    current.split(' '),
  ]), []);

  // 1
  const totalScorePartOne = strategy.reduce((memo, current, i) => {
    const [enemy, mine] = current;
    let roundScore = choiceScores[mine];

    if (counterChoices[enemy] === mine)  {
      roundScore += resultScores.win;
    } else if (choiceScores[enemy] === choiceScores[mine]) {
      roundScore += resultScores.draw;
    } else {
      roundScore += resultScores.loss;
    }

    return memo + roundScore;
  }, 0);

  // 2.
  // X - need to lose
  // Y - need a draw
  // Z - need to win
  const totalScorePartTwo = strategy.reduce((memo, current, i) => {
    const [enemy, mine] = current;

    let choice;
    let roundScore = 0;
    if (mine === 'X') { // lose
      choice = losingChoices[enemy];
      roundScore += resultScores.loss;
    } else if (mine === 'Y') { // draw
      choice = counterparts[enemy];
      roundScore += resultScores.draw;
    } else { // win
      choice = counterChoices[enemy];
      roundScore += resultScores.win;
    }

    roundScore += choiceScores[choice];

    return memo + roundScore;
  }, 0);

  console.log(`1. ${totalScorePartOne}`);
  console.log(`2. ${totalScorePartTwo}`);
})()
