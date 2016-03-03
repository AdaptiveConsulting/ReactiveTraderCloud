import React from 'react';
import classnames from 'classnames';

const PriceMovementIndicator = props => {
  let classnames = classnames(
    {
      'up': props.direction === 'up',
      'down': props.direction === 'down'
    },
    'direction'
  );
  return <div className={classnames}>{props.spread}</div>;
}

PriceMovementIndicator.propTypes ={
  priceChangeDirection: React.PropTypes.object.isRequired,
  spread: React.PropTypes.string.isRequired
};

export default PriceMovementIndicator;
