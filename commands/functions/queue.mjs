import { respond } from "../discord/interaction-response.mjs";
import { readQueueTable, updateQueueTable, createQueueTableEntry } from "../airtable/queue-table.mjs";
import { getPlayerByDiscordId } from "../airtable/players-table.mjs";

export async function addToQueue(discordEvent) {

    const requesterId = discordEvent.member.user.id
    const options = discordEvent.data.options
    const mainRole = options.find(x => x.name === "main-role").value
    const offRole = options.find(x => x.name === "off-role").value
    const user = options.find(x => x.name === "user")
    const discordId = user ? user.value : requesterId

    // Check player already in queue
    const queuedPlayers = (await readQueueTable()).data.records.map(record => {
        const fields = record.fields
        fields.id = record.id
        return fields
    })
    const playerInQueue = queuedPlayers.find(x => x.discord_id == discordId)
    console.log(queuedPlayers)

    // Fetch player info
    const players = (await getPlayerByDiscordId(discordId)).data.records.map(record => {
        const fields = record.fields
        fields.id = record.id
        return fields
    })
    if (players.length <= 0) {
        await respond(discordEvent, `<@${discordId}> you are not registered, please register first using the /register command`)
        return
    }
    const player = players[0]
    console.log(player)

    // check queue size
    const queueSize = queuedPlayers.length
    if (queueSize >= 10 && !playerInQueue) {
        await respond(discordEvent, `<@${discordId}> the queue is full. You have not been added.`)
        return
      }

    // validate request
    if (mainRole !== 'fill' && mainRole === offRole) {
        await respond(discordEvent, `<@${discordId}> you can't set both offRole and mainRole to the same value`)
        return
      }

    // Add player to queue
    if (playerInQueue) {
        await updateQueueTable(playerInQueue, mainRole, offRole)
        await respond(discordEvent, `<@${discordId}> queue entry has been updated`)
      } else {
        await createQueueTableEntry(player, mainRole, offRole)
        await respond(discordEvent, `<@${discordId}> has been added to the queue. There are ${queueSize + 1} players in the queue`)
      }
    
}