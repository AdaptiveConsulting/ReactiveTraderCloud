import { BlotterService } from "@/generated/TradingGateway"
import { bind } from "@react-rxjs/core"
import { map, scan } from "rxjs/operators"
import { Trade } from "./types"

const tradesStream$ = BlotterService.getTradeStream().pipe(
  map(({ updates }) =>
    updates.map((rawTrade) => ({
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
  ),
)

export const [useTrades, trades$] = bind<Trade[]>(
  tradesStream$.pipe(
    scan(
      (acc, trades) => ({
        ...acc,
        ...Object.fromEntries(
          trades.map((trade) => [trade.tradeId, trade] as const),
        ),
      }),
      {} as Record<number, Trade>,
    ),
    map((trades) => Object.values(trades).reverse()),
  ),
)
