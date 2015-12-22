import React from 'react';
import ReactDOM from 'react-dom';

// data grid
import FixedDataTable from 'fixed-data-table';
const {Table, Column, Cell} = FixedDataTable;

// utils for date and money
import numeral from 'numeral';
import moment from 'moment';

// containers and layout
import Dimensions from 'react-dimensions';
import Container from './container';

import { findWhere } from 'lodash';

/**
 * Formatter for cells of type date/time via moment.js
 * @class DateCell
 * @extends {React.Component}
 */
class DateCell extends React.Component {

  static propTypes = {
    format: React.PropTypes.string,
    prefix: React.PropTypes.string,
    field: React.PropTypes.string.isRequired,
    data: React.PropTypes.array.isRequired,
    rowIndex: React.PropTypes.number.isRequired
  }

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

/**
 * Formatter for cells of type notional/currency
 * @class NotionalCell
 * @extends {React.Component}
 */
class NotionalCell extends React.Component {

  static propTypes = {
    format: React.PropTypes.string,
    suffix: React.PropTypes.string,
    field: React.PropTypes.string.isRequired,
    data: React.PropTypes.array.isRequired,
    rowIndex: React.PropTypes.number.isRequired
  }

  render(){
    const { rowIndex, field, data, format = '0,000,000[.]00', suffix = '', ...props } = this.props;
    const formatted = numeral(data[rowIndex][field]).format(format) + suffix;

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
    const cellConstructor = (field, extraCellOptions = {}) => props => <Cell {...props} {...extraCellOptions}>{trades[props.rowIndex][field]}</Cell>;

    const schema = [{
      name: 'Id',
      field: 'id',
      cellConstructor,
      width: 80
    }, {
      name: 'Date',
      field: 'dateTime',
      cellConstructor: () => props => <DateCell field='dateTime' data={trades} {...props} />,
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
      cellConstructor: () => props => <NotionalCell className='text-right' data={trades} field='amount' suffix={' ' + trades[props.rowIndex].pair.substr(0, 3)} {...props} />,
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
      cellConstructor: () => props => <DateCell field='valueDate' prefix='SP. ' format='DD MMM' data={trades} {...props} />,
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

      return <Column {...columnOptions} />;
    });
  }

  render(){
    const outerClassName = this.props.status ? 'blotter online' : 'blotter offline';

    const { flagged } = this.state,
          { trades } = this.props,
          schema = this.getSchema(trades);

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
            rowHeight={24}
            headerHeight={30}
            rowsCount={trades.length}
            width={this.props.containerWidth}
            height={300}
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
