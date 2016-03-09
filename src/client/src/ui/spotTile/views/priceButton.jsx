import React from 'react';
import { Direction } from '../../../services/model';
import classnames from 'classnames';

const PriceButton = props =>  {
  const { direction, rate } = props;

  let directionClassName = classnames(
    {
      'buy' : direction === Direction.Buy,
      'sell' : direction === Direction.Sell
    },
    'action'
  );

  return (
    <div className={directionClassName} onClick={() => props.onExecute()}>
      <div>{direction.name}</div>
      <span className='big'>{rate.bigFigure}</span><span className='pip'>{rate.pips}</span><span className='tenth'>{rate.pipFraction}</span>
    </div>
  );
};

PriceButton.propTypes = {
  rate: React.PropTypes.object.isRequired,
  direction: React.PropTypes.instanceOf(Direction).isRequired,
  onExecute: React.PropTypes.func.isRequired
};

export default PriceButton;
