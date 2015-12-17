import React from 'react';

import { Sparklines, SparklinesLine, SparklinesNormalBand, SparklinesReferenceLine, SparklinesSpots } from 'react-sparklines';

import utils from 'utils';

// sub components
import Direction from './cp-parts/cp-direction';
import Sizer from './cp-parts/cp-sizer';
import Pricer from './cp-parts/cp-pricer';
import Message from './cp-parts/cp-message';

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
    size: React.PropTypes.any,
    mid: React.PropTypes.number,
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
      chart: true,
      info: false,
      tearoff: false,
      state: 'listening',
      historic: []
    };

    this._checkStaleConnection = this._checkStaleConnection.bind(this);
  }

  componentWillMount(){
    const size     = utils.getConvertedSize(this.props.size),
          historic = this.props.mid ? [this.props.mid] : [];

    this.setState({
      size,
      historic,
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

    //props.mid && props.mid != historic[historic.length-1] && historic.push(props.mid);
    props.mid && historic.push(props.mid);

    // 30 max historic prices
    historic.length > 150 && (historic.shift());

    const payload = {
      historic,
      state: state.state ? state.state : props.state || 'listening'
    };

    if (!this.state.info && props.response != null){
      this.setState({
        info: true
      });
    }
    else if (props.response && props.response.message === null){
      delete this.lastResponse;
      this.setState({
        info: false
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
          priceString = price ? price.toFixed(precision) : '',
          fractions   = priceString.split('.')[1];

    return priceString ? {
      bigFigures: Math.floor(price) + '.' + fractions.substring(0, pip - 2),
      pip: fractions.substring(pip - 2, pip),
      pipFraction: fractions.substring(pip, pip + 1)
    } : {
      bigFigures: '',
      pip: '-',
      pipFraction: ''
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
    return sell != null ? ((sell - buy) * Math.pow(10, pip)).toFixed(precision - pip) : '';
  }

  /**
   * Determine the change as up or down on a tick.
   * @returns {string}
   */
  getDirection(mid){
    const historic = this.state.historic,
          len      = historic.length - 2;

    return (historic.length > 1) ?
      historic[len] < mid ? 'up' :
        historic[len] > mid ?
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
   * When a execution fails to confirm, show a warning.
   * @returns {HTMLElement}
   */
  getNoResponseMessage(){
    return (
      <div className='blocked summary-state animated flipInX'>
        <span className='key'>Error:</span> No response was received from the server, the execution status is unknown. Please contact your sales rep.
        <a href='#' className='pull-right dismiss-message' onClick={(e) => this.setState({state: 'listening'})}>Done</a>
      </div>
    );
  }

  /**
   * @param {DOMEvent=} e
   */
  toggleTearoff(e:DOMEvent){
    e && e.preventDefault();
    this.setState({tearoff: !this.state.tearoff});
  }

  /**
   * Changes sparkline ticker on/off or launches IQ chart openfin app.
   */
  setChart(){
    if (!window.fin)
      this.setState({chart: !this.state.chart});
    else
      this.openChartIQ(this.props.pair);
  }

  openChartIQ(symbol){
    this.app = new window.fin.desktop.Application({
      uuid: 'ChartIQ' + Date.now(),
      url: `http://openfin.chartiq.com/0.5/chartiq-shim.html?symbol=${symbol}&period=5`,
      name: 'chartiq_' + symbol,
      applicationIcon: 'http://openfin.chartiq.com/0.5/img/openfin-logo.png',
      mainWindowOptions: {
        autoShow: false
      }
    }, () => {
      this.app.run();
    });
  }

  render(){
    const { historic, size, state, info, chart } = this.state,
          { buy, sell, mid, pair, response } = this.props;

    const parsedBuy  = this.parsePrice(buy),
          parsedSell = this.parsePrice(sell);

    const execute   = this.execute.bind(this),
          title     = pair.substr(0, 3) + ' / ' + pair.substr(3, 3);

    // any ACK or failed messages will come via state.info / last response
    let message = info ? (this.lastResponse || (this.lastResponse = <Message message={response} onClick={(e) => this.onDismissLastResponse(e)} />)) : false;

    // if execution has gone down, state will be `blocked`.
    state === 'blocked' && (message = this.getNoResponseMessage());

    return (
      <div>
        <div className='currency-pair-title'>
          <i className='glyphicon glyphicon-stats pull-right' onClick={() => this.setChart()}/>
          <span>{title}</span> <i className='fa fa-plug animated infinite fadeIn'/>
        </div>
        {message}
        <div className={message ? 'currency-pair-actions hide' : 'currency-pair-actions'}>
          <Pricer direction='buy' onExecute={execute} price={this.parsePrice(buy)}/>
          <Direction direction={this.getDirection(mid)} spread={this.getSpread(sell, buy)}/>
          <Pricer direction='sell' onExecute={execute} price={this.parsePrice(sell)}/>
        </div>
        <div className='clearfix'></div>
        <Sizer className={message ? 'sizer disabled' : 'sizer'} size={size} onChange={(size) => this.setState({size})}
               pair={pair} />
        <div className="clearfix"></div>
        {chart ?
          <Sparklines
            data={historic.slice()}
            width={326}
            height={22}
            margin={0}>
            <SparklinesLine />
            <SparklinesSpots />
            <SparklinesReferenceLine type='avg' />
          </Sparklines> : <div className='sparkline-holder'></div>}
      </div>
    );
  }
}

export default CurrencyPair;
