import { createPlayer, updatePlayerIgn, getPlayerByDiscordId } from "../airtable/players-table.mjs";
import { respond } from "../discord/interaction-response.mjs";
import { getMMR } from "../riot/player-api.mjs";

export async function register(discordEvent) {
    
    const requesterId = discordEvent.member.user.id
    const options = discordEvent.data.options
    const ign = options.find(x => x.name === "ign").value
    const mainRole = options.find(x => x.name === "main-role").value
    const user = options.find(x => x.name === "user")
    const discordId = user ? user.value : requesterId
    
    // Check if player already reagisterd
    const players = (await getPlayerByDiscordId(discordId)).data.records.map(record => {
        const fields = record.fields
        fields.id = record.id
        return fields
    })

    if (players.length > 0) {
        console.log('Player already registered')
        await updatePlayerIgn(players[0], ign)
        await respond(discordEvent, `Updated <@${discordId}> summoner name to ${ign}`)
        return
    }

    // Get the player data
    let mmr = await getMMR(discordEvent, ign, requesterId);
    if (!mmr) {
        return
    }

    // Save the player info
    await createPlayer(discordId, ign, mainRole, mmr);

    // Message success!
    await respond(discordEvent, `Registered <@${discordId}> successully as ${ign}`)
}