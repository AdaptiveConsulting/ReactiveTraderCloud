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
import { DraggableComponent } from "@/components/DraggableComponent"

const analytics$ = merge(pnL$, profitAndLoss$, positions$)

const SuspenseOnStaleData = createSuspenseOnStale(isAnalyticsDataStale$)

const Analytics: React.FC = ({ children }) => {
  return (
    <Subscribe source$={analytics$} fallback={children}>
      <SuspenseOnStaleData />
      <DraggableComponent section="analytics">
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
      </DraggableComponent>
    </Subscribe>
  )
}

export default Analytics
