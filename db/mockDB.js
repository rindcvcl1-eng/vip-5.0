// server/db/mockDB.js
// In-memory mock DB for MVP. Replace with real DB in prod.
module.exports = {
  users: {
    // example AI user template for bootstrap:
    // 'ai-1': { id: 'ai-1', username: 'AI_Master_1', balance: 5_000_000_000, stocks: {}, history: [], isAI: true }
  },
  bets: [], // pending bets for current round
  stocks: {}, // symbol -> { price, totalSupply, holders, status, _history? }
  stockHistory: {}, // symbol -> [price1, price2, ...] (kept for momentum calc)
  roundHistory: [], // list of recent rounds: { dice:[..], sum, outcome, timestamp } ; ai uses this to estimate bias
  adminCodes: {}, // code -> { amount, expiresAt, used: false }
  config: {
    diceRollIntervalMs: 3 * 60 * 1000, // 3 minutes
    stockIntervalMs: 5 * 60 * 1000, // 5 minutes
    aiTradeIntervalMs: 10 * 60 * 1000,
    betOptions: [20000,50000,100000,200000,500000]
  }
};
