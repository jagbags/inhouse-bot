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

let command_data = [
  {
    name: `register`,
    description: `register for the inhouse queue`,
    options: [
      {
        type: 3,
        name: "ign",
        description: "your league ign",
        required: true
      },
      {
        type: 3,
        name: "main-role",
        description: "your main role in ranked",
        choices: [
          {name: "top",value: "top"},
          {name: "jng",value: "jng"},
          {name: "mid",value: "mid"},
          {name: "bot",value: "bot"},
          {name: "sup",value: "sup"},
        ],
        required: true
      },
      {
        type: 6,
        name: "user",
        description: "The discord user to register"
      }
    ]
  },
  {
    name: `queue`,
    description: `Join a queue`,
    options: [
      {
        type: 3,
        name: "main-role",
        description: "your main role in ranked",
        choices: [
          {name: "top",value: "top"},
          {name: "jng",value: "jng"},
          {name: "mid",value: "mid"},
          {name: "bot",value: "bot"},
          {name: "sup",value: "sup"}
        ],
        required: true
      },
      {
        type: 3,
        name: "off-role",
        description: "your off role in ranked",
        choices: [
          {name: "top",value: "top"},
          {name: "jng",value: "jng"},
          {name: "mid",value: "mid"},
          {name: "bot",value: "bot"},
          {name: "sup",value: "sup"},
          {name: "fill",value: "fill"}
        ],
        required: true
      },
      {
        type: 6,
        name: "user",
        description: "The discord user to queue"
      }
    ]
  },
  {
    name: `showqueue`,
    description: `show the current state of the queue`
  },
  {
    name: `clearqueue`,
    description: `clear the current queue`
  },
  {
    name: `leave`,
    description: `leave a queue`
  },
  {
    name: `boot`,
    description: `boot a user from a queue`,
    options: [
      {
        type: 6,
        name: "user",
        description: "The discord user to boot from the queue",
        required: true
      }
    ]
  },
  {
    name: `cancelgame`,
    description: `cancel the current game`,
    options: [
      {
        type: 3,
        name: "game-id",
        description: "The id of the game to cancel",
        required: true
      }
    ]
  },
  {
    name: `generategame`,
    description: `generate a game from the queue`,
    options: [
      {
        type: 4,
        name: "min-on-role",
        description: "The minimum number of champions to have on role (default: 6)",
        choices: [
          {name: "0",value: 0},
          {name: "1",value: 1},
          {name: "2",value: 2},
          {name: "3",value: 3},
          {name: "4",value: 4},
          {name: "5",value: 5},
          {name: "6",value: 6},
          {name: "7",value: 7},
          {name: "8",value: 8},
          {name: "9",value: 9},
          {name: "10",value: 10}
        ]
      }
    ]
  },
  {
    name: `showgames`,
    description: `shows a list of active games`
  },
  {
    name: `markwin`,
    description: `mark the current game winner`,
    options: [
      {
        type: 3,
        name: "game-id",
        description: "The id of the game to mark",
        required: true
      },
      {
        type: 3,
        name: "winning-side",
        description: "which side won",
        required: true,
        choices: [
          {name: "blue", value: "blue"},
          {name: "red", value: "red"},
        ],
      }
    ]
  },
  // {
  //   name: `aram`,
  //   description: `mark the current game winner`,
  //   options: [
  //     {
  //       type: 4,
  //       name: "teams",
  //       description: "the number of teams/games to generate a pool for (default 2)",
  //       choices: [
  //         {name: "1",value: 1},
  //         {name: "2",value: 2},
  //         {name: "3",value: 3},
  //         {name: "4",value: 4},
  //         {name: "5",value: 5},
  //         {name: "6",value: 6}
  //       ]
  //     },
  //     {
  //       type: 4,
  //       name: "players",
  //       description: "the number of players per team (default 5)",
  //       choices: [
  //         {name: "3",value: 3},
  //         {name: "4",value: 4},
  //         {name: "5",value: 5}
  //       ]
  //     },
  //     {
  //       type: 4,
  //       name: "rolls",
  //       description: "the number of champs per player (default 2)",
  //       choices: [
  //         {name: "1",value: 1},
  //         {name: "2",value: 2},
  //         {name: "3",value: 3}
  //       ]
  //     }
  //   ]
  // }
]

axios.put(url, JSON.stringify(command_data), {
  headers: headers,
})