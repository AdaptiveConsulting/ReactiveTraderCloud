import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as numeral from 'numeral'

import '../AnalyticsStyles.scss'
import { CurrencyPair } from '../../../types/currencyPair'

export interface PNLBarProps {
  basePnl: number
  currencyPair: CurrencyPair
  index: number
  isPnL: boolean
  maxVal: number
  refs?: any[]
  symbol: string
}

export default class PNLBar extends React.Component<PNLBarProps, {}> {
  barChartContainerDOM: any
  labelDOM: any

  refreshState() {
    this.setState({ updateRequired: true })
  }

  componentDidMount() {
    this.barChartContainerDOM = ReactDOM.findDOMNode(this.refs.barChartContainer)
    this.labelDOM = ReactDOM.findDOMNode(this.refs.label)
    this.refreshState()
  }

  calculateOffset() {
    if (!this.refs.barChartContainer || !this.refs.label) return 0
    const containerBounds = this.barChartContainerDOM.getBoundingClientRect()
    const labelBounds = this.labelDOM.getBoundingClientRect()

    const leftPoint = labelBounds.left - containerBounds.left
    const rightPoint = containerBounds.right - labelBounds.right

    const offset = leftPoint < 0 ? Math.abs(leftPoint) : rightPoint < 0 ? rightPoint : 0
    return offset
  }

  getPusherRelativePosition() {
    if (!this.refs.barChartContainer || !this.refs.label) return 0

    const containerBounds = this.barChartContainerDOM.getBoundingClientRect().width
    const labelBounds = this.labelDOM.getBoundingClientRect().width

    const availableSpace = (1 - labelBounds / containerBounds) * 100
    let relPointerPos = this.getRelativePointerPosition() - (labelBounds / containerBounds * 50 - 1)
    if (relPointerPos < 0) {
      relPointerPos = 0
    }

    return relPointerPos <= availableSpace ? relPointerPos : availableSpace
  }

  getRelativePointerPosition() {
    const { basePnl, maxVal } = this.props

    const isPositive = basePnl > 0
    const displayValue = Math.abs(basePnl) / maxVal * 100
    const xPosRelative = isPositive ? 50 + displayValue / 2 : (50 - displayValue / 2)
    return xPosRelative
  }

  getRenderedLabel() {
    const { basePnl, symbol, currencyPair } = this.props

    const amount = numeral(basePnl).format('0a').toUpperCase()
    const amountHover = numeral(basePnl).format('0,0')
    const labelText = `(${amount}) ${symbol}`

    const approxLabelWidth = labelText.length * 8
    const offset = this.calculateOffset() || -(approxLabelWidth / 2)

    return (
      <span ref="label" className="analytics__barchart-label" style={{ left: offset }}>
        <span className="analytics__barchart-label-amount">({amount}) </span>
        <span>{currencyPair.base}</span>
        <span className="analytics__barchart-label-currency-terms">{currencyPair.terms}</span>
        <span className="analytics__barchart-label-amount--hover"> {amountHover}</span>
      </span>
    )
  }

  render() {
    const label = this.getRenderedLabel()
    const xPosRelative = this.getRelativePointerPosition()
    const xPosRelativePusher = this.getPusherRelativePosition()
    const pointerPosition = { left: xPosRelative + '%' }
    const pusherStyle = { width: xPosRelativePusher + '%' }

    return (
      <div ref="barChartContainer" className="analytics__barchart-container">
        <div>
          <div className="analytics__barchart-title-wrapper">
            <div className="analytics__barchart-label-wrapper">
              <div className="analytics__barchart-label-pusher" style={pusherStyle}></div>
              {label}
            </div>

            <div className="analytics__barchart-pointer-container" style={pointerPosition}>
              <div className="analytics__barchart-pointer--outline"/>
              <div className="analytics__barchart-pointer"/>
            </div>
          </div>

          <div className="analytics__barchart-bar-wrapper">
            <div className="analytics__barchart-bar-background"></div>
            <div className="analytics__barchart-border analytics__barchart-border--left"/>
            <div className="analytics__barchart-border analytics__barchart-border--center"/>
            <div className="analytics__barchart-border analytics__barchart-border--right"/>

          </div>
        </div>
      </div>
    )
  }
}
