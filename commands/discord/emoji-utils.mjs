import axios from 'axios';

const authConfig = {
    headers: {
      'Authorization': `Bot ${process.env.BOT_TOKEN}`
    }
};

export async function getRoleEmojis(discordEvent) {
  
    const url = `https://discord.com/api/v10/guilds/${discordEvent.guild_id}/emojis`;
    const emojis = (await axios.get(url, authConfig)).data;
    
    const roleEmojis = {
        role_top: '🏝️',
        role_jng: '🌳',
        role_mid: '🧙‍♂️',
        role_bot: '🏹',
        role_sup: '🚑',
        role_fill: '⭐',
    }
    
    emojis.forEach(emoji => {
        if (Object.keys(roleEmojis).includes(emoji.name)) {
        roleEmojis[emoji.name] = `<:${emoji.name}:${emoji.id}>`
        }
    })
    
    return roleEmojis
}