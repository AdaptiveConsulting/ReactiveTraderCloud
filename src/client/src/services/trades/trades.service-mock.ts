import { bind } from "@react-rxjs/core"
import { map, scan, startWith } from "rxjs/operators"
import { withIsStaleData } from "../connection"
import { executions$ } from "../executions"
import { Trade } from "./types"

export const [useTrades, trades$] = bind<Trade[]>(
  executions$.pipe(
    scan(
      (acc, trade) => ({
        ...acc,
        [trade.id]: trade,
      }),
      {} as Record<number, Trade>,
    ),
    map((trades) => Object.values(trades).reverse()),
    startWith([]),
  ),
)

export const isBlotterDataStale$ = withIsStaleData(trades$)
