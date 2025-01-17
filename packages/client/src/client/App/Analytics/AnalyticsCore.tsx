import { merge } from "rxjs"
import styled from "styled-components"

import { Region } from "@/client/components/layout/Region"
import { TabBar, TabBarActionConfig } from "@/client/components/TabBar"
import { createSuspenseOnStale } from "@/client/utils/createSuspenseOnStale"
import { WithChildren } from "@/client/utils/utilityTypes"
import { isAnalyticsDataStale$ } from "@/services/analytics"

import { supportsTearOut } from "../TearOutSection/supportsTearOut"
import { TearOutComponent } from "../TearOutSection/TearOutComponent"
import { PnL, pnL$ } from "./PnL"
import { Positions, positions$ } from "./Positions"
import { ProfitAndLoss, profitAndLoss$ } from "./ProfitAndLoss"
import { ANALYTICS_WIDTH } from "./shared"
import { AnalyticsStyle } from "./styled"

const analytics$ = merge(pnL$, profitAndLoss$, positions$)

const SuspenseOnStaleData = createSuspenseOnStale(isAnalyticsDataStale$)

const actions: TabBarActionConfig = []

if (supportsTearOut) {
  actions.push({
    name: "tearOut",
    size: "sm",
    inner: (
      <TearOutComponent width={ANALYTICS_WIDTH + 10} section="analytics" />
    ),
  })
}

const AnalyticsRegion = styled(Region)`
  min-width: ${ANALYTICS_WIDTH}px;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
`

const Analytics = ({ children }: WithChildren) => {
  return (
    <AnalyticsRegion
      source$={analytics$}
      fallback={children}
      Header={
        <TabBar
          items={["Analytics"]}
          activeItem="Analytics"
          actions={actions}
        />
      }
      Body={
        <AnalyticsStyle
          role="region"
          aria-label="Trade and position analytics"
          data-qa="analytics__analytics-content"
        >
          <ProfitAndLoss />
          <Positions />
          <PnL />
        </AnalyticsStyle>
      }
    >
      <SuspenseOnStaleData />
    </AnalyticsRegion>
  )
}

export default Analytics
