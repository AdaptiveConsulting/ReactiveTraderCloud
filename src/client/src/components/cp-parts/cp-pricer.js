import React from 'react';

/**
 * @Class Pricer
 */
export default class Pricer extends React.Component {

  static propTypes = {
    price: React.PropTypes.object,
    direction: React.PropTypes.string,
    onExecute: React.PropTypes.func
  }

  render(){
    const { direction, price } = this.props;

    return <div className={direction + ' action'} onClick={() => this.props.onExecute(direction)}>
      <div>{direction}</div>
      <span className='big'></span>{price.bigFigures}<span className='pip'>{price.pip}</span><span className='tenth'>{price.pipFraction}</span>
    </div>;
  }
}
