import * as React from 'react'
import * as classnames from 'classnames'
import './priceMovement.scss'

const priceMovementTypes = {
  Up: 'Up',
  Down: 'Down',
}

export interface PriceMovementIndicatorProps {
  priceMovementType: any
  spread: {
    formattedValue: string,
  }
}

const getCaretDirection = (priceMovement: string) => {

  const upDirectionClasses = {
    [priceMovementTypes.Up]: 'fa-caret-up',
    [priceMovementTypes.Down]: 'price-movement__icon--inactive',
  }

  const downDirectionClasses = {
    [priceMovementTypes.Down]: 'fa-caret-down',
    [priceMovementTypes.Up]: 'price-movement__icon--inactive',
  }

  'price-movement__icon--up fa fa-lg fa-caret-up'

  return {
    up: classnames('price-movement__icon--up fa fa-lg', upDirectionClasses[priceMovement]),
    down: classnames('price-movement__icon--down fa fa-lg', downDirectionClasses[priceMovement]),
  }
}

// tslint:disable-next-line:variable-name
const PriceMovementIndicator = (props: PriceMovementIndicatorProps) => {

  const { priceMovementType, spread } = props
  const priceMovementClassNames = getCaretDirection(priceMovementType.name)
  return (
    <div>
      <div className="price-movement">
        <i className={priceMovementClassNames.up}></i>
        <span className="price-movement__value">{spread.formattedValue}</span>
        <i className={priceMovementClassNames.down}></i>
      </div>
    </div>
  )
}

export default PriceMovementIndicator
