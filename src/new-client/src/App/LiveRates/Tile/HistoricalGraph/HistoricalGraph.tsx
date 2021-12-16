import styled from "styled-components"
import { getHistoricalPrices$, HistoryPrice } from "@/services/prices"
import { distinctUntilChanged, map, startWith } from "rxjs/operators"
import { getDataPoints, toSvgPath, withScales } from "@/utils/historicalChart"
import { combineLatest } from "rxjs"
import { curveBasis } from "d3"
import { symbolBind, useTileCurrencyPair } from "../Tile.context"
import { forwardRef, useEffect, useRef } from "react"
import { createKeyedSignal } from "@react-rxjs/utils"
import { equals } from "@/utils"

const VIEW_BOX_WIDTH = 200
const VIEW_BOX_HEIGHT = 90

const [size$, setSize] =
  createKeyedSignal<string, { width: number; height: number }>()

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
  width: 100%;
  height: ${({ showTimer }) => {
    return showTimer ? "60%" : "75%"
  }};
  grid-area: chart;
`

const Path = styled.path``
const Svg = styled.svg`
  &:hover ${Path} {
    stroke: #5f94f5;
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
>(({ showTimer, path, active, showCenterLine }, ref) => (
  <LineChartWrapper showTimer={showTimer} ref={ref}>
    <Svg>
      <Path
        stroke={active ? "#5f94f5" : "#737987"}
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
            stroke="#737987"
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
))

export const HistoricalGraph: React.FC<HistoricalGraphProps> = ({
  showTimer,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { symbol } = useTileCurrencyPair()
  useEffect(() => {
    const element = ref.current!

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

  return (
    <HistoricalGraphComponent showTimer={showTimer} ref={ref} path={path} />
  )
}
