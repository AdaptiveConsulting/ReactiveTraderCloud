import * as React from 'react'
import * as classnames from 'classnames'
import './price-button.scss'

interface PriceButtonProps {
  className: string
  direction: { name: 'Buy' | 'Sell' | string }
  rate: {
    pips: any
    bigFigure: number
    pipFraction: number
    rawRate: number,
  },
  onExecute: () => void
}

// tslint:disable-next-line:variable-name
const PriceButton = (props: PriceButtonProps) => {
  const { direction, rate } = props
  const classes = classnames('price-button', props.className)
  const paddedPips = rate.pips.toString().length === 1
    ? `0${rate.pips}`
    : rate.pips

  let bigFigureDisplay = rate.bigFigure === Math.floor(rate.rawRate)
    ? `${rate.bigFigure}.`
    : rate.bigFigure

  if (bigFigureDisplay.toString().length === 3) {
    bigFigureDisplay += '0'
  }
  return (
    <div className={classes} onClick={() => props.onExecute()}>
      <span className="price-button__wrapper">
        <span className="price-button__big-figure">
          <span className="price-button__direction">
            {direction.name}
          </span><br />
          {bigFigureDisplay}
        </span>
        <span className="price-button__pip">{paddedPips}</span>
        <span className="price-button__tenth">{rate.pipFraction}</span>
      </span>
    </div>
  )
}

export default PriceButton
