import React from 'react';
import ReactDOM from 'react-dom';
import numeral from 'numeral';
import moment from 'moment';
import Container from './container';
import _ from 'lodash';

/**
 * @class CurrencyPairs
 * @extends {React.Component}
 */
class CurrencyPairs extends React.Component {

  static propTypes = {
    trades: React.PropTypes.array,
    status: React.PropTypes.number
  }

  constructor(props, context){
    super(props, context);
    this.state = {
      tearoff: false,
      flagged: null
    };
  }

  componentDidMount(){
    if (window.fin){
      // listen to messages about highlighting the relevant trade
      window.fin.desktop.main(() =>{
        window.fin.desktop.InterApplicationBus.subscribe('*', 'acknowledgeTrade', (id) =>{
          const trade = _.findWhere(this.props.trades, {
            id
          });

          trade && (this.setState({
            flagged: id
          }));
        });
      })
    }
  }

  /**
   * Renders an individual trade in blotter
   * @param {Object} trade
   * @returns {HTMLElement:TR}
   */
  renderRow(trade:object){
    const notional           = numeral(trade.amount).format('0,000,000[.]00') + ' ' + trade.pair.substr(0, 3),
          dateTime           = moment(trade.dateTime).format('MMM Do, HH:mm:ss'),
          valueDay           = moment(trade.valueDate),
          formattedValueDate = 'SP. ' + valueDay.format('DD MMM'),
          flagged            = this.state.flagged;

    flagged && flagged === trade.id && (trade.className = 'flash');

    return (
      <tr key={trade.id} className={trade.status + ' animated ' + (trade.className || 'slideInDown')}>
        <td>{trade.id}</td>
        <td className='large'>
          <div>{dateTime}</div>
        </td>
        <td className={'direction ' + trade.direction}>{trade.direction}</td>
        <td>{trade.pair}</td>
        <td className='large text-right'>{notional}</td>
        <td className='text-right'>{trade.rate}</td>
        <td className='status'>{trade.status}</td>
        <td>{formattedValueDate}</td>
        <td className='large'>{trade.trader}</td>
      </tr>
    );
  }

  tearOff(state){
    this.setState({
      tearoff: state
    });
  }

  componentWillReceiveProps(){
    this.state.flagged = false;
  }

  componentDidUpdate(){
    this.refs.tbody.scrollTop = 0;
  }

  render(){
    const className = this.props.status ? 'blotter online' : 'blotter offline';

    return <Container title='blotter' className={className} onTearoff={(state) => this.tearOff(state)}
                      tearoff={this.state.tearoff} width={window.outerWidth} height={400} options={{maximizable:true}}>
      <div className="blotter-wrapper">
        <div className='status'>
          <i className='fa fa-plug animated infinite fadeIn'/>
        </div>
        <table className='table table-compact table-heading'>
          <thead>
            <tr>
              <th>Id</th>
              <th className='large'>Date</th>
              <th>Dir.</th>
              <th>CCY</th>
              <th className='large text-right'>Notional</th>
              <th className='text-right'>Rate</th>
              <th>Status</th>
              <th>Value date</th>
              <th className='large'>Trader</th>
            </tr>
          </thead>
        </table>
        <table className='table table-compact table-blotter'>
          <tbody ref='tbody'>
            {this.props.trades.map(this.renderRow, this)}
          </tbody>
        </table>

      </div>
    </Container>;
  }
}

export default CurrencyPairs;
