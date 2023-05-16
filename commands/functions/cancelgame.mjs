import { respond } from "../discord/interaction-response.mjs";
import { deleteGameById } from "../airtable/active-games-table.mjs";

export async function cancelGame(discordEvent) {

    const gameId = discordEvent.data.options.find(x => x.name === "game-id").value

    try {
        await deleteGameById(gameId)
    } catch {
        await respond(discordEvent, `Error deleting game with id ${gameId}`)
        return
    }
    
    await respond(discordEvent, `Game ${gameId} has been cancelled`)
}