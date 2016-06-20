import React from 'react';
import classnames from 'classnames';
import { PriceMovementType, Spread } from '../../../services/model';
import './priceMovement.scss';

const PriceMovementIndicator = props => {

  let upDirectionClassName = classnames(
    'price-movement__icon--up fa fa-caret-up fa-lg',
    {
      'price-movement__icon--inactive': props.priceMovementType ===  PriceMovementType.Down
    }
  );

  let downDirectionClassName = classnames(
    'price-movement__icon--down fa fa-caret-down fa-lg',
    {
      'price-movement__icon--inactive': props.priceMovementType ===  PriceMovementType.Up
    }
  );
  
  return (
    <div>
      <div className='price-movement'>
        <i className={upDirectionClassName}></i>
        <span className='price-movement__value'>{props.spread.formattedValue}</span>
        <i className={downDirectionClassName}></i>
      </div>
    </div>
    );
};

PriceMovementIndicator.propTypes = {
  priceMovementType: React.PropTypes.instanceOf(PriceMovementType).isRequired,
  spread: React.PropTypes.instanceOf(Spread).isRequired
};

export default PriceMovementIndicator;
