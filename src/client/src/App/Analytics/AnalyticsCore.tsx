import { Subscribe } from "@react-rxjs/core"
import { merge } from "rxjs"

import { supportsTearOut } from "@/App/TearOutSection/supportsTearOut"
import { TearOutComponent } from "@/App/TearOutSection/TearOutComponent"
import { isAnalyticsDataStale$ } from "@/services/analytics"
import { createSuspenseOnStale } from "@/utils/createSuspenseOnStale"
import { WithChildren } from "@/utils/utilityTypes"

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
