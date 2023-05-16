import { embedResponse, respond } from "../discord/interaction-response.mjs";
import { readQueueTable, emptyQueue } from "../airtable/queue-table.mjs";
import { createGame } from "../airtable/active-games-table.mjs";
import { getRoleEmojis } from "../discord/emoji-utils.mjs";

export async function generateGame(discordEvent) {
    
    // Values
    const roles = ['top', 'jng', 'mid', 'bot', 'sup']
    const minOnRole = getMinOnRole(discordEvent.data.options)

    // Get players from queue
    const players = (await readQueueTable()).data.records.map(record => {
        const fields = record.fields
        fields.id = record.id
        return fields
    })

    if (players.length < 10) {
        await respond(discordEvent, `Not enough players in queue to generate a game`)
        return
    }

    // Create a game
    const matchMakingQueue = [getQueueObject()]
    const potentialMatches = []

    console.log('making matches')
    while (matchMakingQueue.length > 0) {
        const queueObject = matchMakingQueue.shift();
        // If the queue obect has 10 players add it to a potential match and skip iteration
        if (queueObject.index > 9) {
            queueObject.mmr_diff = Math.abs(queueObject.blue_mmr - queueObject.red_mmr)
            potentialMatches.push(queueObject);
            continue;
        }
    
        // collect plater info
        const player = players[queueObject.index];
        const mainRole = player.main_role;
        const offRole = player.off_role;
    
        // Add back to queue for main role
        if (queueObject[mainRole]> 0) {
            addToQueue(matchMakingQueue, queueObject, mainRole, player, true)
        }
    
        // Add back to queue for off role
        if (offRole === 'fill') {
            roles.forEach(role => {
            if (role !== mainRole && queueObject[role] > 0) {
                addToQueue(matchMakingQueue, queueObject, role, player, false)
            }
            })
        } else {
            if (queueObject[offRole] > 0) {
            addToQueue(matchMakingQueue, queueObject, offRole, player, false)
            }
        }

    }

    const filteredMatches = potentialMatches.filter(match => match.main_roles >= minOnRole)
    const sortedMatches = filteredMatches .sort(function(a, b) {
    return a.mmr_diff - b.mmr_diff;
    });

    console.log(sortedMatches[0])

    if (sortedMatches.length < 1) {
        await respond(discordEvent, `No matches found, not enough roles covered, or on-role flag is too high`)
        return
    }

    // Add to database
    const game = await createGame({
        top: sortedMatches[0].blue_top,
        jng: sortedMatches[0].blue_jng,
        mid: sortedMatches[0].blue_mid,
        bot: sortedMatches[0].blue_bot,
        sup: sortedMatches[0].blue_sup,
        mmr: (sortedMatches[0].blue_mmr / 5)
    }, {
        top: sortedMatches[0].red_top,
        jng: sortedMatches[0].red_jng,
        mid: sortedMatches[0].red_mid,
        bot: sortedMatches[0].red_bot,
        sup: sortedMatches[0].red_sup,
        mmr: (sortedMatches[0].red_mmr / 5)
    })

    // clear queue and print game
    // await emptyQueue(players)

    const roleEmojis = await getRoleEmojis(discordEvent)

    const embeds = [{
        type: "rich",
        title: `Game: ${game.data.records[0].id}`,
        description: "",
        color: 0x00FFFF,
        fields: [
        {
            name: `Blue Side`,
            value: `${roleEmojis['role_top']} ${sortedMatches[0].blue_top}\n` +
                    `${roleEmojis['role_jng']} ${sortedMatches[0].blue_jng}\n` +
                    `${roleEmojis['role_mid']} ${sortedMatches[0].blue_mid}\n` +
                    `${roleEmojis['role_bot']} ${sortedMatches[0].blue_bot}\n` +
                    `${roleEmojis['role_sup']} ${sortedMatches[0].blue_sup}`,
            inline: true
        },
        {
            name: `Red Side`,
            value: `${roleEmojis['role_top']} ${sortedMatches[0].red_top}\n` +
                    `${roleEmojis['role_jng']} ${sortedMatches[0].red_jng}\n` +
                    `${roleEmojis['role_mid']} ${sortedMatches[0].red_mid}\n` +
                    `${roleEmojis['role_bot']} ${sortedMatches[0].red_bot}\n` +
                    `${roleEmojis['role_sup']} ${sortedMatches[0].red_sup}`,
            inline: true
        }
        ]
    }]
    
    await embedResponse(discordEvent, embeds)
}

// Helper functions
function addToQueue(matchMakingQueue, queueObject, role, player, isMain) {
    // Add red
    if (queueObject[role] == 1) {
      addGame(matchMakingQueue, queueObject, role, player, isMain, 'red', 0)
    }
    
    // Add blue
    if (queueObject[role] == 2) {
      addGame(matchMakingQueue, queueObject, role, player, isMain, 'blue', 0)
    }
    
    // Add blue and red
    if (queueObject[role] == 4) {
      addGame(matchMakingQueue, queueObject, role, player, isMain, 'blue', 1)
      addGame(matchMakingQueue, queueObject, role, player, isMain, 'red', 2)
    }
  }
  
  function addGame(matchMakingQueue, queueObject, role, player, isMain, side, leftOverRole) {
    // To prevent matches duplicated with switched red/blue sides, dont add the first member to red side
    if (queueObject.index == 0 && side == 'red') {
      return
    }
    
    const objectCopy = Object.assign({}, queueObject);
    objectCopy.index++;
    objectCopy.main_roles += isMain ? 1 : 0
    objectCopy[`${side}_mmr`] += player[`${role}_mmr`]
    objectCopy[`${side}_${role}`] = player.ign
    objectCopy[role] = leftOverRole
    matchMakingQueue.push(objectCopy)
  }
  
  function getQueueObject () {
    return {
      index: 0,
      blue_mmr: 0,
      red_mmr: 0,
      mmr_diff: 0,
      main_roles: 0,
      blue_top: '',
      blue_jng: '',
      blue_mid: '',
      blue_bot: '',
      blue_sup: '',
      red_top: '',
      red_jng: '',
      red_mid: '',
      red_bot: '',
      red_sup: '',
      top: 4,
      jng: 4,
      mid: 4,
      bot: 4, 
      sup: 4
    }
  }

  function getMinOnRole(options) {
    if (!options) {
        return 7
    }
    return options.find(x => x.name === "min-on-role").value
  }