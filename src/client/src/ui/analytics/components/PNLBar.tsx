import numeral from 'numeral'
import React from 'react'
import { CurrencyPair } from 'rt-types'
import { barBgColor, pointerColor } from '../globals/variables'

import { styled } from 'rt-theme'

export interface PNLBarProps {
  basePnl: number
  currencyPair: CurrencyPair
  index: number
  isPnL: boolean
  maxVal: number
  symbol: string
}

export default class PNLBar extends React.Component<PNLBarProps, {}> {
  barChartContainerRef = React.createRef<HTMLDivElement>()
  labelRef = React.createRef<HTMLSpanElement>()

  refreshState() {
    this.setState({ updateRequired: true })
  }

  componentDidMount() {
    this.refreshState()
  }

  calculateOffset() {
    if (!this.barChartContainerRef.current || !this.labelRef.current) {
      return 0
    }
    const containerBounds = this.barChartContainerRef.current.getBoundingClientRect()
    const labelBounds = this.labelRef.current.getBoundingClientRect()

    const leftPoint = labelBounds.left - containerBounds.left
    const rightPoint = containerBounds.right - labelBounds.right

    const offset = leftPoint < 0 ? Math.abs(leftPoint) : rightPoint < 0 ? rightPoint : 0
    return offset
  }

  getPusherRelativePosition() {
    if (!this.barChartContainerRef.current || !this.labelRef.current) {
      return 0
    }

    const containerBounds = this.barChartContainerRef.current.getBoundingClientRect().width
    const labelBounds = this.labelRef.current.getBoundingClientRect().width

    const availableSpace = (1 - labelBounds / containerBounds) * 100
    let relPointerPos = this.getRelativePointerPosition() - ((labelBounds / containerBounds) * 50 - 1)
    if (relPointerPos < 0) {
      relPointerPos = 0
    }

    return relPointerPos <= availableSpace ? relPointerPos : availableSpace
  }

  getRelativePointerPosition() {
    const { basePnl, maxVal } = this.props

    const isPositive = basePnl > 0
    const displayValue = (Math.abs(basePnl) / maxVal) * 100
    const xPosRelative = isPositive ? 50 + displayValue / 2 : 50 - displayValue / 2
    return xPosRelative
  }

  getRenderedLabel() {
    const { basePnl, symbol, currencyPair } = this.props

    const amount = numeral(basePnl)
      .format('0a')
      .toUpperCase()
    const labelText = `(${amount}) ${symbol}`

    const approxLabelWidth = labelText.length * 8
    const offset = this.calculateOffset() || -(approxLabelWidth / 2)

    return (
      <span ref={this.labelRef} className="analytics__barchart-label" style={{ left: offset }}>
        <span className="analytics__barchart-label-amount">({amount}) </span>
        <span>{currencyPair.base}</span>
        <span className="analytics__barchart-label-currency-terms">{currencyPair.terms}</span>
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
      <BarChart ref={this.barChartContainerRef}>
        <div>
          <div className="analytics__barchart-title-wrapper">
            <div className="analytics__barchart-label-wrapper">
              <div className="analytics__barchart-label-pusher" style={pusherStyle} />
              {label}
            </div>

            <div className="analytics__barchart-pointer-container" style={pointerPosition}>
              <div className="analytics__barchart-pointer--outline" />
              <div className="analytics__barchart-pointer" />
            </div>
          </div>

          <div className="analytics__barchart-bar-wrapper">
            <div className="analytics__barchart-bar-background" />
            <div className="analytics__barchart-border analytics__barchart-border--left" />
            <div className="analytics__barchart-border analytics__barchart-border--center" />
            <div className="analytics__barchart-border analytics__barchart-border--right" />
          </div>
        </div>
      </BarChart>
    )
  }
}

const BarChart = styled.div`
  position: relative;
  vertical-align: middle;
  padding-top: 0.5rem;
  padding-bottom: 0.75rem;
  height: 3rem;

  .analytics__barchart-indicator--negative {
    background-color: ${({ theme }) => theme.template.red.normal};
  }

  .analytics__barchart-indicator--positive {
    background-color: ${({ theme }) => theme.template.green.normal};
  }

  .analytics__barchart-bar {
    height: 0.125rem;
    overflow: hidden;
  }

  .analytics__barchart-bar-background {
    height: 0.125rem;
    width: 100%;
    background-color: ${barBgColor};
    position: absolute;
    margin-top: 0.125rem;
    opacity: 0.125;
  }

  .analytics__barchart-bar-wrapper {
    position: absolute;
    height: 0.25rem;
    width: 100%;
    margin-top: 2rem;
    vertical-align: middle;
  }

  .analytics__barchart-border {
    height: 0.325rem;
    width: 0.125rem;
    background-color: ${({ theme }) => theme.core.textColor};
    opacity: 0;
  }

  .analytics__barchart-border--center {
    position: absolute;
    left: calc(50% - 0.125rem);
  }

  .analytics__barchart-border--left {
    display: inline;
  }

  .analytics__barchart-border--right {
    right: 0;
    position: absolute;
  }

  .analytics__barchart-title-wrapper {
    width: 100%;
    height: 2rem;
    position: absolute;
  }

  .analytics__barchart-pointer-container,
  .analytics__barchart-label-pusher {
    transition: all ease ${({ theme }) => theme.motion.duration};
  }
  .analytics__barchart-pointer-container {
    position: absolute;
    margin-top: 1.5rem;
    transition: left ease ${({ theme }) => theme.motion.duration};
    z-index: 1;
    mix-blend-mode: exclusion;
  }

  .analytics__barchart-pointer {
    position: absolute;
    width: 0;
    height: 0;
    z-index: 1;
    top: 0.125rem;
    left: -0.375rem;
    border-width: 0.75rem 0.25rem 0 0.25rem;
    border-color: ${pointerColor} transparent transparent transparent;
    border-style: inset;
    border-radius: 50%;
    transform: rotate(360deg);
  }

  .analytics__barchart-label {
    font-size: 0.75rem;
    line-height: 2rem;
    white-space: nowrap;
  }

  .analytics__barchart-label-amount {
    font-weight: 900;
    margin-right: 0.25rem;
  }

  .analytics__barchart-label-pusher {
    height: 0.5rem;
    display: inline-block;
  }
  .analytics__barchart-label-wrapper {
    position: absolute;
    width: 100%;
    white-space: nowrap;
  }

  .analytics__barchart-container .analytics__barchart-amount {
    visibility: hidden;
    font-size: 18px;
    display: inline;
  }

  .analytics__barchart-container:hover .analytics__barchart-amount {
    visibility: visible;
  }
`
