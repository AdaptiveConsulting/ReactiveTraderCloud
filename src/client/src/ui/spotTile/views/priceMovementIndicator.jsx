import React from 'react';
import classnames from 'classnames';
import { PriceMovementType } from '../../../services/model';

const PriceMovementIndicator = props => {
  let className = classnames(
    {
      'up': props.priceMovementType === PriceMovementType.Up,
      'down': props.priceMovementType ===  PriceMovementType.Down
    },
    'direction' // TODO rename styles to price-movement
  );
  return <div className={className}>{props.spread}</div>;
}

PriceMovementIndicator.propTypes ={
  priceMovementType: React.PropTypes.object.isRequired,
  spread: React.PropTypes.number.isRequired
};

export default PriceMovementIndicator;
