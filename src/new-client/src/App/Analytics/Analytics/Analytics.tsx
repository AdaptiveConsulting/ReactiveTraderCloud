import React from 'react'
import { ProfitAndLoss } from './ProfitAndLoss'
import { AnalyticsStyle, AnalyticsWrapper, AnalyticsHeader } from './styled'

import { Positions } from './Positions'
import { PnL } from './PnL'

export const Analytics: React.FC = () => {
  return (
    <AnalyticsWrapper>
      <AnalyticsHeader>Analytics</AnalyticsHeader>
      <AnalyticsStyle data-qa="analytics__analytics-content">
        <ProfitAndLoss />
        <React.Fragment>
          <Positions />
          <PnL />
        </React.Fragment>
      </AnalyticsStyle>
    </AnalyticsWrapper>
  )
}
