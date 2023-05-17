import axios from "axios";

const baseUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}/players`
const getConfig = {
  headers: {
    'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
  }
};
const postConfig = {
  headers: {
    'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json'
  }
}

export async function createPlayer(discordId, ign, mainRole, mmr) {
  const data = {
    records: [
      {
        fields: {
          discord_id: discordId,
          ign: ign,
          top_mmr: getMMRForRole('top', mainRole, mmr),
          jng_mmr: getMMRForRole('jng', mainRole, mmr),
          mid_mmr: getMMRForRole('mid', mainRole, mmr),
          bot_mmr: getMMRForRole('bot', mainRole, mmr),
          sup_mmr: getMMRForRole('sup', mainRole, mmr)
        }
      }
    ]
  }
  return axios.post(baseUrl, data, postConfig);
}


export async function getPlayerByDiscordId(discordId) {
    const formula = `({discord_id} = '${discordId}')`

    const url = `${baseUrl}?maxRecords=1&view=Grid%20view&filterByFormula=${encodeURIComponent(formula)}`;
    return axios.get(url, getConfig);
}

export async function getPlayersByIgns(igns) {
    
    const players = []

    for (let i in igns) {
      const ign = igns[i]
      const formula = `({ign} = '${ign}')`
      const url = `${baseUrl}?maxRecords=10&view=Grid%20view&filterByFormula=${encodeURIComponent(formula)}`;
      const player = (await axios.get(url, getConfig)).data.records.map(record => {
          const fields = record.fields
          fields.id = record.id
          return fields
      });
      await sleep(200)
      players.push(player[0])
    }
    
    return players
}

export async function updatePlayerIgn(player, ign) {
  const data = {
    records: [
      {
        id: player.id,
        fields: {
          ign: ign,
        }
      }
    ]
  }
  return axios.patch(baseUrl, data, postConfig);
}

export async function updatePlayersMMR(mmrChanges) {
  const data = {
    records: mmrChanges
  }
  return axios.patch(baseUrl, data, postConfig);
}

function getMMRForRole(role, mainRole, mmr) {
  if (mainRole === role) {
    return mmr.mainRole
  }
  return mmr.offRole
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}