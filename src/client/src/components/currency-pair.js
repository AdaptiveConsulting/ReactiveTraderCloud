import React from 'react';


const numberConvertRegex = /^([0-9.]+)?([MK]{1})?$/;

/**
 * @class CurrencyPairs
 * @extends {React.Component}
 */
class CurrencyPair extends React.Component {

  static propTypes = {
    pair: React.PropTypes.string,
    buy: React.PropTypes.number,
    sell: React.PropTypes.number,
    spread: React.PropTypes.number
    // onExecute: React.PropTypes.function
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
    console.log(this._getSize(this.props.size), this.props.size);
    this.setState({
      size: this._getSize(this.props.size)
    });
  }

  /**
   * Returns the expanded price from k/m shorthand.
   * @param {String|Number} size
   * @returns {Number}
   * @private
   */
  _getSize(size){
    size = String(size).toUpperCase();
    const matches = size.match(numberConvertRegex);

    if (!size.length || !matches || !matches.length){
      size = 0;
    }
    else {
      size = Number(matches[1]);
      matches[2] && (size = size * (matches[2] === 'K' ? 1000 : 1000000));
    }

    return size;
  }

  /**
   * Sets trade amount. Supports k/m modifiers for 1000s or millions.
   * @param {DOMEvent=} e
   */
  setSizeFromInput(e){
    let size = this._getSize((this.refs.size.value || e.target.value).trim());

    if (!isNaN(size)){
      this.setState({
        size
      });
      this.refs.size.value = size;
    }
  }

  /**
   * Calls back the passed fn with the direction and size
   * @param {String} direction
   */
  execute(direction){
    // attempt to capture price we request against.
    if (this.props.onExecute && this.state.size !== 0){
      this.props.onExecute({
        direction: direction,
        size: this.state.size,
        price: this.props[direction],
        pair: this.props.pair
      });
    }
    else {
      console.error('To execute spot trade, you need onExecute({Payload}) callback and a valid size');
    }
  }

  render(){
    return <div className='currency-pair'>
      <div className='currency-pair-title'>
        {this.props.pair}
      </div>
      <div className='currency-pair-actions'>
        <div className="buy" onClick={() => this.execute('buy')}>
          {this.props.buy}
        </div>
        <div className="sell" onClick={() => this.execute('sell')}>
          {this.props.sell}
        </div>
      </div>
      <input type='text' ref='size' defaultValue={this.state.size} onChange={(e) => this.setSizeFromInput(e)} />
      <button  >Buy</button>
    </div>
  }
}

export default CurrencyPair;
