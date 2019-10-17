import React, { FC } from 'react'
import { Title, AnalyticsLineChartWrapper, Header } from './styled'
import { AnalyticsLineChart } from './analyticsLineChart'
import LastPosition from './LastPosition'
import { AnalyticsLineChartModel } from '../model/AnalyticsLineChartModel'
import { styled } from 'rt-theme'

interface ProfitAndLossProps {
  analyticsLineChartModel: AnalyticsLineChartModel
  popoutButton?: React.ReactElement
}

export const ProfitAndLossStyle = styled.div`
  width: 100%;
  height: auto;
  grid-row-start: 1;
  grid-row-end: 2;
  grid-column: 1/-1;
`
export const ProfitAndLoss: FC<ProfitAndLossProps> = ({
  analyticsLineChartModel,
  popoutButton,
}) => (
  <ProfitAndLossStyle>
    {popoutButton}
    <Header>
      <Title>Profit &amp; Loss</Title>
      <LastPosition lastPos={analyticsLineChartModel.lastPos} />
    </Header>
    <AnalyticsLineChartWrapper>
      <AnalyticsLineChart model={analyticsLineChartModel} />
    </AnalyticsLineChartWrapper>
  </ProfitAndLossStyle>
)
