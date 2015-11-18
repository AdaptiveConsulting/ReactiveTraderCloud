import React from 'react';

/**
 * @class CurrencyPair
 * @extends {React.Component}
 */
class CurrencyPair extends React.Component {

  static propTypes = {
    pair: React.PropTypes.string,
    id: React.PropType.string,
    buy: React.PropType.number,
    sell: React.PropType.number,
    onExecute: React.PropType.function
  }

  /**
   * @constructs CurrencyPair
   * @param {Object=} props
   * @param {Object=} context
   */
  constructor(props, context){
    super(props, context);
    this.state = {
      size: 0
    }
  }

  componentWillMount(){
    this.setState({
      size: this.props.size
    });
  }

  /**
   * Sets trade amount. Supports k/m modifiers for 1000s or millions.
   * @param {DOMEvent=} e
   */
  setSize(e){
    let size = (this.refs.size || e.target.value).trim(),
      state;

    const matches = size.match(/^([0-9.]+)?([MK]{1})?$/);

    if (!size.length || !matches || !matches.length){
      size = 0;
    }
    else {
      size = Number(matches[1]);
      matches[2] && (size = size * (matches[2] === 'K' ? 1000 : 1000000));
    }

    this.setState({
      size
    });
  }

  /**
   * Calls back the passed fn with the direction and size
   * @param {String} direction
   */
  execute(direction){
    // attempt to capture price we request against.
    if (this.props.onExecute){
      this.props.onExecute({
        direction: direction,
        size: this.state.size,
        price: this.props[direction]
      });
    }
    else {
      console.error('You need to pass onExecute({Payload}) to the currency pair');
    }
  }

  render(){
    return <div className='currency-pair'>
      <div className='currency-pair-title'>
        {this.props.pair}
      </div>
      <input type='text' ref='size' defaultValue='100m' onChange={(e) => this.setSize(e)} />
      <button onClick={() => this.execute('buy')} >Buy</button>
    </div>
  }
}

export default CurrencyPair;
