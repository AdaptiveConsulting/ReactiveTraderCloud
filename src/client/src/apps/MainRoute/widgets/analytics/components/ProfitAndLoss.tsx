import React, { FC } from 'react'
import { AnalyticsLineChartWrapper } from './styled'
import { AnalyticsLineChart } from './analyticsLineChart'
import LastPosition from './LastPosition'
import { AnalyticsLineChartModel } from '../model/AnalyticsLineChartModel'
import { styled } from 'rt-theme'

export const ProfitAndLossStyle = styled.div`
  width: 100%;
  height: 20rem;
  grid-row-start: 2;
  grid-row-end: 3;
  grid-column: 1/-1;
`

export interface ProfitAndLossProps {
  analyticsLineChartModel: AnalyticsLineChartModel
}

export const ProfitAndLoss: FC<ProfitAndLossProps> = ({ analyticsLineChartModel }) => (
  <ProfitAndLossStyle>
    <LastPosition lastPos={analyticsLineChartModel.lastPos} />
    <AnalyticsLineChartWrapper>
      <AnalyticsLineChart model={analyticsLineChartModel} />
    </AnalyticsLineChartWrapper>
  </ProfitAndLossStyle>
)
