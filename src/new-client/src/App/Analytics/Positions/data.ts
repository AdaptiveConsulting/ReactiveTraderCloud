import { scaleLinear, SimulationNodeDatum } from "d3"
import { combineLatest, Observable } from "rxjs"
import {
  distinctUntilChanged,
  filter,
  map,
  scan,
  withLatestFrom,
} from "rxjs/operators"
import { colors } from "@/theme"
import { currentPositions$ } from "@/services/analytics"
import { currencyPairs$ } from "@/services/currencyPairs"
import { formatAsWholeNumber } from "@/utils/formatNumber"
import { bind, shareLatest } from "@react-rxjs/core"
import { mapObject } from "@/utils/mapObject"
import { equals } from "@/utils/equals"

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
    const minR: number = 15
    const maxR: number = 60
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
  scan((acc, [positionsData, scales]) => {
    // start from scratch with a new object so deleted nodes are not silently included
    const newAcc: Record<string, BubbleChartNode> = {}
    positionsData.forEach((dataObj: CCYPosition) => {
      const color =
        dataObj.baseTradedAmount > 0
          ? colors.accents.positive.base
          : colors.accents.negative.base

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
  }, {} as Record<string, BubbleChartNode>),
  map(Object.values),
  shareLatest(),
)
