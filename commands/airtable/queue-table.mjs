import axios from "axios";

const baseUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}/queue`
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

export async function readQueueTable() {
    const url = `${baseUrl}?maxRecords=10&view=Grid%20view`;
    return axios.get(url, getConfig);
}

export async function updateQueueTable(queueEntry, mainRole, offRole) {
  const data = {
    records: [
      {
        id: queueEntry.id,
        fields: {
          main_role: mainRole,
          off_role: offRole,
        }
      }
    ]
  }
  return axios.patch(baseUrl, data, postConfig);
}

export async function createQueueTableEntry(player, mainRole, offRole) {
  const data = {
    records: [
      {
        fields: {
          discord_id: player.discord_id,
          ign: player.ign,
          main_role: mainRole,
          off_role: offRole,
          top_mmr: player.top_mmr,
          jng_mmr: player.jng_mmr,
          mid_mmr: player.mid_mmr,
          bot_mmr: player.bot_mmr,
          sup_mmr: player.sup_mmr
        }
      }
    ]
  }
  return axios.post(baseUrl, data, postConfig);
}

export async function deleteFromQueueById(rowId) {
  return axios.delete(`${baseUrl}/${rowId}`, getConfig);
}

export async function emptyQueue(players) {
  const queryParam = players.map(x => {x.id}).join('&records=')

  return axios.delete(`${baseUrl}?records=${queryParam}`, getConfig);
}