import { Subscribe } from "@react-rxjs/core"
import { supportsTearOut } from "client/App/TearOutSection/supportsTearOut"
import { TearOutComponent } from "client/App/TearOutSection/TearOutComponent"
import { createSuspenseOnStale } from "client/utils/createSuspenseOnStale"
import { WithChildren } from "client/utils/utilityTypes"
import { merge } from "rxjs"
import { isAnalyticsDataStale$ } from "services/analytics"

import { PnL, pnL$ } from "./PnL"
import { Positions, positions$ } from "./Positions"
import { ProfitAndLoss, profitAndLoss$ } from "./ProfitAndLoss"
import {
  AnalyticsHeader,
  AnalyticsInnerWrapper,
  AnalyticsStyle,
  RightNav,
} from "./styled"

const analytics$ = merge(pnL$, profitAndLoss$, positions$)

const SuspenseOnStaleData = createSuspenseOnStale(isAnalyticsDataStale$)

const Analytics = ({ children }: WithChildren) => {
  return (
    <Subscribe source$={analytics$} fallback={children}>
      <SuspenseOnStaleData />
      <AnalyticsInnerWrapper>
        <AnalyticsHeader>
          Analytics
          <RightNav>
            {supportsTearOut && <TearOutComponent section="analytics" />}
          </RightNav>
        </AnalyticsHeader>
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
