import React from 'react';
import ReactDOM from 'react-dom';

import FixedDataTable from 'fixed-data-table';
const {Table, Column, Cell} = FixedDataTable;


import Dimensions from 'react-dimensions';
import numeral from 'numeral';
import moment from 'moment';
import Container from './container';
import _ from 'lodash';

class DateCell extends React.Component {
  render(){
    const { rowIndex, field, data, format = 'MMM Do, HH:mm:ss', prefix = '', ...props } = this.props;
    const formatted = moment(data[rowIndex][field]).format(format);

    return (
      <Cell {...props}>
        {prefix}{formatted}
      </Cell>
    );
  }
}

class MoneyCell extends React.Component {
  render(){
    const { rowIndex, field, data, ...props } = this.props;
    const formatted = numeral(data[rowIndex][field]).format('0,000,000[.]00') + ' ' + data[rowIndex].pair.substr(0, 3);

    return (
      <Cell {...props}>
        {formatted}
      </Cell>
    );
  }
}


/**
 * @class Blotter
 * @extends {React.Component}
 */
@Dimensions()
class Blotter extends React.Component {

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

          trade && (this.setState({flagged: id})); // eslint-disable-line
        });
      });
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
      <tr key={trade.id}
        className={trade.status + ' animated ' + (trade.className || 'slideInDown')}>
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

  render(){
    const className = this.props.status ? 'blotter online' : 'blotter offline';
    const { flagged } = this.state;

    function getClass(item){
      const flash = flagged && flagged === item.id;
      return item.status + ' animated ' + (flash ? 'flash' : 'slideInDown');
    }

    return (
        <Container
          title='blotter'
          className={className}
          onTearoff={(state) => this.tearOff(state)}
          tearoff={this.state.tearoff}
          width={this.props.containerWidth}
          height={400}
          options={{maximizable:true}}>
        <div className='blotter-wrapper' ref='wrapper'>
          <div className='status'>
            <i className='fa fa-plug animated infinite fadeIn'/>
          </div>
          <Table
            rowHeight={24}
            headerHeight={30}
            rowsCount={this.props.trades.length}
            width={this.props.containerWidth}
            height={300}
            rowClassNameGetter={(index) => getClass(this.props.trades[index])}
            {...this.props}>
            <Column
              header={<Cell>Id</Cell>}
              cell={props => <Cell {...props}>
                {this.props.trades[props.rowIndex].id}
              </Cell>}
              width={50}
            />
            <Column
              header={<Cell>Date</Cell>}
              cell={props => <DateCell field='dateTime' data={this.props.trades} {...props} />}
              width={150}
            />
            <Column
              header={<Cell>Dir</Cell>}
              cell={props => <Cell {...props}>
                {this.props.trades[props.rowIndex].direction}
              </Cell>}
              width={50}
            />
            <Column
              header={<Cell>CCY</Cell>}
              cell={props => <Cell {...props}>
                {this.props.trades[props.rowIndex].pair}
              </Cell>}
              width={70}
            />
            <Column
              header={<Cell className='text-right'>Notional</Cell>}
              cell={props => <MoneyCell className='text-right' data={this.props.trades} field='amount' {...props} />}
              width={120}
            />
            <Column
              header={<Cell className='text-right'>Rate</Cell>}
              cell={props => <Cell className='text-right' {...props}>
                {this.props.trades[props.rowIndex].rate}
              </Cell>}
              width={80}
            />
            <Column
              header={<Cell>Status</Cell>}
              cell={props => <Cell className='trade-status' {...props}>
                {this.props.trades[props.rowIndex].status}
              </Cell>}
              width={80}
            />
            <Column
              header={<Cell>Value date</Cell>}
              cell={props => <DateCell field='valueDate' prefix='SP. ' format='DD MMM' data={this.props.trades} {...props} />}
              width={100}
            />
            <Column
              header={<Cell>Trader</Cell>}
              cell={props => <Cell {...props}>
                {this.props.trades[props.rowIndex].trader}
              </Cell>}
              width={80}
            />
          </Table>
        </div>
      </Container>
    );
  }
}

export default Blotter;
