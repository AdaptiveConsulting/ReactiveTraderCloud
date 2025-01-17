import { bind, shareLatest } from "@react-rxjs/core"
import { scaleLinear, SimulationNodeDatum } from "d3"
import { combineLatest, Observable } from "rxjs"
import {
  distinctUntilChanged,
  filter,
  map,
  scan,
  withLatestFrom,
} from "rxjs/operators"

import { theme$ } from "@/client/theme/ThemeContext"
import { equals } from "@/client/utils/equals"
import { formatAsWholeNumber } from "@/client/utils/formatNumber"
import { mapObject } from "@/client/utils/mapObject"
import { currentPositions$ } from "@/services/analytics"
import { currencyPairs$ } from "@/services/currencyPairs"

interface CCYPosition {
  symbol: string
  baseTradedAmount: number
}

export interface BubbleChartNode extends SimulationNodeDatum {
  id: string
  r: number
  color: string
  text: string
}

export const [useData, data$] = bind(
  combineLatest([currencyPairs$, currentPositions$]).pipe(
    filter((_, idx) => idx === 0),
  ),
)

export const nodes$: Observable<BubbleChartNode[]> = currentPositions$.pipe(
  map((positions) =>
    mapObject(positions, ({ baseTradedAmount, counterTradedAmount }) => ({
      baseTradedAmount,
      counterTradedAmount,
    })),
  ),
  distinctUntilChanged(equals),
  withLatestFrom(currencyPairs$),
  map(([positions, currencyPairs]) => {
    const aggregatedPositions = Object.entries(positions).reduce(
      (acc, [symbol, { baseTradedAmount, counterTradedAmount }]) => {
        const ccyPair = currencyPairs[symbol]
        const baseCurrency = ccyPair ? ccyPair.base : ""
        const counterCurrency = ccyPair ? ccyPair.terms : ""
        acc[baseCurrency] = (acc[baseCurrency] || 0) + baseTradedAmount
        acc[counterCurrency] = (acc[counterCurrency] || 0) + counterTradedAmount
        return acc
      },
      {} as Record<string, number>,
    )
    return Object.entries(aggregatedPositions)
      .map(([key, val]) => ({
        symbol: key,
        baseTradedAmount: val,
      }))
      .filter((posPerCCY: CCYPosition) => posPerCCY.baseTradedAmount !== 0)
  }),
  map((positionData) => {
    const minR = 15
    const maxR = 60
    const baseValues: number[] = positionData.map((val) =>
      Math.abs(val.baseTradedAmount),
    )
    const maxValue: number = Math.max(...baseValues) || 0
    const minValue: number =
      Math.min(...baseValues) !== maxValue ? Math.min(...baseValues) : 0
    return [
      positionData,
      {
        r: scaleLinear().domain([minValue, maxValue]).range([minR, maxR]),
      },
    ] as const
  }),
  withLatestFrom(theme$),
  scan(
    (acc, [[positionsData, scales], theme]) => {
      // start from scratch with a new object so deleted nodes are not silently included
      const newAcc: Record<string, BubbleChartNode> = {}
      positionsData.forEach((dataObj: CCYPosition) => {
        const color =
          dataObj.baseTradedAmount > 0
            ? theme.newTheme.color["Colors/Border/border-buy"]
            : theme.newTheme.color["Colors/Border/border-sell"]

        newAcc[dataObj.symbol] = Object.assign(
          acc[dataObj.symbol] || { id: dataObj.symbol },
          {
            color,
            r: scales.r(Math.abs(dataObj.baseTradedAmount)),
            text: formatAsWholeNumber(dataObj.baseTradedAmount),
          },
        )
      })
      return newAcc
    },
    {} as Record<string, BubbleChartNode>,
  ),
  map(Object.values),
  shareLatest(),
)
