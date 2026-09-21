function announce(message, useAlertToo) {
  console.log(message);
  if (useAlertToo) {
    alert(message);
  }
}

// Randomly returns the computer's move.
function computerPlay() {
  const options = ['Rock', 'Paper', 'Scissors'];
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}

/**
 * Cleans up whatever the player typed: trims whitespace,
 * lowercases it, and maps common short forms (r/p/s) to the
 * full word.
 */
function normalizeSelection(rawInput) {
  if (typeof rawInput !== 'string') return null;

  const cleaned = rawInput.trim().toLowerCase();

  const map = {
    rock: 'Rock',
    r: 'Rock',
    paper: 'Paper',
    p: 'Paper',
    scissors: 'Scissors',
    scissor: 'Scissors',
    s: 'Scissors'
  };

  return map[cleaned] || null;
}

function getPlayerSelection() {
  while (true) {
    const rawInput = prompt(
      'Round time! Type your move: "Rock", "Paper", or "Scissors"\n' +
      '(You can also just type R, P, or S. Not case-sensitive.)\n\n' +
      'Click Cancel at any time to safely quit the game.'
    );

    // prompt() returns null only when the user hits Cancel (or closes the dialog)
    if (rawInput === null) {
      return null;
    }

    const selection = normalizeSelection(rawInput);

    if (selection === null) {
      announce(
        `"${rawInput}" isn't a move I recognize. That attempt won't count ` +
        `please try again with Rock, Paper, or Scissors.`,
        true
      );
      continue; // ask again, does NOT count as a round
    }

    return selection;
  }
}

/**
 * Plays a single round and returns a result string describing what
 * happened, WITHOUT logging it directly — the caller decides what
 * to do with the result (this makes the function reusable/testable).
 *
 * @param {'Rock'|'Paper'|'Scissors'} playerSelection
 * @param {'Rock'|'Paper'|'Scissors'} computerSelection
 * @returns {'player'|'computer'|'tie'} who won the round
 */
function playRound(playerSelection, computerSelection) {
  if (playerSelection === computerSelection) {
    return 'tie';
  }

  const beats = {
    Rock: 'Scissors',
    Paper: 'Rock',
    Scissors: 'Paper'
  };

  if (beats[playerSelection] === computerSelection) {
    return 'player';
  }

  return 'computer';
}


function describeRound(playerSelection, computerSelection, outcome) {
  const base = `You chose ${playerSelection}. The evil AI chose ${computerSelection}.`;

  if (outcome === 'tie') {
    return `${base} It's a tie, no points awarded. Go again!`;
  }
  if (outcome === 'player') {
    return `${base} You win this round! Chip away at that AI.`;
  }
  return `${base} The AI wins this round. Don't give up!`;
}

function game() {
  let playerScore = 0;
  let computerScore = 0;
  let roundNumber = 1;

  const WINNING_SCORE = 3;

  while (playerScore < WINNING_SCORE && computerScore < WINNING_SCORE) {
    console.log(`\n--- Round ${roundNumber} --- (Score: You ${playerScore} - ${computerScore} AI)`);

    const playerSelection = getPlayerSelection();

    // Player pressed Cancel 
    if (playerSelection === null) {
      announce(
        'You have fled the challenge! The evil AI cannot claim ' +
        'victory today, but it cannot be stopped either. ' +
        'Come back and finish the game anytime!',
        true
      );
      return;
    }

    const computerSelection = computerPlay();
    const outcome = playRound(playerSelection, computerSelection);

    announce(describeRound(playerSelection, computerSelection, outcome));

    if (outcome === 'player') {
      playerScore++;
    } else if (outcome === 'computer') {
      computerScore++;
    }
    // ties: no score change

    announce(`Score is now — You: ${playerScore} | Evil AI: ${computerScore}`);

    roundNumber++;
  }

  // Announce the final winner.
  if (playerScore > computerScore) {
    announce(
      `🎉 VICTORY! You defeated the evil AI ${playerScore} rounds to ${computerScore}! ` +
      `The world is safe... for now.`,
      true
    );
  } else {
    announce(
      `💀 DEFEAT! The evil AI won ${computerScore} rounds to ${playerScore}. ` +
      `Refresh the page to try again and save the world!`,
      true
    );
  }
}

function startExperience() {
  alert(
    'MUAHAHAHA! I am the Evil AI, and I challenge you to a duel of ' +
    'Rock, Paper, Scissors!\n\n' +
    'Here is how to defeat me:\n' +
    '• We play rounds until one of us wins 3 rounds.\n' +
    '• Type your move when asked Rock, Paper, or Scissors (or R/P/S).\n' +
    '• Typos or nonsense answers won\'t hurt you, you\'ll just be asked again.\n' +
    '• Click Cancel on any prompt to safely stop the game.\n\n' +
    'One more thing: this browser has a "console", a panel where extra ' +
    'messages from this game will also be printed (like a detailed play-by-play). ' +
    'You don\'t NEED it to play, since every important message also pops up ' +
    'as a dialog like this one but if you\'re curious, you can open it with:\n' +
    '  Windows/Linux: F12 or Ctrl+Shift+J\n' +
    '  Mac: Cmd+Option+J\n' +
    'Then look for the "Console" tab.\n\n' +
    'Click OK to begin the duel!'
  );

  game();
}

startExperience();