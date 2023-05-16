import { embedResponse, respond } from "../discord/interaction-response.mjs";
import { readAllGames } from "../airtable/active-games-table.mjs";
import { getRoleEmojis } from "../discord/emoji-utils.mjs";

export async function showGames(discordEvent) {

    const games = (await readAllGames()).data.records.map(record => {
        const fields = record.fields
        fields.id = record.id
        return fields
    })

    // Get the emojis
    const roleEmojis = await getRoleEmojis(discordEvent)

    const embeds = games.map(games => {
        return {
            type: "rich",
            title: `Game: ${games.id}`,
            description: "",
            color: 0x00FFFF,
            fields: [
                {
                name: `Blue Side`,
                value: `${roleEmojis['role_top']} ${games.b_top}\n` +
                        `${roleEmojis['role_jng']} ${games.b_jng}\n` +
                        `${roleEmojis['role_mid']} ${games.b_mid}\n` +
                        `${roleEmojis['role_bot']} ${games.b_bot}\n` +
                        `${roleEmojis['role_sup']} ${games.b_sup}`,
                inline: true
                },
                {
                name: `Red Side`,
                value: `${roleEmojis['role_top']} ${games.r_top}\n` +
                        `${roleEmojis['role_jng']} ${games.r_jng}\n` +
                        `${roleEmojis['role_mid']} ${games.r_mid}\n` +
                        `${roleEmojis['role_bot']} ${games.r_bot}\n` +
                        `${roleEmojis['role_sup']} ${games.r_sup}`,
                inline: true
                }
            ]
        }
    })

    if (games.length > 0) {
        await embedResponse(discordEvent, embeds) 
    } else {
        respond(discordEvent, 'No active games to display')
    }
}