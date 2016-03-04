import React from 'react';
import { Sparklines, SparklinesLine, SparklinesNormalBand, SparklinesReferenceLine, SparklinesSpots } from 'react-sparklines';
import { utils } from 'system';
import Direction from './direction';
import Sizer from './sizer';
import Pricer from './pricer';
import { Message } from '../../common/components';

/**
 * @class SpotTile
 * @extends {React.Component}
 */
class SpotTile extends React.Component {

  static propTypes = {
    id: React.PropTypes.number,
    pair: React.PropTypes.string,
    buy: React.PropTypes.number,
    sell: React.PropTypes.number,
    size: React.PropTypes.any,
    mid: React.PropTypes.number,
    precision: React.PropTypes.number,
    pip: React.PropTypes.number,
    onExecute: React.PropTypes.func,
    state: React.PropTypes.string,
    response: React.PropTypes.object
  }

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
    const size     = utils.convertNotionalShorthandToNumericValue(this.props.size),
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

  componentWillReceiveProps(nextProps, nextState){
    const historic = this.state.historic;

    nextProps.mid && historic.push(nextProps.mid);

    // 30 max historic prices
    historic.length > 150 && (historic.shift());

    const payload = {
      historic,
      state: nextState.state ? nextState.state : nextProps.state || 'listening'
    };

    if (!this.state.info && nextProps.response != null){
      this.setState({
        info: true
      });
    }
    else if (nextProps.response && nextProps.response.message === null){
      delete this.lastResponse;
      this.setState({
        info: false
      });
    }

    this.setState(payload);
  }

  shouldComponentUpdate(nextProps, nextState){
    //refuse props updates while we have a summary or error message info div shown until this.setState()
    if ((nextProps.buy != this.props.buy || nextProps.sell != this.props.sell) || nextProps.state !== this.state.state){
      return true;
    }
    else {
      return nextState.chart !== this.state.chart || nextState.state !== this.state.state || this.state.info != nextState.info;
    }
  }

  /**
   * Explodes a price into big, pip, 10th.
   * @param {Number} price
   * @returns {{bigFigures: string, pip: string, pipFraction: string}}
   */
  parsePrice(price:number){
    const { precision, pip } = this.props;
    const priceString = price ? price.toFixed(precision) : '';
    const fractions = priceString.split('.')[1];

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

  getSpread(sell:number, buy:number){
    const { pip, precision } = this.props;
    return sell != null ? ((sell - buy) * Math.pow(10, pip)).toFixed(precision - pip) : '';
  }

  /**
   * Determine the change as up or down on a tick.
   * @returns {string}
   */
  getDirection(mid:number) : String {
    const historic = this.state.historic;
    const len = historic.length - 2;

    return (historic.length > 1) ?
      historic[len] < mid ? 'up' :
        historic[len] > mid ?
          'down' :
          '-'
      : '-';
  }

  execute(direction:string){
    // attempt to capture price we request against.
    if (this.props.onExecute && this.state.size !== 0){
      let size = Number(this.state.size);

      isNaN(size) || this.props.onExecute({
        direction: direction,
        amount: size,
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

  onDismissLastResponse(e:DOMEvent){
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
  getNoResponseMessage() : React.Element {
    return (
      <div className='blocked summary-state animated flipInX'>
        <span className='key'>Error:</span> No response was received from the server, the execution status is unknown. Please contact your sales rep.
        <a href='#' className='pull-right dismiss-message' onClick={(e) => this.setState({state: 'listening'})}>Done</a>
      </div>
    );
  }

  /**
   * Changes sparkline ticker on/off or launches IQ chart openfin app.
   */
  setChart() : void {
    if (!window.fin)
      this.setState({chart: !this.state.chart});
    else
      this.openChartIQ(this.props.pair);
  }

  openChartIQ(symbol:string) : void {
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

    const execute   = this.execute.bind(this),
          title     = pair.substr(0, 3) + ' / ' + pair.substr(3, 3);

    // any ACK or failed messages will come via state.info / last response
    let message = info
      ? (this.lastResponse || (this.lastResponse = <Message message={response} onClick={(e) => this.onDismissLastResponse(e)} />))
      : false;

    // if execution has gone down, state will be `blocked`.
    state === 'blocked' && (message = this.getNoResponseMessage());

    let actionsClass = message ? 'currency-pair-actions hide' : 'currency-pair-actions';
    let sizerClass = message ? 'sizer disabled' : 'sizer';

    let chartElement = chart
        ? (<Sparklines
          data={historic.slice()}
          width={326}
          height={22}
          margin={0}>
          <SparklinesLine />
          <SparklinesSpots />
          <SparklinesReferenceLine type='avg' />
        </Sparklines>)
      : <div className='sparkline-holder'></div>;

    return (
      <div>
        <div className='currency-pair-title'>
          <i className='glyphicon glyphicon-stats pull-right' onClick={() => this.setChart()}/>
          <span>{title}</span> <i className='fa fa-plug animated infinite fadeIn'/>
        </div>
        {message}
        <div className={actionsClass}>
          <Pricer direction='sell' onExecute={execute} price={this.parsePrice(sell)}/>
          <Direction direction={this.getDirection(mid)} spread={this.getSpread(buy, sell)}/>
          <Pricer direction='buy' onExecute={execute} price={this.parsePrice(buy)}/>
        </div>
        <div className='clearfix'></div>
        <Sizer className={sizerClass} size={size} onChange={(size) => this.setState({size})} pair={pair} />
        <div className='clearfix'></div>
        {chartElement}
      </div>
    );
  }
}

export default SpotTile;
