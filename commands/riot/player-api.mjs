import axios from "axios";
import { respond } from "../discord/interaction-response.mjs";
import { seedMMR, getOffRoleMMR } from "./mmr-map.mjs"

const getConfig = {
    headers: {
        'X-Riot-Token': process.env.RIOT_API_KEY
    }
};

const summonerApiUrl = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'
const leaguesApiUrl = 'https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/'

export async function getMMR(discordEvent, ign, requesterId) {
    const encodedIgn = encodeURIComponent(ign)
    
    let summonerResponse = await axios.get(`${summonerApiUrl}${encodedIgn}`, getConfig)
    console.log(summonerResponse)
    
    if (summonerResponse.status === 404) {
      await respond(discordEvent, `<@${requesterId}> [${ign}] is not a valid summoner name`)
      return
    }
    
    if (summonerResponse.status === 403) {
      await respond(discordEvent, `<@${requesterId}> the Riot API key has expired, pester Jags`)
      return
    }
    
    if (summonerResponse.status !== 200) {
      await respond(discordEvent, `<@${requesterId}> Riots API has shit the bed. Get an admin to manually add you`)
      return
    }
    
    let leaguesResponse = await axios.get(`${leaguesApiUrl}${summonerResponse.data.id}`, getConfig)
    console.log(leaguesResponse)
    
    if (!leaguesResponse.data || leaguesResponse.data.length < 1) {
      await respond(discordEvent, `<@${requesterId}> [${ign}] has no rank and must be manually added by an Admin`)
      return
    }
    
    const mmrs = leaguesResponse.data.map(league => {
      const mainRoleMMR = seedMMR(league.tier, league.rank)
      return {
        mainRole: mainRoleMMR ,
        offRole: getOffRoleMMR(league.tier, mainRoleMMR )
      }
      
    })
    
    return mmrs.reduce(function(prev, current) {
      if (+current.mainRole> +prev.mainRole) {
        return current;
      } else {
        return prev;
      }
    });
}