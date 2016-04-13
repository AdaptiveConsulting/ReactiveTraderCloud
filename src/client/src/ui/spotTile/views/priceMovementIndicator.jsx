import React from 'react';
import classnames from 'classnames';
import { PriceMovementType, Spread } from '../../../services/model';
import './priceMovement.scss';

const PriceMovementIndicator = props => {
  let className = classnames(
    {
      'price-movement__icon--up fa fa-caret-up': props.priceMovementType === PriceMovementType.Up,
      'price-movement__icon--down fa fa-caret-down': props.priceMovementType ===  PriceMovementType.Down
    }
  );
  return <div className='price-movement'><span className='price-movement__value'>{props.spread.formattedValue}</span><i className={className}></i></div>;
}

PriceMovementIndicator.propTypes = {
  priceMovementType: React.PropTypes.instanceOf(PriceMovementType).isRequired,
  spread: React.PropTypes.instanceOf(Spread).isRequired
};

export default PriceMovementIndicator;
