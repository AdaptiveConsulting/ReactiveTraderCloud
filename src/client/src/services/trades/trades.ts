import { BlotterService } from "@/generated/TradingGateway"
import { bind } from "@react-rxjs/core"
import { Observable } from "rxjs"
import { map, scan } from "rxjs/operators"
import { withIsStaleData } from "../connection"
import { withConnection } from "../withConnection"
import { Trade } from "./types"
import { mockCreditTrades } from "./__mocks__/creditTrades"

const tradesStream$ = BlotterService.getTradeStream().pipe(
  withConnection(),
  map(({ isStateOfTheWorld, updates }) => ({
    isStateOfTheWorld,
    updates: updates.map((rawTrade) => ({
      tradeId: rawTrade.tradeId.toString(10),
      symbol: rawTrade.currencyPair, // TODO: talk with hydra team about this
      traderName: rawTrade.tradeName,
      notional: rawTrade.notional,
      dealtCurrency: rawTrade.dealtCurrency,
      direction: rawTrade.direction,
      status: rawTrade.status,
      spotRate: rawTrade.spotRate,
      tradeDate: new Date(rawTrade.tradeDate), // TODO: talk with hydra team about this
      valueDate: new Date(rawTrade.valueDate), // TODO: talk with hydra team about this
    })),
  })),
)

export const [useTrades, trades$] = bind<Trade[]>(
  tradesStream$.pipe(
    scan(
      (acc, { isStateOfTheWorld, updates }) => ({
        ...(isStateOfTheWorld ? {} : acc),
        ...Object.fromEntries(
          updates.map((trade) => [trade.tradeId, trade] as const),
        ),
      }),
      {} as Record<number, Trade>,
    ),
    map((trades) => {
      console.log("************************************", Object.values(trades))
      return Object.values(trades).reverse()
    }),
  ),
)

export const isBlotterDataStale$ = withIsStaleData(trades$)

const fakeCreditStream$ = new Observable<Trade[]>((subscriber) => {
  subscriber.next(mockCreditTrades)
  subscriber.complete()
})

export const [useCreditTrades, creditTrades$] = bind<Trade[]>(fakeCreditStream$)
