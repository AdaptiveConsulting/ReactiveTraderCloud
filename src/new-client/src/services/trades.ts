import { bind } from "@react-rxjs/core";
import { map, scan } from "rxjs/operators";
import { getStream$ } from "./client";
import { CamelCase, CollectionUpdates } from "./utils";

export enum Direction {
  Buy = "Buy",
  Sell = "Sell",
}

export enum TradeStatus {
  Pending = "Pending",
  Done = "Done",
  Rejected = "Rejected",
}

interface TradeRaw {
  TradeId: number;
  CurrencyPair: string;
  TraderName: string;
  Notional: number;
  DealtCurrency: string;
  Direction: Direction;
  Status: TradeStatus;
  SpotRate: number;
  TradeDate: string;
  ValueDate: string;
}

interface RawTradeUpdate extends CollectionUpdates {
  Trades: TradeRaw[];
}

export interface Trade
  extends CamelCase<
    Omit<TradeRaw, "ValueDate" | "TradeDate" | "CurrencyPair">
  > {
  symbol: string;
  valueDate: Date;
  tradeDate: Date;
}

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
            .map((trade) => [trade.tradeId, trade] as const)
        ),
      }),
      {} as Record<number, Trade>
    ),
    map((trades) => Object.values(trades).reverse())
  )
);
