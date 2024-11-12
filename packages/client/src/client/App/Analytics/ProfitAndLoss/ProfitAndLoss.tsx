import { merge } from "rxjs"

import { SectionLayout } from "@/client/components/layout/SectionLayout"

import { AnalyticsLineChartWrapper, Title } from "../styled"
import { LastPosition, lastPosition$ } from "./LastPosition"
import { LineChart, lineChart$ } from "./LineChart"

export const ProfitAndLoss = () => (
  <SectionLayout
    Header={
      <>
        <Title>Profit &amp; Loss</Title>
        <LastPosition />
      </>
    }
    Body={
      <AnalyticsLineChartWrapper>
        <LineChart />
      </AnalyticsLineChartWrapper>
    }
  />
)

export const profitAndLoss$ = merge(lastPosition$, lineChart$)
