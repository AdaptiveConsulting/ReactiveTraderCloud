import React from 'react';

import { Sparklines, SparklinesLine, SparklinesReferenceLine, SparklinesSpots } from 'react-sparklines';
import numeral from 'numeral';

const numberConvertRegex = /^([0-9.]+)?([MK]{1})?$/,
  SEPARATOR = '.',
  MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * @class CurrencyPairs
 * @extends {React.Component}
 */
class CurrencyPair extends React.Component {

  static propTypes = {
    id: React.PropTypes.number,
    pair: React.PropTypes.string,
    buy: React.PropTypes.number,
    sell: React.PropTypes.number,
    // spread: React.PropTypes.string,
    precision: React.PropTypes.number,
    pip: React.PropTypes.number,
    onExecute: React.PropTypes.func,
    state: React.PropTypes.string,
    response: React.PropTypes.object
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
      chart: false,
      info: false,
      state: 'listening',
      historic: []
    };

    this._checkStaleConnection = this._checkStaleConnection.bind(this);
  }

  componentWillMount(){
    const size = this._getSize(this.props.size),
      today = new Date;

    this.setState({
      size,
      historic: [this.props.buy],
      state: this.props.state
    });

    this.SPOTDATE = ['SP.', today.getDate(), MONTHS[today.getMonth()]].join(' ');
  }

  _checkStaleConnection(){
    const diff = Date.now() - this.lastUpdated;
    if (diff > STALE_TIMEOUT){
      this.setState({
        state: 'stale',
        message: 'Pricing has become unavailable, no data received for over 4 seconds'
      });
    }
  }

  componentWillReceiveProps(props, state){
    const historic = this.state.historic;

    historic.push(props.mid);

    // 30 max historic prices
    historic.length > 30 && (historic.shift());

    const payload = {
      historic,
      state: state.state ? state.state : props.state || 'listening'
    };

    if (!this.state.info && props.response != null){
      this.setState({
        info: true
      });
    }

    this.setState(payload);
  }

  shouldComponentUpdate(props, state){
    //refuse props updates while we have a summary or error message info div shown until this.setState()
    if ((props.buy != this.props.buy || props.sell != this.props.sell) || props.state !== this.state.state){
      return true;
    }
    else {
      return state.chart !== this.state.chart || state.state !== this.state.state || this.state.info != state.info;
    }
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
    const val = (this.refs.size.value || e.target.value).trim();
    let size = this._getSize(val);

    if (!isNaN(size)){
      this.setState({
        size
      });

      // user may be trying to enter decimals. restore into input
      if (val.indexOf('.') === val.length-1){
        size = size + '.';
      }

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
        amount: this.state.size,
        rate: this.props[direction].toFixed(this.props.precision),
        pair: this.props.pair,
        valueDate: this.SPOTDATE,
        trader: 'SJP'
      });
      this.setState({
        state: 'executing'
      });
    }
    else {
      console.error('To execute spot trade, you need onExecute({Payload}) callback and a valid size');
    }
  }

  /**
   * Click handler for the 'Done'
   * @param {HTMLEvent} e
   */
  onDismissLastResponse(e){
    e && e.preventDefault();
    this.setState({
      info: false
    });
    delete this.lastResponse;
  }

  /**
   * Parses an ACK response string, saves element into instance until user action
   * @param {Object} response
   * @returns {ReactDOM.Element}
   */
  renderLastResponse(response){
    if (!response)
      return false;

    if (response.message){
      return this.lastResponse = (
        <div className='summary-state animated flipInX'>
          {response.message}
        </div>
      );
    }

    const action = response.direction === 'sell' ? 'Sold' : 'Bought',
      amount = numeral(response.amount).format('0,000,000[.]00');

    // we will cache last response to diverge from state until user dismisses it.
    return this.lastResponse = (
      <div className='summary-state animated flipInX'>
        <span className='key'>{action}</span> {response.pair.substr(0, 3)} {amount}<br/>
        <span className='key'>vs</span> {response.pair.substr(3, 3)} <span className='key'>at</span> {response.rate}<br/>
        <span className='key'>{response.valueDate}</span><br/>
        <span className='key'>Trade ID</span> {response.id}
        <a href='#' className='pull-right' onClick={(e) => this.onDismissLastResponse(e)}>Done</a>
      </div>
    );
  }


  render(){
    const { historic, size, state, info, chart } = this.state;
    const { buy, sell, pair, response } = this.props;
    const base = pair.substr(0, 3),
          len = historic.length - 2,
          direction = (historic.length > 1) ? historic[len] < buy ? 'up' : historic[len] > buy ? 'down' : '-' :'-',
          b = this.parsePrice(buy),
          s = this.parsePrice(sell),
          lastTradeState = this.state.info ? (this.lastResponse || this.renderLastResponse(response)) : false,
          className = ['currency-pair', 'animated', 'flipInX', state].join(' '),
          spread = Math.abs((s.pip + '.' + s.pipFraction) - (b.pip + '.' + b.pipFraction)).toFixed(1);

    return <div className={className}>
      <div className='currency-pair-title'>
        {pair} <i className='fa fa-plug animated infinite pulse'></i>
        <i className='fa fa-line-chart pull-right' onClick={() => this.setState({chart: !this.state.chart})}/>
      </div>
      {lastTradeState}
      <div className={lastTradeState ? 'currency-pair-actions hide' : 'currency-pair-actions'}>
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
      <div className={lastTradeState ? 'sizer disabled' : 'sizer'}>
        <label>{base}
        <input className='size' type='text' ref='size' defaultValue={size} onChange={(e) => this.setSizeFromInput(e)} /></label>
        <div className='pull-right'>
          {this.SPOTDATE}
        </div>
      </div>
      <div className="clearfix"></div>
      {chart ?
        <Sparklines data={historic.slice()} width={326} height={24} margin={0}>
          <SparklinesLine />
          <SparklinesSpots />
          <SparklinesReferenceLine type="avg" />
        </Sparklines> : <div className='sparkline-holder'></div>}
    </div>
  }
}

export default CurrencyPair;
