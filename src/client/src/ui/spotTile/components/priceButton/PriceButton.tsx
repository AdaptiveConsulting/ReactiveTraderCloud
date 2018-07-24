import * as classnames from 'classnames'
import * as React from 'react'

import { Direction, Rate } from 'rt-types'

interface PriceButtonProps {
  className: string
  direction: Direction
  rate: Rate
  onExecute: () => void
}

const renderPips = (pips: number) => (pips.toString().length === 1 ? `0${pips}` : pips)
const getBigFigureDisplay = (bigFigure: number, rawRate: number) =>
  bigFigure === Math.floor(rawRate) ? `${bigFigure}.` : bigFigure.toString()
const renderBigFigureDisplay = (bigFigureDisplay: string) =>
  bigFigureDisplay.toString().length === 3 ? `${bigFigureDisplay}0` : bigFigureDisplay

const PriceButton = (props: PriceButtonProps) => {
  const { direction, rate } = props
  const classes = classnames('price-button', props.className)
  const bigFigure = getBigFigureDisplay(rate.bigFigure, rate.rawRate)

  return (
    <div className={classes} onClick={() => props.onExecute()}>
      <span className="price-button__wrapper">
        <span className="price-button__big-figure">
          <span className="price-button__direction">{direction}</span>
          <br />
          {renderBigFigureDisplay(bigFigure)}
        </span>
        <span className="price-button__pip">{renderPips(rate.pips)}</span>
        <span className="price-button__tenth">{rate.pipFraction}</span>
      </span>
    </div>
  )
}

export default PriceButton
