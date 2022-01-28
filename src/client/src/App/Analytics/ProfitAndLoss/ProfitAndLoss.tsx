import { FC } from "react"
import {
  Title,
  AnalyticsLineChartWrapper,
  ProfitAndLossHeader,
} from "../styled"
import { LineChart, lineChart$ } from "./LineChart"
import { LastPosition, lastPosition$ } from "./LastPosition"
import styled from "styled-components"
import { merge } from "rxjs"

export const ProfitAndLossStyle = styled.div`
  width: 100%;
  height: auto;
  grid-row-start: 1;
  grid-row-end: 2;
  grid-column: 1/-1;
`
export const ProfitAndLoss: FC = () => (
  <ProfitAndLossStyle>
    <ProfitAndLossHeader>
      <Title>Profit &amp; Loss</Title>
      <LastPosition />
    </ProfitAndLossHeader>
    <AnalyticsLineChartWrapper>
      <LineChart />
    </AnalyticsLineChartWrapper>
  </ProfitAndLossStyle>
)

export const profitAndLoss$ = merge(lastPosition$, lineChart$)
