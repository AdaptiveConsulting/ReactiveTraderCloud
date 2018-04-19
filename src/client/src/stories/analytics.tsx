import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { Analytics, AnalyticsBarChart, PositionsBubbleChart } from '../ui/analytics/index'
import { PricePoint } from '../ui/analytics/model/pnlChartModel'
import PNLChart from '../ui/analytics/PNLChart'
import { default as analyticsProps, pnlChartModel, positionsChartModel } from './analytics/analyticsProps'
import { getCurrencyPairs } from './currencyPairs'

storiesOf('Analytics', module)
  .add('Full panel', () =>
    <Analytics canPopout={false} {...analyticsProps} currencyPairs={getCurrencyPairs()} />)
  .add('Bubble Chart', () =>
    <div className="analytics__bubblechart-container">
      <span className="analytics__chart-title analytics__bubblechart-title">Positions</span>
      <PositionsBubbleChart data={positionsChartModel.seriesData} size={{ width: 400, height: 300 }}/>
    </div>)
  .add('P&L chart', () =>
    <div className="analytics analytics__container animated fadeIn">

      <PNLChart seriesData={pnlChartModel.seriesData as PricePoint[]}
                lastPos={pnlChartModel.lastPos}
                maxPnl={pnlChartModel.maxPnl}
                minPnl={pnlChartModel.minPnl}
                options={pnlChartModel.options}/>
    </div>)
  .add('Bar chart', () =>
    <div className="analytics__chart-container">
      <span className="analytics__chart-title">PnL</span>
      <AnalyticsBarChart chartData={positionsChartModel.seriesData} isPnL={true} currencyPairs={getCurrencyPairs()}/>
    </div>)
