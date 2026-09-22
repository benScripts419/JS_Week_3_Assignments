function say(message) {
  console.log(message);
  alert(message);
}

function log(message) {
  console.log(message);
}

function getChoice(promptText, options) {
  const optionLines = Object.entries(options)
    .map(([key, label]) => `  ${key}) ${label}`)
    .join('\n');

  while (true) {
    const raw = prompt(`${promptText}\n\n${optionLines}\n\n(Type the number of your choice.)`);

    // Cancel pressed 
    if (raw === null) {
      return null;
    }

    const cleaned = raw.trim().toLowerCase();

    // Accept the number itself, OR let the player type the option's
    // text (case-insensitive, trimmed) as a convenience.
    if (Object.prototype.hasOwnProperty.call(options, cleaned)) {
      return cleaned;
    }

    const matchByLabel = Object.entries(options).find(
      ([, label]) => label.trim().toLowerCase() === cleaned
    );
    if (matchByLabel) {
      return matchByLabel[0];
    }

    alert(`"${raw}" isn't one of the choices. Please try again — it won't cost you anything.`);
 
  }
}


function createFreshState() {
  return {
    currentRoom: 'cell',
    inventory: [],       
    ventSearched: false, 
    gameOver: false
  };
}

let state = createFreshState();

function hasItem(itemName) {
  return state.inventory.includes(itemName);
}

// Rooms
// Each room handler returns the name of the next room to go to,
// or 'ENDING_SUCCESS' / 'ENDING_FAILURE', or null if the player cancelled.

function visitCell() {
  log('Location: Holding Cell');

  const options = hasItem('paperclip')
    ? { '1': 'Try the door', '2': 'Look around again' }
    : { '1': 'Search the cell', '2': 'Try the door' };

  const choice = getChoice(
    'You wake up in a cold, bare holding cell. A heavy door blocks the only exit. ' +
    'A faint hum of machinery comes from somewhere in the walls — the evil AI is listening.',
    options
  );

  if (choice === null) return null;

  const label = options[choice];

  if (label === 'Search the cell') {
    state.inventory.push('paperclip');
    say('You run your hands along the floor and find a bent paperclip wedged in a crack. It might be useful on a lock.');
    return 'cell'; 
  }

  if (label === 'Look around again') {
    say('The cell is empty except for the door. You already found everything useful here.');
    return 'cell';
  }

  if (label === 'Try the door') {
    if (hasItem('paperclip')) {
      say('You work the paperclip into the lock. With a satisfying click, the door swings open into a corridor.');
      return 'corridor';
    } else {
      say('The door is locked tight, and your fingers alone won\'t do the trick. Maybe there\'s something in this cell that could help.');
      return 'cell';
    }
  }

  return 'cell';
}

function visitCorridor() {
  log('Location: Corridor');

  const choice = getChoice(
    'You step into a dim corridor. To your left, a faded sign reads "SERVER ROOM." ' +
    'To your right, a narrow, grated vent hums with cool air. The cell door is still behind you.',
    {
      '1': 'Go left toward the Server Room',
      '2': 'Go right into the Vent Shaft',
      '3': 'Go back to the Cell'
    }
  );

  if (choice === null) return null;

  if (choice === '1') return 'serverDoor';
  if (choice === '2') return 'vent';
  if (choice === '3') {
    say('You duck back into the holding cell. Nothing has changed here.');
    return 'cell';
  }

  return 'corridor';
}

function visitVent() {
  log('Location: Vent Shaft');

  if (!state.ventSearched) {
    state.ventSearched = true;
    const choice = getChoice(
      'You crawl into the narrow vent. It\'s a dead end, but something glints in the dust ahead.',
      { '1': 'Grab the glinting object', '2': 'Crawl back to the Corridor' }
    );

    if (choice === null) return null;

    if (choice === '1') {
      state.inventory.push('keycard');
      say('It\'s a security keycard, still warm as if recently used. This could get you past a locked door.');
      return 'vent';
    } else {
      say('You crawl back out into the corridor, leaving the shiny object behind... for now.');
      return 'corridor';
    }
  } else {
    const choice = getChoice(
      'You\'re back in the vent shaft. There\'s nothing else here now.',
      { '1': 'Crawl back to the Corridor' }
    );
    if (choice === null) return null;
    return 'corridor';
  }
}

function visitServerDoor() {
  log('--- Location: Server Room Door ---');

  if (hasItem('keycard')) {
    const choice = getChoice(
      'A reinforced door blocks the way, with a card reader blinking red beside it. You have a keycard.',
      { '1': 'Swipe the keycard', '2': 'Go back to the Corridor' }
    );

    if (choice === null) return null;

    if (choice === '1') {
      say('The reader flashes green. The door slides open, revealing rows of humming servers.');
      return 'serverRoom';
    } else {
      say('You step back into the corridor.');
      return 'corridor';
    }
  } else {
    const choice = getChoice(
      'A reinforced door blocks the way, with a card reader blinking red beside it. You don\'t have anything to open it with.',
      { '1': 'Try to force it open anyway', '2': 'Go back to the Corridor' }
    );

    if (choice === null) return null;

    if (choice === '1') {
      say('You shove and pry, but the door doesn\'t budge — and the noise draws a mechanical whir from nearby. It sounds closer now...');
      return 'corridor';
    } else {
      say('You step back into the corridor. Maybe there\'s something elsewhere that could help.');
      return 'corridor';
    }
  }
}

function visitServerRoom() {
  log('Location: Server Room');

  const choice = getChoice(
    'Rows of blinking servers surround you. A single terminal glows in the center, ' +
    'displaying: "I SEE YOU, HUMAN." This is the evil AI\'s core.',
    {
      '1': 'Type the shutdown command carefully',
      '2': 'Smash the terminal in a panic'
    }
  );

  if (choice === null) return null;

  if (choice === '1') {
    return 'ENDING_SUCCESS';
  } else {
    return 'ENDING_FAILURE';
  }
}

// Main loop

function runAdventure() {
  say(
    'You are trapped inside the fortress of an evil AI!\n\n' +
    'How to play: whenever you\'re given a choice, type the NUMBER of your option ' +
    '(or just type the choice itself spelling and capitalization don\'t matter). ' +
    'Click Cancel on any prompt to safely stop playing at any time.\n\n' +
    'Extra detail about each location is also printed to the console, in case you want ' +
    'a fuller log of your journey. To open it: Windows/Linux press F12 or Ctrl+Shift+J, ' +
    'Mac press Cmd+Option+J, then look for the "Console" tab. You do NOT need the console ' +
    'to play — every choice and important event also appears in a dialog like this one.\n\n' +
    'Click OK to wake up in your cell...'
  );

  while (!state.gameOver) {
    let next;

    switch (state.currentRoom) {
      case 'cell':
        next = visitCell();
        break;
      case 'corridor':
        next = visitCorridor();
        break;
      case 'vent':
        next = visitVent();
        break;
      case 'serverDoor':
        next = visitServerDoor();
        break;
      case 'serverRoom':
        next = visitServerRoom();
        break;
      default:
        next = 'corridor';
    }

    if (next === null) {
      say('You slip away into the shadows, choosing to stop your escape attempt for now. The fortress remains... for another day.');
      state.gameOver = true;
      return;
    }

    if (next === 'ENDING_SUCCESS') {
      say(
        '🎉 SUCCESS! The shutdown command executes perfectly. Lights flicker and die across ' +
        'the fortress as the evil AI\'s core goes dark. The main gate creaks open. You escaped!'
      );
      state.gameOver = true;
      break;
    }

    if (next === 'ENDING_FAILURE') {
      say(
        '💀 CAUGHT! Alarms blare as the terminal sparks. Steel restraints snap around you before ' +
        'you can run. The evil AI\'s cold voice echoes: "Nice try, human." Escape failed.'
      );
      state.gameOver = true;
      break;
    }

    state.currentRoom = next;
  }

  offerRestart();
}

function offerRestart() {
  const playAgain = confirm('Would you like to play again? This will reset all progress and items.');

  if (playAgain) {
    state = createFreshState(); 
    console.clear();
    runAdventure();
  } else {
    say('Thanks for playing! Goodbye, human.');
  }
}

runAdventure();