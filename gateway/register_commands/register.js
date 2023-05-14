require('dotenv').config()
const axios = require('axios').default;
console.log("LETS GOOO")

let url = `https://discord.com/api/v8/applications/${process.env.APP_ID}/guilds/${process.env.GUILD_ID}/commands`

console.log(`URL: ${url}`)
console.log(`BOT TOKEN: ${process.env.BOT_TOKEN}`)

const headers = {
  "Authorization": `Bot ${process.env.BOT_TOKEN}`,
  "Content-Type": "application/json"
}

let command_data = {
  "name": "foo",
  "type": 1,
  "description": "replies with bar ;/",
}

axios.post(url, JSON.stringify(command_data), {
  headers: headers,
})