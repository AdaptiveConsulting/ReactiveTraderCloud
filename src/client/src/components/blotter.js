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
      // listen to messages about highlighting the relevant trade
      window.fin.desktop.main(() =>{
        window.fin.desktop.InterApplicationBus.subscribe('*', 'acknowledgeTrade', (id) =>{
          const trade = findWhere(this.props.trades, {
            id
          });

          trade && (this.setState({flagged: id})); // eslint-disable-line
        });
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

  getRowClass(rowItem){
    const flagged = this.state.flagged,
          flash = flagged && flagged === rowItem.id;

    return rowItem.status + ' animated ' + (flash ? 'flash' : 'slideInDown');
  }

  render(){
    const outerClassName = this.props.status ? 'blotter online' : 'blotter offline';

    const { flagged } = this.state,
          { trades } = this.props;

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
            <Column
              header={<Cell>Id</Cell>}
              cell={props => <Cell {...props}>
                {trades[props.rowIndex].id}
              </Cell>}
              width={50}
            />
            <Column
              header={<Cell>Date</Cell>}
              cell={props => <DateCell field='dateTime' data={trades} {...props} />}
              width={150}
            />
            <Column
              header={<Cell>Dir</Cell>}
              cell={props => <Cell {...props}>
                {trades[props.rowIndex].direction}
              </Cell>}
              width={50}
            />
            <Column
              header={<Cell>CCY</Cell>}
              cell={props => <Cell {...props}>
                {trades[props.rowIndex].pair}
              </Cell>}
              width={70}
            />
            <Column
              header={<Cell className='text-right'>Notional</Cell>}
              cell={props => <NotionalCell className='text-right' data={trades} field='amount' suffix={' ' + trades[props.rowIndex].pair.substr(0, 3)} {...props} />}
              width={120}
            />
            <Column
              header={<Cell className='text-right'>Rate</Cell>}
              cell={props => <Cell className='text-right' {...props}>
                {trades[props.rowIndex].rate}
              </Cell>}
              width={80}
            />
            <Column
              header={<Cell>Status</Cell>}
              cell={props => <Cell className='trade-status' {...props}>
                {trades[props.rowIndex].status}
              </Cell>}
              width={80}
            />
            <Column
              header={<Cell>Value date</Cell>}
              cell={props => <DateCell field='valueDate' prefix='SP. ' format='DD MMM' data={trades} {...props} />}
              width={100}
            />
            <Column
              header={<Cell>Trader</Cell>}
              cell={props => <Cell {...props}>
                {trades[props.rowIndex].trader}
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
