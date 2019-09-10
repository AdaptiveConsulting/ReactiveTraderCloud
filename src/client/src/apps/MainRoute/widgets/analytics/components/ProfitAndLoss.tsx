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
    <Header>
      <Title>Profit &amp; Loss</Title>
      {popoutButton}
    </Header>
    <LastPosition lastPos={analyticsLineChartModel.lastPos} />
    <AnalyticsLineChartWrapper>
      <AnalyticsLineChart model={analyticsLineChartModel} />
    </AnalyticsLineChartWrapper>
  </ProfitAndLossStyle>
)
