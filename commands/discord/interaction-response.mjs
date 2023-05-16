import axios from 'axios';

const authConfig = {
    headers: {
      'Authorization': `Bot ${process.env.BOT_TOKEN}`
    }
};

export async function respond(discordEvent, message) {
    const data = {
        "content": message
    }

    try {
        const url = `https://discord.com/api/v10/webhooks/${process.env.APPLICATION_ID}/${discordEvent.token}`;

        await axios.post(url, data, authConfig);
    } catch (exception) {
        console.log(`There was an error posting a response: ${exception}`);
    }
}

export async function embedResponse(discordEvent, embed) {
    const data = {
        "embeds": embed
    }

    try {
        const url = `https://discord.com/api/v10/webhooks/${process.env.APPLICATION_ID}/${discordEvent.token}`;
        await axios.post(url, data, authConfig);
    } catch (exception) {
        console.log(`There was an error posting a response: ${exception}`);
    }
}