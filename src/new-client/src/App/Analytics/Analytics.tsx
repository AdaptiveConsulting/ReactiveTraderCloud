import { merge } from "rxjs"
import { Subscribe } from "@react-rxjs/core"
import { Loader } from "components/Loader"
import { ProfitAndLoss, profitAndLoss$ } from "./ProfitAndLoss"
import { Positions, positions$ } from "./Positions"
import { PnL, pnL$ } from "./PnL"
import {
  AnalyticsStyle,
  AnalyticsWrapper,
  AnalyticsHeader,
  AnalyticsInnerWrapper,
} from "./styled"

const analytics$ = merge(pnL$, profitAndLoss$, positions$)

export const Analytics: React.FC = () => {
  return (
    <AnalyticsWrapper>
      <Subscribe
        source$={analytics$}
        fallback={<Loader minWidth="22rem" minHeight="22rem" />}
      >
        <AnalyticsInnerWrapper>
          <AnalyticsHeader>Analytics</AnalyticsHeader>
          <AnalyticsStyle data-qa="analytics__analytics-content">
            <ProfitAndLoss />
            <Positions />
            <PnL />
          </AnalyticsStyle>
        </AnalyticsInnerWrapper>
      </Subscribe>
    </AnalyticsWrapper>
  )
}
