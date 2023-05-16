import { respond } from "../discord/interaction-response.mjs";
import { readQueueTable } from "../airtable/queue-table.mjs"
import { deleteFromQueueById } from "../airtable/queue-table.mjs"

export async function leave(discordEvent) {
    const discordId = discordEvent.member.user.id

    // Check player already in queue
    const queuedPlayers = (await readQueueTable()).data.records.map(record => {
        const fields = record.fields
        fields.id = record.id
        return fields
    })
    const playerInQueue = queuedPlayers.find(x => x.discord_id == discordId)

    if (!playerInQueue) {
        await respond(discordEvent, `<@${discordId}> you are not in the queue`)
        return
    }

    await deleteFromQueueById(playerInQueue.id)

    await respond(discordEvent, `<@${discordId}> has been removed from the queue`)
}