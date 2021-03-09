import { Direction, Trade, TradeStatus } from "@/services/trades"

export const mockTrades: Trade[] = [
  {
    tradeId: 1111111111,
    traderName: "LMO",
    symbol: "GBPUSD",
    notional: 1_000_000,
    dealtCurrency: "GBP",
    direction: Direction.Buy,
    spotRate: 1.36665,
    tradeDate: new Date("2021-01-13T17:32:12.6003777+00:00"),
    valueDate: new Date("2021-01-15T17:32:12.6005967+00:00"),
    status: TradeStatus.Done,
  },
  {
    tradeId: 2222222222,
    traderName: "LMO",
    symbol: "USDJPY",
    notional: 1_000_000,
    dealtCurrency: "USD",
    direction: Direction.Buy,
    spotRate: 103.891,
    tradeDate: new Date("2021-01-13T17:32:26.7011799+00:00"),
    valueDate: new Date("2021-01-15T17:32:26.7012023+00:00"),
    status: TradeStatus.Pending,
  },
  {
    tradeId: 3333333333,
    traderName: "EDO",
    symbol: "USDJPY",
    notional: 10_000_000,
    dealtCurrency: "USD",
    direction: Direction.Buy,
    spotRate: 103.924,
    tradeDate: new Date("2021-01-13T20:02:39.4410315+00:00"),
    valueDate: new Date("2021-01-15T20:02:39.4410596+00:00"),
    status: TradeStatus.Rejected,
  },
]

export const nextTrade = {
  tradeId: 4444444444,
  traderName: "EDO",
  symbol: "USDJPY",
  notional: 1_000_000,
  dealtCurrency: "USD",
  direction: Direction.Sell,
  spotRate: 103.924,
  tradeDate: new Date("2021-01-14T20:02:39.4410315+00:00"),
  valueDate: new Date("2021-01-16T20:02:39.4410596+00:00"),
  status: TradeStatus.Done,
}
