export function seedMMR(tier, rank) {
    return mmrMap[tier][rank]
}

export function getOffRoleMMR(tier, MMR) {
    return Math.ceil(MMR * offRolePenalty[tier])
}

const offRolePenalty = {
    CHALLENGER: 0.9,
    GRANDMASTER: 0.9,
    MASTER: 0.9,
    DIAMOND: 0.9,
    PLATINUM: 0.9,
    GOLD: 0.9,
    SILVER: 0.8,
    BRONZE: 0.8,
    IRON: 0.7
  }
  
  
  // https://lichess.org/stat/rating/distribution/blitz
  // https://www.leagueofgraphs.com/rankings/rank-distribution
  // comment percentages are cumulative
  const mmrMap = {
    CHALLENGER: {
      I: 2700 // 100%
    
    },
    GRANDMASTER: {
      I: 2600 // 99.18
    },
    MASTER: {
      I: 2500 // 99.13%
    },
    DIAMOND: {
      I: 2400, // 98.7%
      II: 2350, // 98.1%
      III: 2300, // 97.55%
      IV: 2250, // 97.02%
    },
    PLATINUM: {
      I: 2175, // 96.11%
      II: 2100, // 94.21%
      III: 2050, // 92.51%
      IV: 2000, // 90.71%
    },
    GOLD: {
      I: 1950, // 87.41%
      II: 1850, // 83.21%
      III: 1800, // 78.61%
      IV: 1750, // 74.01%
    },
    SILVER: {
      I: 1650, // 66.61%
      II: 1550, // 58.11%
      III: 1450,  // 49.51%
      IV: 1375, // 42.31%
    },
    BRONZE: {
      I: 1300, // 33.11%
      II: 1150, // 23.51%
      III: 1050, // 15.61%
      IV: 950, // 9.41%
    },
    IRON: {
      I: 800, // 3.81%
      II: 700, // 1.31%
      III: 600, // 0.37%
      IV: 500, // 0.10%
    }
  }