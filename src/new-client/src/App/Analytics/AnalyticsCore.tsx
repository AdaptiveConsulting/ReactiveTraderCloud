import { merge } from "rxjs"
import { Subscribe } from "@react-rxjs/core"
import { ProfitAndLoss, profitAndLoss$ } from "./ProfitAndLoss"
import { Positions, positions$ } from "./Positions"
import { PnL, pnL$ } from "./PnL"
import {
  AnalyticsStyle,
  AnalyticsHeader,
  AnalyticsInnerWrapper,
} from "./styled"
import { createSuspenseOnStale } from "@/utils/createSuspenseOnStale"
import { isAnalyticsDataStale$ } from "@/services/analytics"

const analytics$ = merge(pnL$, profitAndLoss$, positions$)

const SuspenseOnStaleData = createSuspenseOnStale(isAnalyticsDataStale$)

const Analytics: React.FC = ({ children }) => {
  return (
    <Subscribe source$={analytics$} fallback={children}>
      <SuspenseOnStaleData />
      <AnalyticsInnerWrapper>
        <AnalyticsHeader>Analytics</AnalyticsHeader>
        <AnalyticsStyle
          role="region"
          aria-label="Trade and position analytics"
          data-qa="analytics__analytics-content"
        >
          <ProfitAndLoss />
          <Positions />
          <PnL />
        </AnalyticsStyle>
      </AnalyticsInnerWrapper>
    </Subscribe>
  )
}

export default Analytics
