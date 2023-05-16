import { embedResponse } from "../discord/interaction-response.mjs";
import { readQueueTable } from "../airtable/queue-table.mjs"
import { getRoleEmojis } from "../discord/emoji-utils.mjs";

export async function showQueue(discordEvent) {

    const queuedPlayers = (await readQueueTable()).data.records.map(record => {
        const fields = record.fields
        fields.id = record.id
        return fields
    })

    // Get the emojis
    const roleEmojis = await getRoleEmojis(discordEvent)

    // queue object
    var queue_map = {
        top: [],
        jng: [],
        mid: [],
        bot: [],
        sup: [],
        fill: [],
    }

    queuedPlayers.forEach(player => {
        queue_map[player.main_role].push(player.ign)
        if (player.main_role != 'fill') {
        queue_map[player.off_role].push(player.ign)
        }
    });

    const embeds = [
        {
            type: "rich",
            title: `Current Queue: ${queuedPlayers.length} players`,
            description: "",
            color: 0x00FFFF,
            fields: [{
                name: ``,
                value: `${roleEmojis['role_top']} ${queue_map.top}\n` +
                        `${roleEmojis['role_jng']} ${queue_map.jng}\n` +
                        `${roleEmojis['role_mid']} ${queue_map.mid}\n` +
                        `${roleEmojis['role_bot']} ${queue_map.bot}\n` +
                        `${roleEmojis['role_sup']} ${queue_map.sup}\n` +
                        `${roleEmojis['role_fill']} ${queue_map.fill}`,
            }]
        }
    ]

    await embedResponse(discordEvent, embeds)
}