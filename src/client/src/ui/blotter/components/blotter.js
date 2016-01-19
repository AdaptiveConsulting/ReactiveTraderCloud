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
    if (window.fin){
      const OFD = window.fin.desktop;
      // listen to messages about highlighting the relevant trade
      OFD.main(() =>{
        OFD.InterApplicationBus.subscribe(
          '*', 'acknowledgeTrade', (id) => findWhere(this.props.trades, {id}) && this.setState({flagged: id}) // eslint-disable-line
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

  /**
   * Returns the column and cell definition for the table rendering, binds cells to data
   * @param {Array} trades
   * @returns {Array:Column}
   */
  getSchema(trades:array):Array<Column> {
    const cellConstructor = (field, extraCellOptions = {}) =>
      props => <Cell {...props} {...extraCellOptions}>{trades[props.rowIndex][field]}</Cell>; // eslint-disable-line

    const schema = [{
      name: 'Id',
      field: 'id',
      cellConstructor,
      width: 80
    }, {
      name: 'Date',
      field: 'dateTime',
      cellConstructor: () => props => <DateCell field='dateTime' data={trades} {...props} />, // eslint-disable-line
      width: 150
    }, {
      name: 'Dir',
      field: 'direction',
      cellConstructor,
      width: 50
    }, {
      name: 'CCY',
      field: 'pair',
      cellConstructor,
      width: 70
    }, {
      name: 'Notional',
      field: 'amount',
      cellConstructor: () => props => <NotionalCell className='text-right' data={trades} field='amount' suffix={' ' + trades[props.rowIndex].pair.substr(0, 3)} {...props} />, // eslint-disable-line
      width: 120,
      headerOptions: {
        className: 'text-right'
      }
    }, {
      name: 'Rate',
      field: 'rate',
      cellConstructor,
      width: 80,
      className: 'text-right',
      headerOptions: {
        className: 'text-right'
      }
    }, {
      name: 'Status',
      field: 'status',
      cellConstructor,
      width: 80,
      className: 'trade-status'
    }, {
      name: 'Value date',
      field: 'valueDate',
      cellConstructor: () => props => <DateCell field='valueDate' prefix='SP. ' format='%d %b' data={trades} {...props} />, // eslint-disable-line
      width: 100
    }, {
      name: 'Trader',
      field: 'trader',
      cellConstructor,
      width: 80
    }];

    return schema.map((column, id) =>{
      const cellOptions = {};

      column.className && (cellOptions.className = column.className);

      const columnOptions = {
        width: column.width || 100,
        field: column.field,
        cell: column.cellConstructor(column.field, cellOptions),
        header: <Cell field={column.field} {...column.headerOptions}>{column.name}</Cell>
      };

      return <Column key={id} {...columnOptions} />;
    });
  }

  render(){
    const outerClassName = serviceContainer.serviceStatus.blotter.isConnected ? 'blotter online' : 'blotter offline';

    const { trades } = this.props,
          schema = this.getSchema(trades),
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
