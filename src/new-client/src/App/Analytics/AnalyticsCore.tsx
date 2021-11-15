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

import { PopOutIcon } from "@/components/icons/PopOutIcon"
import styled from "styled-components"
import { supportsTearOut } from "@/Web/TearOutSection/supportsTearOut"
import { PopInIcon } from "@/components/icons/PopInIcon"
import { tearOutSection } from "@/Web/TearOutSection/state"
import { HeaderAction } from "@/components/styled"

const analytics$ = merge(pnL$, profitAndLoss$, positions$)

const SuspenseOnStaleData = createSuspenseOnStale(isAnalyticsDataStale$)

var isTornOut = false
const Analytics: React.FC = ({ children }) => {
  return (
    <Subscribe source$={analytics$} fallback={children}>
      <SuspenseOnStaleData />
      <AnalyticsInnerWrapper>
        <AnalyticsHeader>
          Analytics
          <RightNav>
            {supportsTearOut && !isTornOut && (
              <HeaderAction
                onClick={() => {
                  tearOutSection(true, "analytics")
                }}
              >
                {isTornOut ? <PopInIcon /> : <PopOutIcon />}
              </HeaderAction>
            )}
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
