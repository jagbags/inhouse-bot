import { addToQueue } from './functions/queue.mjs';
import { register } from './functions/register.mjs';
import { showQueue } from './functions/showqueue.mjs';
import { leave } from './functions/leave.mjs';
import { generateGame } from './functions/generategame.mjs';
import { showGames } from './functions/showgames.mjs';
import { markWin } from './functions/markwin.mjs';
import { bootPlayer } from './functions/boot.mjs';
import { cancelGame } from './functions/cancelgame.mjs';

export async function handler(event) {
  console.log(event)

  const discordEvent = JSON.parse(event.Records[0].body)

  switch (discordEvent.data.name) {
    case 'register':
      await register(discordEvent);
      break;
    case 'queue':
      await addToQueue(discordEvent);
      break;
    case 'showqueue':
      await showQueue(discordEvent);
      break;
    case 'leave':
      await leave(discordEvent);
      break;
    case 'generategame':
      await generateGame(discordEvent);
      break;
    case 'showgames':
      await showGames(discordEvent);
      break;
    case 'markwin':
      await markWin(discordEvent);
      break;
    case 'boot':
      await bootPlayer(discordEvent);
      break;
    case 'cancelgame':
      await cancelGame(discordEvent);
      break;
    default:
  }
  

  return {}
}