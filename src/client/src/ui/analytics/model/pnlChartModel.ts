import { time } from 'd3'
import * as _ from 'lodash'
import * as numeral from 'numeral'

import { PnlChartModelOptions } from '../PNLChart'

export interface PricePoint {
  x: any
  y: any
}

export interface PNLChartModel {
  lastPos: number
  maxPnl: number
  minPnl: number
  options: PnlChartModelOptions
  seriesData: PricePoint[]
}

const DEFAULT_PNL = {
  lastPos: 0,
  minPnl: 0,
  maxPnl: 0,
  seriesData: []
}

export const getPnlChartModel = history => {
  return {
    ...getPnlPositions(history),
    options: {
      xAxis: {
        tickFormat: d => time.format('%X')(new Date(d))
      },
      yAxis: {
        tickFormat: d => numeral(d).format('0.0a')
      },
      showYAxis: true,
      showXAxis: true,
      showLegend: false,
      useInteractiveGuideline: true,
      duration: 0,
      margin: {
        left: 30,
        top: 10,
        right: 0,
        bottom: 24
      }
    }
  }
}

const getLimit = (values: number[], callback) => {
  return callback(...values, 0)
}

export const getPnlPositions = (positions = []) => {
  const allPricePoints: number[] = positions
    .filter(item => !_.isNull(item.usdPnl))
    .map(item => item.usdPnl.toFixed(2))

  const seriesData: PricePoint[] = positions
    .filter(item => !_.isNull(item.usdPnl))
    .map(item => ({ x: new Date(item.timestamp), y: item.usdPnl.toFixed(2) }))

  const lastPosition = _.last(positions)
  if (lastPosition) {
    return {
      seriesData,
      lastPos: lastPosition.usdPnl.toFixed(2),
      minPnl: getLimit(allPricePoints, Math.min),
      maxPnl: getLimit(allPricePoints, Math.max)
    }
  }
  return DEFAULT_PNL
}
