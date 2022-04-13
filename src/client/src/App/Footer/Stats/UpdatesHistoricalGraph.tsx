import { equals } from "@/utils"
import { getDataPoints, toSvgPath, withScales } from "@/utils/historicalChart"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { curveBasis } from "d3"
import { useEffect } from "react"
import { combineLatest } from "rxjs"
import { distinctUntilChanged, map, startWith } from "rxjs/operators"
import styled from "styled-components"
import { updatesPerSecondHistory$ } from "./Updates"

type Size = { width: number; height: number }

const DEFAULT_SIZE: Size = {
  width: 100,
  height: 20,
}

const [size$, setSize] = createSignal<Size>()

const [useHistoricalPath] = bind(
  combineLatest([
    updatesPerSecondHistory$,
    size$.pipe(startWith(DEFAULT_SIZE), distinctUntilChanged(equals)),
  ]).pipe(
    map(([updates, size]) => {
      const dataPoints = getDataPoints<number>((count, idx) => [
        new Date(idx),
        count,
      ])(updates)

      const scales = withScales([0, size.width], [0, size.height])(dataPoints)
      return toSvgPath(curveBasis)(scales)
    }),
  ),
)

const LineChartWrapper = styled.div<{ showTimer?: boolean }>`
  width: 100%;
  height: 100%;
  grid-area: chart;
`
const Path = styled.path``
const Svg = styled.svg`
  &:hover ${Path} {
    stroke: #5f94f5;
  }
`

type Props = {
  size?: {
    width: number
    height: number
  }
}

export const UpdatesHistoricalGraph = ({ size = DEFAULT_SIZE }: Props) => {
  const path = useHistoricalPath()

  useEffect(() => {
    setSize(size)
  }, [size])

  return path ? (
    <div style={{ ...size }}>
      <LineChartWrapper>
        <Svg>
          <Path
            stroke={"#737987"}
            strokeOpacity={0.9}
            strokeWidth={1.6}
            fill="none"
            d={path}
          />
        </Svg>
      </LineChartWrapper>
    </div>
  ) : null
}
