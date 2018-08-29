/* tslint:disable */
import React from 'react'
import ReactDOM from 'react-dom'
// tslint:disable-next-line:noImplicitAny
import NVD3Chart from 'react-nvd3'
import { timeFormat } from 'd3-time-format'
import numeral from 'numeral'

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

export default class PNLChart extends React.Component<PNLChartProps> {
  chartGradient?: ChartGradient
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

  configurePnLChart = (chart: any) => {
    const { minPnl, maxPnl } = this.props

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

  prepareDatum(seriesData: PricePoint[]) {
    return [
      {
        series: 'PNL',
        label: 'PNL',
        area: true,
        color: 'rgba(127, 127, 127, 0.1)',
        values: seriesData
      }
    ]
  }

  render() {
    const { options, seriesData } = this.props

    if (this.props.seriesData.length >= 0) {
      options.xAxis = {
        tickFormat: (d: string) => timeFormat('%X')(new Date(d))
      }
      options.yAxis = { tickFormat: (d: number) => numeral(d).format('0.0a') }

      return (
        <NVD3Chart
          ref="pnlChart"
          type="lineChart"
          datum={this.prepareDatum(seriesData)}
          options={options}
          height={12 * 16}
          configure={this.configurePnLChart}
          margin={{ left: 16, right: 0, top: 8, bottom: 8 }}
        />
      )
    }

    return null
  }
}
