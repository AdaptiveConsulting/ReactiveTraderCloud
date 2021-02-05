import { bind } from "@react-rxjs/core"
import { map, scan } from "rxjs/operators"
import { getStream$ } from "../client"
import { Trade, RawTradeUpdate } from "./types"

export const [useTrades, trades$] = bind<Trade[]>(
  getStream$<RawTradeUpdate>("blotter", "getTradesStream", {}).pipe(
    scan(
      (acc, { Trades: rawTrades }) => ({
        ...acc,
        ...Object.fromEntries(
          rawTrades
            .map((rawTrade) => ({
              tradeId: rawTrade.TradeId,
              symbol: rawTrade.CurrencyPair,
              traderName: rawTrade.TraderName,
              notional: rawTrade.Notional,
              dealtCurrency: rawTrade.DealtCurrency,
              direction: rawTrade.Direction,
              status: rawTrade.Status,
              spotRate: rawTrade.SpotRate,
              tradeDate: new Date(rawTrade.TradeDate),
              valueDate: new Date(rawTrade.ValueDate),
            }))
            .map((trade) => [trade.tradeId, trade] as const),
        ),
      }),
      {} as Record<number, Trade>,
    ),
    map((trades) => Object.values(trades).reverse()),
  ),
)
