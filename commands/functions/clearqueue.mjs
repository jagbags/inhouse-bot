import { respond } from "../discord/interaction-response.mjs";
import { readQueueTable, emptyQueue } from "../airtable/queue-table.mjs";

export async function clearQueue(discordEvent) {

    console.log("CLEAR QUEUE")
    const players = (await readQueueTable()).data.records.map(record => {
        const fields = record.fields
        fields.id = record.id
        return fields
    })
    console.log(players)

    await emptyQueue(players)

    await respond(discordEvent, 'Queue has been cleared')

}