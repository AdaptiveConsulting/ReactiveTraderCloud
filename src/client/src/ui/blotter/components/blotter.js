import React from 'react';
import ReactDOM from 'react-dom';

// data grid
import { Table, Column, Cell } from 'fixed-data-table';
import NotionalCell from './notional-cell';
import DateCell from './date-cell';

// containers and layout
import Dimensions from 'react-dimensions';
import { Container } from '../../common/components';

import { findWhere } from 'lodash';
import { serviceContainer } from 'services';

const headerHeight = 30,
      rowHeight = 24,
      // adjust for borders, header and shadow?
      blotterHeight = 280;

/**
 * @class Blotter
 * @extends {React.Component}
 */
@Dimensions()
class Blotter extends React.Component {

  static propTypes = {
    trades: React.PropTypes.array,
    status: React.PropTypes.number,
    containerWidth: React.PropTypes.number,
    containerHeight: React.PropTypes.number
  }

  constructor(props, context){
    super(props, context);
    this.state = {
      tearoff: false,
      flagged: null
    };
  }

  componentDidMount(){
    // TODO
    // 1) no open fin abstraction, all code has to do this dance
    // 2) disabling the ES6 warning about setting state in componentDidMount, and hopefully the component is still around if and when that fires
    // 3) server things happening on a single line including calling setstate in a comparison statement.
    // 4) relatively pointless use of const
    if (window.fin){
      const OFD = window.fin.desktop;
      // listen to messages about highlighting the relevant trade
      OFD.main(() =>{
        OFD.InterApplicationBus.subscribe(
          '*', 'acknowledgeTrade', (tradeId) => findWhere(this.props.trades, {tradeId}) && this.setState({flagged: tradeId}) // eslint-disable-line
        );
      });
    }
  }

  tearOff(state){
    this.setState({
      tearoff: state
    });
  }

  componentWillReceiveProps(){
    this.state.flagged = false;
  }

  /**
   * Returns the class to apply to a row - flashing if required for OpenFin attention
   * @param rowItem
   * @returns {string}
   */
  getRowClass(rowItem:object){
    const flagged = this.state.flagged,
          flash   = flagged && flagged === rowItem.id;

    return rowItem.status + ' animated ' + (flash ? 'flash' : 'slideInDown');
  }

  getGridColumns():Array<Column> {
    return [
      <Column
        key='Id'
        header={<Cell>Id</Cell>}
        cell={props => (<Cell width={80}>{this.props.trades[props.rowIndex].tradeId}</Cell>)}
        width={80} />,
      <Column
        key='Date'
        header={<Cell>Date</Cell>}
        cell={props => (<DateCell width={150} dateValue={this.props.trades[props.rowIndex].tradeDate} />)}
        width={150} />,
      <Column
        key='Dir'
        header={<Cell>Dir</Cell>}
        cell={props => (<Cell width={50}>{this.props.trades[props.rowIndex].direction.name}</Cell>)}
        width={50} />,
      <Column
        key='CCY'
        header={<Cell>CCY</Cell>}
        cell={props => (<Cell width={70}>{this.props.trades[props.rowIndex].currencyPair.symbol}</Cell>)}
        width={70} />,
      <Column
        key='Notional'
        header={<Cell className='text-right'>Notional</Cell>}
        cell={props => {
          let trade = this.props.trades[props.rowIndex];
          return (<NotionalCell
            className='text-right'
            width={120}
            notionalValue={trade.notional}
            suffix={' ' + trade.currencyPair.base} />);
        }}
        width={120} />,
      <Column
        key='Rate'
        header={<Cell className='text-right'>Rate</Cell>}
        cell={props => (<Cell width={80} className='text-right'>{this.props.trades[props.rowIndex].spotRate}</Cell>)}
        width={80} />,
      <Column
        key='Status'
        header={<Cell>Status</Cell>}
        cell={props => (<Cell className='trade-status' width={80}>{this.props.trades[props.rowIndex].status.name}</Cell>)}
        width={80} />,
      <Column
        key='Value date'
        header={<Cell>Value date</Cell>}
        cell={props => (<DateCell width={100} prefix='SP. ' format='%d %b' dateValue={this.props.trades[props.rowIndex].valueDate} />)}
        width={100} />,
      <Column
        key='Trader'
        header={<Cell>Trader</Cell>}
        cell={props => (<Cell width={80}>{this.props.trades[props.rowIndex].traderName}</Cell>)}
        width={80} />
    ];
  }

  render(){
    const outerClassName = serviceContainer.serviceStatus.blotter.isConnected ? 'blotter online' : 'blotter offline';

    const { trades } = this.props,
          schema = this.getGridColumns(trades),
          height = this.state.tearoff ? 400 : blotterHeight;

    return (
      <Container
        title='blotter'
        className={outerClassName}
        onTearoff={(state) => this.tearOff(state)}
        tearoff={this.state.tearoff}
        width={this.props.containerWidth}
        height={400}
        options={{maximizable:true}}>
        <div className='blotter-wrapper'>
          <div className='status'>
            <i className='fa fa-plug animated infinite fadeIn'/>
          </div>
          <Table
            rowHeight={rowHeight}
            headerHeight={headerHeight}
            rowsCount={trades.length}
            width={this.props.containerWidth}
            height={height}
            rowClassNameGetter={(index) => this.getRowClass(trades[index])}
            {...this.props}>
            {schema}
          </Table>
        </div>
      </Container>
    );
  }
}

export default Blotter;
