import { Observable } from "rxjs";
import { getStream$ } from "./client";

interface CurrencyPairPositionRaw {
  Symbol: string;
  BasePnl: number;
  BaseTradedAmount: number;
  CounterTradedAmount: number;
}

interface HistoryRaw {
  Timestamp: string;
  UsdPnl: number;
}

interface PositionsRaw {
  CurrentPositions: CurrencyPairPositionRaw[];
  History: HistoryRaw[];
}

export const usdAnalytics$: Observable<PositionsRaw> = getStream$<
  PositionsRaw,
  string
>("analytics", "getAnalitics", "USD");
