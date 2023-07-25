import { Direction, QuoteState } from "generated/TradingGateway"

import { CreditTrade } from "../types"

export const mockCreditTrades: CreditTrade[] = [
  {
    tradeId: 1111111111,
    direction: Direction.Buy,
    tradeDate: new Date("2021-01-13T17:32:12.6003777+00:00"),
    status: QuoteState.Accepted,
    counterParty: "J.P. Morgan",
    cusip: "10077LBC9",
    security: "ORCL 4.755 08/15/2026",
    quantity: 10000,
    orderType: "AON",
    unitPrice: 100.65,
  },
  {
    tradeId: 2222222222,
    direction: Direction.Buy,
    tradeDate: new Date("2021-01-13T17:32:26.7011799+00:00"),
    status: QuoteState.Accepted,
    counterParty: "Wells Fargo",
    cusip: "10077LBC9",
    security: "AAPL 4.111 01/12/20246",
    quantity: 50000,
    orderType: "AON",
    unitPrice: 100.65,
  },
  {
    tradeId: 3333333333,
    direction: Direction.Buy,
    tradeDate: new Date("2021-01-13T20:02:39.4410315+00:00"),
    status: QuoteState.Accepted,
    counterParty: "Morgan Stanley",
    cusip: "105293N91",
    security: "ORCL 4.755 08/15/2026",
    quantity: 10000,
    orderType: "AON",
    unitPrice: 100.65,
  },
]
