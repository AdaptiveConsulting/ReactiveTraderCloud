import { storiesOf } from '@storybook/react'
import React from 'react'
import { Story } from 'rt-storybook'
import { styled } from 'rt-theme'

import '../globals/index'
import initialProps, {
  analyticsLineChartModel,
  positionsChartModel,
} from '../test-resources/initialProps'
import Analytics from './Analytics'
import { AnalyticsLineChart } from './analyticsLineChart'
import { AnalyticsBarChart } from './analyticsBarChart'
import PositionsBubbleChart from './positions-chart/PositionsBubbleChart'
import { AnalyticsStyle } from './styled'

const stories = storiesOf('Analytics', module)

const Centered = styled('div')`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Wrapper = styled('div')`
  width: 400px;
  height: 300px;
`

const BubbleChartWrapper = styled(AnalyticsStyle)`
  text-anchor: middle;
  overflow: hidden;
  background-color: ${({ theme }) => theme.core.darkBackground};
`

stories
  .add('Default', () => (
    <Story>
      <Centered>
        <div style={{ height: '100%', width: '350px' }}>
          <Analytics {...initialProps} />
        </div>
      </Centered>
    </Story>
  ))
  .add('AnalyticsLineChart', () => (
    <Story>
      <Centered>
        <Wrapper>
          <AnalyticsLineChart model={analyticsLineChartModel} />
        </Wrapper>
      </Centered>
    </Story>
  ))
  .add('BubbleChart', () => (
    <Story>
      <Centered>
        <BubbleChartWrapper>
          <PositionsBubbleChart
            data={initialProps.positionsChartModel.seriesData}
            currencyPairs={initialProps.currencyPairs}
          />
        </BubbleChartWrapper>
      </Centered>
    </Story>
  ))
  .add('AnalyticsBarChart', () => (
    <Story>
      <Centered>
        <Wrapper>
          <AnalyticsBarChart chartData={positionsChartModel.seriesData} />
        </Wrapper>
      </Centered>
    </Story>
  ))
