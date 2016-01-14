import React from 'react';

/**
 * @Class Pricer
 */
const Pricer = props =>  {
  const { direction, price } = props;

  return (
    <div className={direction + ' action'} onClick={() => props.onExecute(direction)}>
      <div>{direction}</div>
      <span className='big'>{price.bigFigures}</span><span className='pip'>{price.pip}</span><span className='tenth'>{price.pipFraction}</span>
    </div>
  );
};

Pricer.propTypes = {
  price: React.PropTypes.object.isRequired,
  direction: React.PropTypes.string.isRequired,
  onExecute: React.PropTypes.func.isRequired
};

export default Pricer;