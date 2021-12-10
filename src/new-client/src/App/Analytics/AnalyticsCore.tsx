import { merge } from "rxjs"
import { Subscribe } from "@react-rxjs/core"
import { ProfitAndLoss, profitAndLoss$ } from "./ProfitAndLoss"
import { Positions, positions$ } from "./Positions"
import { PnL, pnL$ } from "./PnL"
import {
  AnalyticsStyle,
  AnalyticsHeader,
  AnalyticsInnerWrapper,
  RightNav,
} from "./styled"
import { createSuspenseOnStale } from "@/utils/createSuspenseOnStale"
import { isAnalyticsDataStale$ } from "@/services/analytics"
import { supportsTearOut } from "@/App/TearOutSection/supportsTearOut"
import { TearOutComponent } from "@/App/TearOutSection/TearOutComponent"

import { useHoritzontalResizeValues } from "@/components/resizeState"
import { TearOutContext } from "@/App/TearOutSection/tearOutContext"
import { useContext } from "react"

const analytics$ = merge(pnL$, profitAndLoss$, positions$)

const SuspenseOnStaleData = createSuspenseOnStale(isAnalyticsDataStale$)

const Analytics: React.FC = ({ children }) => {
  const resizeHSize = useHoritzontalResizeValues()
  const tearOutContext = useContext(TearOutContext)

  return (
    <Subscribe source$={analytics$} fallback={children}>
      <SuspenseOnStaleData />
      <AnalyticsInnerWrapper
        width={!tearOutContext.isTornOut ? resizeHSize : null}
      >
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
