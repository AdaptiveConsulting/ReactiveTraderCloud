import React from 'react';
import { Direction } from '../../../services/model';
import classnames from 'classnames';
import './priceButton.scss';

const PriceButton = props =>  {
  const { direction, rate } = props;

  let classes = classnames(
    'price-button',
    props.className
  );
  let paddedPips =  rate.pips.toString().length  === 1
    ? `0${rate.pips}`
    : rate.pips;
  return (
    <div className={classes} onClick={() => props.onExecute()}>
      <div className='price-button__direction'>{direction.name}</div>
      <span className='price-button__big-figure'>{rate.bigFigure}</span><span className='price-button__pip'>{paddedPips}</span><span className='price-button__tenth'>{rate.pipFraction}</span>
    </div>
  );
};

PriceButton.propTypes = {
  className: React.PropTypes.string,
  rate: React.PropTypes.object.isRequired,
  direction: React.PropTypes.instanceOf(Direction).isRequired,
  onExecute: React.PropTypes.func.isRequired
};

export default PriceButton;
