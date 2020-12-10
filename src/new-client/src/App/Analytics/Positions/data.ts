import { scale, geom, layout, Selection } from "d3"
import { combineLatest, Observable } from "rxjs"
import {
  distinctUntilChanged,
  filter,
  map,
  scan,
  withLatestFrom,
} from "rxjs/operators"
import { colors } from "theme"
import { currentPositions$ } from "services/analytics"
import { currencyPairs$ } from "services/currencyPairs"
import { formatNumber } from "utils/formatNumber"
import { bind, shareLatest } from "@react-rxjs/core"
import { mapObject } from "utils/mapObject"
import { equals } from "utils/equals"

interface Scales {
  x: scale.Linear<number, number>
  y: scale.Linear<number, number>
  r: scale.Linear<number, number>
}

interface CCYPosition {
  symbol: string
  baseTradedAmount: number
}

export interface BubbleChartNode extends layout.force.Node {
  id: string
  r: number
  cx: number
  color: string
  text: string
}

export const [useData, data$] = bind(
  combineLatest([currencyPairs$, currentPositions$]).pipe(
    filter((_, idx) => idx === 0),
  ),
)

export const getNodes$ = (
  size$: Observable<{ width: number; height: number }>,
): Observable<BubbleChartNode[]> =>
  currentPositions$.pipe(
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
          acc[counterCurrency] =
            (acc[counterCurrency] || 0) + counterTradedAmount
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
    withLatestFrom(size$),
    map(([positionData, { width, height }]) => {
      const ratio: number = 12.5
      const minR: number = 15
      const maxR: number = 60
      const offset: number = maxR / 2
      const baseValues: number[] = positionData.map((val) =>
        Math.abs(val.baseTradedAmount),
      )
      const maxValue: number = Math.max(...baseValues) || 0
      const minValue: number =
        Math.min(...baseValues) !== maxValue ? Math.min(...baseValues) : 0
      return [
        positionData,
        {
          x: scale
            .linear()
            .domain([0, positionData.length])
            .range([-(width / ratio), width / ratio - offset]),
          y: scale
            .linear()
            .domain([0, positionData.length])
            .range([-(height / ratio), height / ratio]),
          r: scale.sqrt().domain([minValue, maxValue]).range([minR, maxR]),
        },
      ] as const
    }),
    scan((acc, [positionsData, scales]) => {
      positionsData.forEach((dataObj: CCYPosition, index: number) => {
        const color =
          dataObj.baseTradedAmount > 0
            ? colors.accents.positive.base
            : colors.accents.negative.base

        const node = acc[dataObj.symbol] || {}
        Object.assign(node, {
          color,
          id: dataObj.symbol,
          r: getRadius(dataObj, scales),
          cx: scales.x(index),
          text: formatNumber(dataObj.baseTradedAmount),
        })
        acc[dataObj.symbol] = node
      })
      return acc
    }, {} as Record<string, BubbleChartNode>),
    map((x) => Object.values(x)),
    shareLatest(),
  )

export function updateNodes(
  nodeGroup: Selection<any>,
  nodes: BubbleChartNode[],
): void {
  const nodeMap: Record<string, { x: number; y: number }> = {}
  nodeGroup.each(collide(0.1, nodes)).attr({
    transform: (d: BubbleChartNode) => {
      if (
        d.x !== undefined &&
        d.y !== undefined &&
        !isNaN(d.x) &&
        !isNaN(d.y)
      ) {
        nodeMap[d.id] = { x: d.x, y: d.y }
        return "translate(" + d.x.toFixed(4) + "," + d.y.toFixed(4) + ")"
      } else {
        nodeMap[d.id] = { x: 0, y: 0 }
        return "translate(0, 0)"
      }
    },
    id: (d: BubbleChartNode) => d.id,
  })

  nodes.forEach((node: BubbleChartNode) => {
    const newSettings = nodeMap[node.id]
    if (newSettings) {
      node.x = newSettings.x
      node.y = newSettings.y
    }
  })
}

export function drawCircles(
  nodeGroup: Selection<any>,
  duration: number = 800,
): void {
  nodeGroup
    .transition()
    .duration(duration)
    .attr({ r: (d: BubbleChartNode) => d.r })
    .style("filter", "url(#drop-shadow)")
    .style({ fill: (d: BubbleChartNode) => d.color })
}

const getRadius = (currValue: CCYPosition, scales: Scales) =>
  scales.r(Math.abs(currValue.baseTradedAmount))

function collide(alpha: number, nodes: BubbleChartNode[]) {
  const quadtree = geom.quadtree(nodes)
  const offset: number = -3

  return (d: any) => {
    let radius: number = d.r + 10 + offset
    const nx1: number = d.x - radius
    const nx2: number = d.x + radius
    const ny1: number = d.y - radius
    const ny2: number = d.y + radius

    return quadtree.visit(
      (quad: any, x1: number, y1: number, x2: number, y2: number) => {
        if (quad.point && quad.point !== d) {
          let x: number = d.x - quad.point.x
          let y: number = d.y - quad.point.y
          let l: number = Math.sqrt(x * x + y * y)
          radius = d.r + quad.point.r + offset
          if (l < radius) {
            l = ((l - radius) / l) * alpha
            d.x -= x *= l
            d.y -= y *= l
            quad.point.x += x
            quad.point.y += y
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1
      },
    )
  }
}
