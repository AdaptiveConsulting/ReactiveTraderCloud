import * as React from 'react'
import * as classnames from 'classnames'

import { PriceMovementTypes } from '../../types'

export interface PriceMovementIndicatorProps {
  priceMovementType: any
  spread: {
    formattedValue: string,
  }
}

const getCaretDirection = (priceMovement: string) => {

  const upDirectionClasses = {
    [PriceMovementTypes.Up]: 'fa-caret-up',
    [PriceMovementTypes.Down]: 'price-movement__icon--inactive',
  }

  const downDirectionClasses = {
    [PriceMovementTypes.Down]: 'fa-caret-down',
    [PriceMovementTypes.Up]: 'price-movement__icon--inactive',
  }

  return {
    up: classnames('price-movement__icon--up fa fa-lg', upDirectionClasses[priceMovement]),
    down: classnames('price-movement__icon--down fa fa-lg', downDirectionClasses[priceMovement]),
  }
}

// tslint:disable-next-line:variable-name
const PriceMovementIndicator = (props: PriceMovementIndicatorProps) => {

  const { priceMovementType, spread } = props
  const priceMovementClassNames = getCaretDirection(priceMovementType)
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
