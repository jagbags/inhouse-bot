import { respond } from "../discord/interaction-response.mjs";
import { getGameById, deleteGameById } from "../airtable/active-games-table.mjs";
import { getPlayersByIgns, updatePlayersMMR } from "../airtable/players-table.mjs"

export async function markWin(discordEvent) {
    const options = discordEvent.data.options
    const gameId = options.find(x => x.name === "game-id").value
    const side = options.find(x => x.name === "winning-side").value
    const K = 40; // this value controls how much the ELO MMR changes by
    const roles = ['top', 'jng', 'mid', 'bot', 'sup']

    // Get Data
    let game = (await getGameById(gameId)).data

    if (!game) {
        await respond(discordEvent, `No game found with ${gameId}`)
        return
    }

    const gameTableFields = game.fields
    let playerIgns = getPlayerIgns(gameTableFields)
    let players = await getPlayersByIgns(playerIgns)
    console.log(players)
 

    // calculate mmr
    const blueMMR = gameTableFields.b_mmr
    const redMMR = gameTableFields.r_mmr
    const [blueMMRChange, redMMRChange] = EloRating(blueMMR, redMMR, K, side);

    // Delete game by id
    await deleteGameById(gameId)

    // Udate MMR
    const updates = []
    for (let i in roles) {
      const role = roles[i]
      const bluePlayerIgn = gameTableFields[`b_${role}`]
      const bluePlayer = players.find(x => x.ign == bluePlayerIgn)
      updates.push({
        id: bluePlayer.id,
        fields: {
          [`${role}_mmr`]: bluePlayer[`${role}_mmr`] + blueMMRChange
        } 
      })
   
      const redPlayerIgn = gameTableFields[`r_${role}`]
      const redPlayer = players.find(x => x.ign == redPlayerIgn)
      updates.push({
        id: redPlayer.id,
        fields: {
          [`${role}_mmr`]: redPlayer[`${role}_mmr`] + redMMRChange
        } 
      })
    }

    console.log(updates)
    updatePlayersMMR(updates)

    await respond(discordEvent, `Game marked as win for ${side}`)
}

// HELPER FUNCTIONS
// Function to calculate the Probability
function Probability(rating1, rating2) {
  return ((1.0 * 1.0) / (1 + 1.0 * Math.pow(10, (1.0 * (rating1 - rating2)) / 480)));
}
  
// Function to calculate Elo rating
// K is a constant.
// d determines whether Player A wins
// or Player B.
function EloRating(blueMMR, redMMR, K, side) {

  let Pb = Probability(blueMMR, redMMR);
  let Pa = Probability(redMMR, blueMMR);
  
  // Case 1 When Player A wins
  // Updating the Elo Ratings
  if (side === 'blue') {
    blueMMR = Math.ceil((blueMMR + K * (1 - Pa)) - blueMMR);
    redMMR = Math.ceil((redMMR + K * (0 - Pb)) - redMMR);
  } else {
    blueMMR = Math.ceil((blueMMR + K * (0 - Pa)) - blueMMR);
    redMMR = Math.ceil((redMMR + K * (1 - Pb)) - redMMR);
  }

  return [blueMMR, redMMR]
}

function getPlayerIgns (gamePlayers) {
  const players = []
  players.push(gamePlayers.b_top)
  players.push(gamePlayers.b_jng)
  players.push(gamePlayers.b_mid)
  players.push(gamePlayers.b_bot)
  players.push(gamePlayers.b_sup)
  players.push(gamePlayers.r_top)
  players.push(gamePlayers.r_jng)
  players.push(gamePlayers.r_mid)
  players.push(gamePlayers.r_bot)
  players.push(gamePlayers.r_sup)
  return players
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}