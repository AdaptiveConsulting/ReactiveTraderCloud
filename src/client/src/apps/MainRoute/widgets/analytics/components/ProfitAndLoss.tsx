import React, { FC } from 'react'
import { Title, AnalyticsLineChartWrapper, Header } from './styled'
import AnalyticsWindowHeader from './AnalyticsHeader'
import { AnalyticsLineChart } from './analyticsLineChart'
import LastPosition from './LastPosition'
import { AnalyticsLineChartModel } from '../model/AnalyticsLineChartModel'
import { styled } from 'rt-theme'

export interface ProfitAndLossProps {
  canPopout: boolean
  analyticsLineChartModel: AnalyticsLineChartModel
  onPopoutClick?: (x: number, y: number) => void
}

export const ProfitAndLossStyle = styled.div`
  width: 100%;
  height: auto;
  grid-row-start: 1;
  grid-row-end: 2;
  grid-column: 1/-1;
`
export const ProfitAndLoss: FC<ProfitAndLossProps> = ({
  canPopout,
  analyticsLineChartModel,
  onPopoutClick,
}) => (
  <ProfitAndLossStyle>
    <Header>
      <Title>Profit &amp; Loss</Title>
      <AnalyticsWindowHeader canPopout={canPopout} onPopoutClick={onPopoutClick} />
    </Header>
    <LastPosition lastPos={analyticsLineChartModel.lastPos} />
    <AnalyticsLineChartWrapper>
      <AnalyticsLineChart model={analyticsLineChartModel} />
    </AnalyticsLineChartWrapper>
  </ProfitAndLossStyle>
)
