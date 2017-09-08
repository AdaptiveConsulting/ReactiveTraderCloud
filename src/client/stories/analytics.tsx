import * as React from 'react'
import { storiesOf } from '@storybook/react'

import { default as analyticsProps, pnlChartModel, positionsChartModel } from './analytics/analyticsProps'
import Analytics from '../src/ui/analytics/Analytics'
import { PositionsBubbleChart } from '../src/ui/analytics/positions-chart/PositionsBubbleChart'
import AnalyticsBarChart from '../src/ui/analytics/chart/AnalyticsBarChart'
import PNLChart from '../src/ui/analytics/PNLChart'

storiesOf('Analytics', module)
  .add('Full panel', () =>
    <Analytics canPopout={false} {...analyticsProps} />)
  .add('Bubble Chart', () =>
    <div className="analytics__bubblechart-container">
      <span className="analytics__chart-title analytics__bubblechart-title">Positions</span>
      <PositionsBubbleChart data={positionsChartModel.seriesData} size={{ width: 400, height: 300 }}/>
    </div>)
  .add('P&L chart', () =>
    <div className="analytics analytics__container animated fadeIn">
      <PNLChart {...pnlChartModel}/>
    </div>)
  .add('Bar chart', () =>
    <div className="analytics__chart-container">
      <span className="analytics__chart-title">PnL</span>
      <AnalyticsBarChart chartData={positionsChartModel.seriesData} isPnL={true}/>
    </div>)
