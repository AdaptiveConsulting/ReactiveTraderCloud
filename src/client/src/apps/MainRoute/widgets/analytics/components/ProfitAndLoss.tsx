import React, { FC } from 'react'
import { Title, AnalyticsLineChartWrapper, Header } from './styled'
import AnalyticsWindowHeader from './AnalyticsHeader'
import { AnalyticsLineChart } from './analyticsLineChart'
import LastPosition from './LastPosition'
import { AnalyticsLineChartModel } from '../model/AnalyticsLineChartModel'

export interface ProfitAndLossProps {
  canPopout: boolean
  analyticsLineChartModel: AnalyticsLineChartModel
  onPopoutClick?: (x: number, y: number) => void
}

export const ProfitAndLoss: FC<ProfitAndLossProps> = ({
  canPopout,
  analyticsLineChartModel,
  onPopoutClick,
}) => (
  <>
    <Header>
      <Title>Profit &amp; Loss</Title>
      <AnalyticsWindowHeader canPopout={canPopout} onPopoutClick={onPopoutClick} />
    </Header>
    <LastPosition lastPos={analyticsLineChartModel.lastPos} />
    <AnalyticsLineChartWrapper>
      <AnalyticsLineChart model={analyticsLineChartModel} />
    </AnalyticsLineChartWrapper>
  </>
)
