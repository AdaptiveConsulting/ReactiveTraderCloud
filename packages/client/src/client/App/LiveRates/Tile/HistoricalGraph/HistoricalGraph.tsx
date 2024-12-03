import { createKeyedSignal } from "@react-rxjs/utils"
import { curveBasis } from "d3"
import { forwardRef, useEffect, useRef } from "react"
import { combineLatest } from "rxjs"
import { distinctUntilChanged, map, startWith } from "rxjs/operators"
import styled, { useTheme } from "styled-components"

import { equals } from "@/client/utils"
import {
  getDataPoints,
  toSvgPath,
  withScales,
} from "@/client/utils/historicalChart"
import { getHistoricalPrices$, HistoryPrice } from "@/services/prices"

import { symbolBind, useTileCurrencyPair } from "../Tile.context"

const VIEW_BOX_WIDTH = 200
const VIEW_BOX_HEIGHT = 90

const [size$, setSize] = createKeyedSignal<
  string,
  { width: number; height: number }
>()

const [useHistoricalPath, historicalGraph$] = symbolBind((symbol: string) =>
  combineLatest([
    getHistoricalPrices$(symbol),
    size$(symbol).pipe(
      startWith({
        width: VIEW_BOX_WIDTH,
        height: VIEW_BOX_HEIGHT,
      }),
      distinctUntilChanged(equals),
    ),
  ]).pipe(
    map(([historicalPrices, { width, height }]) => {
      const dataPoints = getDataPoints<HistoryPrice>((price, idx) => [
        new Date(idx),
        price.mid,
      ])(historicalPrices)

      const scales = withScales([0, width], [0, height])(dataPoints)
      return toSvgPath(curveBasis)(scales)
    }),
  ),
)

const LineChartWrapper = styled.div<{ showTimer?: boolean }>`
  width: 45%;
  height: 108px;
  grid-area: chart;
`

const Path = styled.path``
const Svg = styled.svg`
  width: 100%;
  &:hover ${Path} {
    stroke: ${({ theme }) => theme.newTheme.color["Colors/Border/border-buy"]};
  }
`

export { historicalGraph$ }

interface HistoricalGraphProps {
  showTimer: boolean
}

interface HistoricalGraphComponentProps {
  showTimer: boolean
  path: string
  active?: boolean
  showCenterLine?: boolean
}

export const HistoricalGraphComponent = forwardRef<
  HTMLDivElement,
  HistoricalGraphComponentProps
>(function HistoricalGraphComponent(
  { showTimer, path, active, showCenterLine },
  ref,
) {
  const theme = useTheme()
  return (
    <LineChartWrapper showTimer={showTimer} ref={ref}>
      <Svg data-testid="tile-graph">
        <Path
          stroke={
            active
              ? theme.newTheme.color["Colors/Border/border-buy"]
              : theme.newTheme.color["Colors/Text/text-primary (900)"]
          }
          strokeOpacity={0.9}
          strokeWidth={1.6}
          fill="none"
          d={path}
        />
        {showCenterLine && (
          <g>
            <line
              y="0"
              strokeDasharray="4 3"
              strokeOpacity="0.9"
              strokeWidth="0.8"
              fill="none"
              fillOpacity="1"
              x1="0"
              y1="40"
              x2={"200"}
              y2="40"
            ></line>
          </g>
        )}
      </Svg>
    </LineChartWrapper>
  )
})

export const HistoricalGraph = ({ showTimer }: HistoricalGraphProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { symbol } = useTileCurrencyPair()
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const resizeObserver = new ResizeObserver(
      (entries: Array<ResizeObserverEntry>) => {
        const { width, height } = entries[0].contentRect
        setSize(symbol, { width, height })
      },
    )

    resizeObserver.observe(element)

    return () => {
      resizeObserver.unobserve(element)
    }
  }, [symbol])

  const path = useHistoricalPath()

  return path ? (
    <HistoricalGraphComponent showTimer={showTimer} ref={ref} path={path} />
  ) : null
}
