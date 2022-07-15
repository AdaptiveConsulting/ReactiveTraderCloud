import * as tradesTestData from "./__mocks__/mockTrades"
export * from "./trades"
export { Direction, TradeStatus } from "./types"
export type { Trade, CreditTrade, FxTrade, AllTrades } from "./types"
export { tradesTestData }
export { creditTrades$ } from "./trades"
