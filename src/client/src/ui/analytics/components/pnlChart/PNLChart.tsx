/* tslint:disable */
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as classnames from 'classnames'
// tslint:disable-next-line:noImplicitAny
import * as NVD3Chart from 'react-nvd3'
import { timeFormat } from 'd3-time-format'
import * as numeral from 'numeral'

import ChartGradient from './chartGradient'

export interface PnlChartModelOptions {
  xAxis: {
    tickFormat: (string: string) => string
  }
  yAxis: {
    tickFormat: (number: number) => string
  }
  showYAxis: boolean
  showXAxis: boolean
  showLegend: boolean
  useInteractiveGuideline: boolean
  duration: number
  margin: {
    left: number
    top: number
    right: number
    bottom: number
  }
}

export interface PNLChartProps {
  lastPos: number
  maxPnl: number
  minPnl: number
  options: PnlChartModelOptions
  seriesData: PricePoint[]
}

export interface PricePoint {
  x: Date
  y: string
}

export default class PNLChart extends React.Component<PNLChartProps, {}> {
  chartGradient: ChartGradient
  refs: any

  componentDidMount() {
    this.updateGradient()
  }

  componentDidUpdate() {
    this.updateGradient()
  }

  updateGradient() {
    if (this.refs.pnlChart) {
      if (!this.chartGradient) {
        this.chartGradient = new ChartGradient()
      }
      const chartDomElement = ReactDOM.findDOMNode(this.refs.pnlChart)
      if (chartDomElement) {
        this.chartGradient.update(chartDomElement as Element, this.props.minPnl, this.props.maxPnl)
      }
    }
  }

  prepareDatum(seriesData: PricePoint[]) {
    return [
      {
        series: 'PNL',
        label: 'PNL',
        area: true,
        color: 'slategray',
        values: seriesData
      }
    ]
  }

  render() {
    const { lastPos, minPnl, maxPnl, options, seriesData } = this.props

    const analyticsHeaderClassName = classnames('analytics__header-value', {
      'analytics__header-value--negative': lastPos < 0,
      'analytics__header-value--positive': lastPos > 0
    })
    const formattedLastPos = numeral(lastPos).format()
    let pnlChart: any = null

    if (this.props.seriesData.length >= 0) {
      const configurePnLChart = (chart: any) => {
        const pnlTooltip = (el: any) => {
          const date = timeFormat('%X')(new Date(el.value))
          const formatted = numeral(el.series[0].value).format('0.0a')

          return `<p class="analytics__chart-tooltip">
            <strong class="analytics__chart-tooltip-date">${date}:</strong>
            ${formatted}
          </p>`
        }
        chart.yDomain([minPnl, maxPnl]).yRange([150, 0])
        chart.interactiveLayer.tooltip.contentGenerator(pnlTooltip)
      }

      options.xAxis = {
        tickFormat: (d: string) => timeFormat('%X')(new Date(d))
      }
      options.yAxis = { tickFormat: (d: number) => numeral(d).format('0.0a') }

      pnlChart = (
        <NVD3Chart
          ref="pnlChart"
          type="lineChart"
          datum={this.prepareDatum(seriesData)}
          options={options}
          height={240}
          configure={configurePnLChart}
        />
      )
    } else {
      pnlChart = <div>No PNL data yet</div>
    }

    return (
      <div>
        <div className="analytics__header">
          <span className="analytics__header-title">
            <i className="analytics__header-title-icon glyphicon glyphicon-stats" />
            Profit &amp; Loss
          </span>
          <span className={analyticsHeaderClassName}>USD {formattedLastPos}</span>
        </div>
        <div className="analytics__chart-container">{pnlChart}</div>
      </div>
    )
  }
}
