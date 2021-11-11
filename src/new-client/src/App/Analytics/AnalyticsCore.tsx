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
  HeaderAction,
} from "./styled"
import { createSuspenseOnStale } from "@/utils/createSuspenseOnStale"
import { isAnalyticsDataStale$ } from "@/services/analytics"

import { PopOutIcon } from "@/components/icons/PopOutIcon"
import styled from "styled-components"
import { tearOutAnalytics, tearOutEntryAnalytics$ } from "@/Web/tearoutSections"
import { useObservableSubscription } from "@/utils/useObservableSubscription"
import { openWindow } from "@/Web/utils/window"
import { constructUrl } from "@/utils/url"

import {
  useTearOutTileState,
  useTearOutTradeState,
} from "@/Web/tearoutSections"

const analytics$ = merge(pnL$, profitAndLoss$, positions$)

const SuspenseOnStaleData = createSuspenseOnStale(isAnalyticsDataStale$)

var isTornOut = false
const Analytics: React.FC = ({ children }) => {
  const tearOutTradeState = useTearOutTradeState("Trade")
  const tearOutTileState = useTearOutTileState("Analytics")
  useObservableSubscription(
    tearOutEntryAnalytics$.subscribe(async ([tornOut]) => {
      if (tornOut && !isTornOut) {
        isTornOut = true
        openWindow(
          {
            url: constructUrl("/analytics"),
            width: window.innerWidth * 0.15,
            name: "",
            height: window.innerHeight,
            center: "screen",
          },
          () => {
            isTornOut = false
            tearOutAnalytics(false)
          },
        )
      }
    }),
  )

  return (
    <Subscribe source$={analytics$} fallback={children}>
      <SuspenseOnStaleData />
      <AnalyticsInnerWrapper>
        <AnalyticsHeader>
          Analytics
          <RightNav>
            {!isTornOut && !(tearOutTileState && tearOutTradeState) && (
              <HeaderAction
                onClick={() => {
                  tearOutAnalytics(true)
                }}
              >
                <PopOutIcon />
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
