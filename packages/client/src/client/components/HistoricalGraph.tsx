import styled from "styled-components"

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

export type Size = { width: number; height: number }

type Props = {
  path: string
  size?: Size
}

const DEFAULT_SIZE: Size = {
  width: 100,
  height: 20,
}

export const HistoricalGraph = ({ path, size = DEFAULT_SIZE }: Props) => (
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
)
