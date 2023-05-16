import axios from "axios";

const baseUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}/active_games`
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

export async function readAllGames() {
    const url = `${baseUrl}?view=Grid%20view`;
    return axios.get(url, getConfig);
}

export async function createGame(blueTeam, redTeam) {
    const data = {
        records: [{
          fields: {
              b_top: blueTeam.top,
              b_jng: blueTeam.jng,
              b_mid: blueTeam.mid,
              b_bot: blueTeam.bot,
              b_sup: blueTeam.sup,
              r_top: redTeam.top,
              r_jng: redTeam.jng,
              r_mid: redTeam.mid,
              r_bot: redTeam.bot,
              r_sup: redTeam.sup,
              b_mmr: blueTeam.mmr,
              r_mmr: redTeam.mmr
          }
        }]
    }
    return axios.post(baseUrl, data, postConfig);
}

export async function deleteGameById(rowId) {
  return axios.delete(`${baseUrl}/${rowId}`, getConfig);
}