import * as React from 'react'
import * as classnames from 'classnames'
import './priceMovement.scss'

const priceMovementTypes = {
  Up: 'Up',
  Down: 'Down',
}

export interface PriceMovementIndicatorProps {
  priceMovementType: string
  spread: {
    formattedValue: string,
  }
}

// tslint:disable-next-line:variable-name
const PriceMovementIndicator = (props: PriceMovementIndicatorProps) => {

  const { priceMovementType, spread } = props

  const upDirectionClassName = classnames(
    'price-movement__icon--up fa fa-lg',
    {
      'fa-caret-up': priceMovementType === priceMovementTypes.Up,
    },
    {
      'price-movement__icon--inactive': priceMovementType === priceMovementTypes.Down,
    },
  )

  const downDirectionClassName = classnames(
    'price-movement__icon--down fa fa-lg',
    {
      'fa-caret-down': priceMovementType === priceMovementTypes.Down,
    },
    {
      'price-movement__icon--inactive': priceMovementType === priceMovementTypes.Up,
    },
  )

  return (
    <div>
      <div className="price-movement">
        <i className={upDirectionClassName}></i>
        <span className="price-movement__value">{spread.formattedValue}</span>
        <i className={downDirectionClassName}></i>
      </div>
    </div>
  )
}

export default PriceMovementIndicator
