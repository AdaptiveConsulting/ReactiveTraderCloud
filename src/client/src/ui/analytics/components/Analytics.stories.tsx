import { storiesOf } from '@storybook/react'
import React from 'react'
import { Story } from 'rt-storybook'
import { styled } from 'rt-theme'

import '../globals/index'
import initialProps, { analyticsLineChartModel } from '../test-resources/initialProps'
import Analytics from './Analytics'
import { AnalyticsLineChart } from './analyticsLineChart'
const stories = storiesOf('Analytics', module)

const Centered = styled('div')`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Div = styled('div')`
  width: 400px;
  height: 300px;
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
        <Div>
          <AnalyticsLineChart model={analyticsLineChartModel} />
        </Div>
      </Centered>
    </Story>
  ))
