import React from 'react';


const numberConvertRegex = /^([0-9.]+)?([MK]{1})?$/,
  SEPARATOR = '.',
  MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let SPOTDATE;

/**
 * @class CurrencyPairs
 * @extends {React.Component}
 */
class CurrencyPair extends React.Component {

  static propTypes = {
    pair: React.PropTypes.string,
    buy: React.PropTypes.number,
    sell: React.PropTypes.number,
    spread: React.PropTypes.string,
    precision: React.PropTypes.number,
    pip: React.PropTypes.number,
    onExecute: React.PropTypes.func
  }

  /**
   * @constructs CurrencyPair
   * @param {Object=} props
   * @param {Object=} context
   */
  constructor(props, context){
    super(props, context);
    this.state = {
      size: 0,
      state: 'listening',
      historic: []
    }
  }

  componentWillMount(){
    const size = this._getSize(this.props.size),
      today = new Date;

    this.setState({
      size,
      historic: [this.props.buy]
    });

    SPOTDATE = ['SP.', today.getDate(), MONTHS[today.getMonth()]].join(' ');
  }

  componentWillReceiveProps(props){
    const historic = this.state.historic;

    historic.unshift(props.buy);

    // 30 max historic prices
    historic.length > 30 && (historic.length = 30);

    this.setState({
      historic
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
   * Explodes a price into big, pip, 10th.
   * @param {Number} price
   * @returns {{bigFigures: string, pip: string, pipFraction: string}}
   */
  parsePrice(price: number){
    const { precision, pip } = this.props;
    price = price.toFixed(precision + 1);

    return {
      bigFigures: price.substring(0, pip - 1),
      pip: price.substring(pip, pip + 2),
      pipFraction: price.substring(pip + 2, pip + 3)
    };
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
      this.setState({state: 'executing'});
    }
    else {
      console.error('To execute spot trade, you need onExecute({Payload}) callback and a valid size');
    }
  }

  render(){
    const { historic, size } = this.state;
    const { buy, sell, pair, spread } = this.props;

    const base = pair.substr(0, 3);
    // up, down, even
    const direction = (historic.length > 1) ? historic[1] > buy ? 'up' : historic[1] < buy ? 'down' : '-' :'-';

    const b = this.parsePrice(buy),
          s = this.parsePrice(sell);

    return <div className={this.state.state + ' currency-pair'}>
      <div className='currency-pair-title'>
        {pair}
      </div>
      <div className='currency-pair-actions'>
        <div className='buy action' onClick={() => this.execute('buy')}>
          <div>BUY</div>
          <span className='big'></span>{b.bigFigures}<span className='pip'>{b.pip}</span><span className='tenth'>{b.pipFraction}</span>
        </div>
        <div className={direction + ' direction'}>{spread}</div>
        <div className='sell action' onClick={() => this.execute('sell')}>
          <div>SELL</div>
          <span className='big'></span>{s.bigFigures}<span className='pip'>{s.pip}</span><span className='tenth'>{s.pipFraction}</span>
        </div>
      </div>
      <div className='clearFix'></div>
      <div className='sizer'>
        <label>{base}
        <input className='size' type='text' ref='size' defaultValue={size} onChange={(e) => this.setSizeFromInput(e)} /></label>
        <div className='pull-right'>
          {SPOTDATE}
        </div>
      </div>

    </div>
  }
}

export default CurrencyPair;
