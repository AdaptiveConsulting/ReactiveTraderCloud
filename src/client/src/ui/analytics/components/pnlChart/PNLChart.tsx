/* tslint:disable */
import React from 'react'
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
  chartGradient = new ChartGradient()
  pnlChartRef = React.createRef<HTMLDivElement>()

  componentDidMount() {
    this.updateGradient()
  }

  componentDidUpdate() {
    this.updateGradient()
  }

  updateGradient = () =>
    this.pnlChartRef.current &&
    this.chartGradient.update(this.pnlChartRef.current, this.props.minPnl, this.props.maxPnl)

  configurePnLChart = (chart: any) => {
    const pnlTooltip = (el: any) => {
      console.log(chart)
      console.log(el)
      const date = timeFormat('%X')(new Date(el.value))
      const formatted = numeral(el.series[0].value).format('0.0a')

      return `<p class="analytics__chart-tooltip">
        <strong class="analytics__chart-tooltip-date">${date}:</strong>
        ${formatted}
      </p>`
    }
    chart.interactiveLayer.tooltip.contentGenerator(pnlTooltip)
  }

  prepareDatum = (seriesData: PricePoint[]) => ({
    series: 'PNL',
    label: 'PNL',
    area: true,
    color: 'rgba(127, 127, 127, 0.1)',
    values: seriesData
  })

  render() {
    const { options, seriesData } = this.props

    if (this.props.seriesData.length >= 0) {
      options.xAxis = {
        tickFormat: (d: string) => timeFormat('%X')(new Date(d))
      }
      options.yAxis = { tickFormat: (d: number) => numeral(d).format('0.0a') }

      return (
        <div ref={this.pnlChartRef}>
          <NVD3Chart
            type="lineChart"
            datum={[this.prepareDatum(seriesData)]}
            options={options}
            height={12 * 16}
            configure={this.configurePnLChart}
            margin={{ left: 16, right: 0, top: 8, bottom: 8 }}
          />
        </div>
      )
    }

    return null
  }
}
