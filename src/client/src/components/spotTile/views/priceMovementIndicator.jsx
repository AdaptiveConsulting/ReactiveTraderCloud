import React from 'react';
import classnames from 'classnames';
import { PriceMovementType, Spread } from '../../../services/model';

const PriceMovementIndicator = props => {
  let className = classnames(
    {
      'up': props.priceMovementType === PriceMovementType.Up,
      'down': props.priceMovementType ===  PriceMovementType.Down
    },
    'direction' // TODO rename styles to price-movement
  );
  return <div className={className}>{props.spread.formattedValue}</div>;
}

PriceMovementIndicator.propTypes ={
  priceMovementType: React.PropTypes.instanceOf(PriceMovementType).isRequired,
  spread: React.PropTypes.instanceOf(Spread).isRequired,
};

export default PriceMovementIndicator;
