import React from 'react';

/**
 * @Class Pricer
 */
export default class Pricer extends React.Component {

  static propTypes = {
    price: React.PropTypes.object.isRequired,
    direction: React.PropTypes.string.isRequired,
    onExecute: React.PropTypes.func.isRequired
  }

  render(){
    const { direction, price } = this.props;

    return (
      <div className={direction + ' action'} onClick={() => this.props.onExecute(direction)}>
        <div>{direction}</div>
        <span className='big'>{price.bigFigures}</span><span className='pip'>{price.pip}</span><span className='tenth'>{price.pipFraction}</span>
      </div>
    );
  }

}
