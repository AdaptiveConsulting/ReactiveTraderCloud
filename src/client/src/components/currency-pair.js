import React from 'react';

import { Sparklines, SparklinesLine, SparklinesReferenceLine, SparklinesSpots } from 'react-sparklines';
import numeral from 'numeral';
import { getConvertedSize } from '../utils';

// sub components
import Direction from './cp-parts/cp-direction';
import Sizer from './cp-parts/cp-sizer';
import Pricer from './cp-parts/cp-pricer';
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
    const size = getConvertedSize(this.props.size);

    this.setState({
      size,
      historic: [this.props.buy],
      state: this.props.state
    });
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
   * Explodes a price into big, pip, 10th.
   * @param {Number} price
   * @returns {{bigFigures: string, pip: string, pipFraction: string}}
   */
  parsePrice(price:number){
    const { precision, pip } = this.props,
          priceString = price.toFixed(precision),
          fractions   = priceString.split('.')[1];

    return {
      bigFigures: Math.floor(price) + '.' + fractions.substring(0, pip - 2),
      pip: fractions.substring(pip - 2, pip),
      pipFraction: fractions.substring(pip, pip + 1)
    };
  }

  /**
   * Formats spread
   * @param sell
   * @param buy
   * @returns {string}
   */
  getSpread(sell:number, buy:number){
    const { pip, precision } = this.props;
    return ((sell - buy) * Math.pow(10, pip)).toFixed(precision - pip);
  }

  /**
   * Determine the change as up or down on a tick.
   * @returns {string}
   */
  getDirection(buy){
    const historic = this.state.historic,
          len      = historic.length - 2;

    return (historic.length > 1) ?
      historic[len] < buy ? 'up' :
        historic[len] > buy ?
          'down' :
          '-'
      : '-';
  }

  /**
   * Calls back the passed fn with the direction and size
   * @param {String} direction
   */
  execute(direction){
    // attempt to capture price we request against.
    if (this.props.onExecute && this.state.size !== 0){
      let s = Number(this.state.size);
      isNaN(s) || this.props.onExecute({
        direction: direction,
        amount: s,
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
  renderMessage(response){
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
      <div className={response.status + ' summary-state animated flipInX'}>
        <span className='key'>{action}</span> {response.pair.substr(0, 3)} {amount}<br/>
        <span className='key'>vs</span> {response.pair.substr(3, 3)}
        <span className='key'>at</span> {response.rate}<br/>
        <span className='key'>{response.valueDate}</span><br/>
        <span className='key'>Trade ID</span> {response.id}
        <a href='#' className='pull-right' onClick={(e) => this.onDismissLastResponse(e)}>{response.status}</a>
      </div>
    );
  }

  render(){
    const { historic, size, state, info, chart } = this.state,
          { buy, sell, pair, response } = this.props;

    const parsedBuy  = this.parsePrice(buy),
          parsedSell = this.parsePrice(sell),
          execute = this.execute.bind(this),
          className  = 'currency-pair animated flipInX ' + state;

    // any ACK or failed messages will come via state.info / last response
    const message = this.state.info ? (this.lastResponse || this.renderMessage(response)) : false;

    return <div className={className}>
      <div className='currency-pair-title'>
        {pair} <i className='fa fa-plug animated infinite fadeIn'></i>
        <i className='glyphicon glyphicon-stats pull-right' onClick={() => this.setState({chart: !this.state.chart})}/>
      </div>
      {message}
      <div className={message ? 'currency-pair-actions hide' : 'currency-pair-actions'}>
        <Pricer direction='buy' onExecute={execute} price={this.parsePrice(buy)}/>
        <Direction direction={this.getDirection(buy)} spread={this.getSpread(sell, buy)}/>
        <Pricer direction='sell' onExecute={execute} price={this.parsePrice(sell)}/>
      </div>
      <div className='clearFix'></div>
      <Sizer className={message ? 'sizer disabled' : 'sizer'} size={size} onChange={(size) => this.setState({size})} pair={pair}/>
      <div className="clearfix"></div>
      {chart ?
        <Sparklines data={historic.slice()} width={326} height={24} margin={0}>
          <SparklinesLine />
          <SparklinesSpots />
          <SparklinesReferenceLine type="avg"/>
        </Sparklines> : <div className='sparkline-holder'></div>}
    </div>;
  }
}

export default CurrencyPair;
