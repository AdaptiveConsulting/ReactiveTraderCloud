import React from 'react';
import { Table, Column, Cell } from 'fixed-data-table';
import { DateCell, NotionalCell } from './';
import Dimensions from 'react-dimensions';
import { TradeRow } from '../../../services/model';
import { ViewBase } from '../../common';
import { router, logger } from '../../../system';
import classNames from 'classnames';
import 'fixed-data-table/dist/fixed-data-table.css';
import './blotter.scss';

@Dimensions()
export default class BlotterView extends React.Component {

  static propTypes = {
    model: React.PropTypes.object.isRequired,
    updateDimensions: React.PropTypes.func.isRequired,
    containerWidth: React.PropTypes.number.isRequired,
    containerHeight: React.PropTypes.number.isRequired
  };

  constructor(props, context) {
    super(props, context);
  }

  componentWillReceiveProps() {
    this.props.updateDimensions();
  }

  render() {
    let model = this.props.model;
    if (!model) {
      return null;
    }
    let columns = this._createGridColumns(model.trades);
    let className = classNames(
      'blotter', {
        'blotter--online': model.isConnected,
        'blotter--offline': !model.isConnected
      });
    let newWindowClassName = classNames(
      'glyphicon glyphicon-new-window',
      {
        'blotter__controls--hidden': model.canPopout
      }
    );
    let containerWidth = this.props.containerWidth; // comes from the @Dimensions annotation
    let containerHeight = this.props.containerHeight; // comes from the @Dimensions annotation
    return (
      <div className={className}>
        <div className='blotter-wrapper'>
          <div className='blotter__controls popout__controls'>
            <i className={newWindowClassName}
               onClick={() => router.publishEvent(this.props.model.modelId, 'tearOffBlotter', {})} />
          </div>
          <Table
            rowHeight={30}
            headerHeight={30}
            rowsCount={model.trades.length}
            width={containerWidth}
            height={containerHeight}
            rowClassNameGetter={(index) => this._getRowClass(model.trades[index])}>
            {columns}
          </Table>
        </div>
      </div>
    );
  }

  _createGridColumns():Array<Column> {
    return [
      <Column
        key='Id'
        header={<Cell>Id</Cell>}
        cell={props => <Cell>{this.props.model.trades[props.rowIndex].trade.tradeId}</Cell>}
        flexGrow={1}
        width={50}/>,
      <Column
        key='Date'
        header={<Cell>Date</Cell>}
        cell={props => <DateCell width={props.width} dateValue={this.props.model.trades[props.rowIndex].trade.tradeDate} />}
        flexGrow={1}
        width={150}/>,
      <Column
        key='Dir'
        header={<Cell>Direction</Cell>}
        cell={props => <Cell>{this.props.model.trades[props.rowIndex].trade.direction.name.toUpperCase()}</Cell>}
        flexGrow={1}
        width={80}/>,
      <Column
        key='CCY'
        header={<Cell>CCYCCY</Cell>}
        cell={props => <Cell>{this.props.model.trades[props.rowIndex].trade.currencyPair.symbol}</Cell>}
        flexGrow={1}
        width={70}/>,
      <Column
        key='Notional'
        header={<Cell className='blotter__trade-field--align-right'>Notional</Cell>}
        cell={props => {
          let trade = this.props.model.trades[props.rowIndex].trade;
          return (
            <NotionalCell
              width={props.width}
              className='blotter__trade-field--align-right'
              notionalValue={trade.notional}
              suffix={' ' + trade.currencyPair.base} />
          );
        }}
        flexGrow={1}
        width={120}/>,
      <Column
        key='Rate'
        header={<Cell className='blotter__trade-field--align-right'>Rate</Cell>}
        cell={props => <Cell className='blotter__trade-field--align-right'>{this.props.model.trades[props.rowIndex].trade.spotRate}</Cell>}
        flexGrow={1}
        width={80}/>,
      <Column
        key='Status'
        header={<Cell>Status</Cell>}
        cell={props => <Cell className='blotter__trade-status'>{this.props.model.trades[props.rowIndex].trade.status.name}</Cell>}
        flexGrow={1}
        width={80}/>,
      <Column
        key='Value date'
        header={<Cell>Value date</Cell>}
        cell={props => <DateCell width={props.width} prefix='SP. ' format='%d %b' dateValue={this.props.model.trades[props.rowIndex].trade.valueDate} />}
        flexGrow={1}
        width={100}/>,
      <Column
        key='Trader'
        header={<Cell>Trader</Cell>}
        cell={props => <Cell>{this.props.model.trades[props.rowIndex].trade.traderName}</Cell>}
        flexGrow={1}
        width={80}/>
    ];
  }

  /**
   * Returns the class to apply to a row
   * @param rowItem
   * @returns {string}
   */
  _getRowClass(rowItem:TradeRow) {
    return classNames(
      'blotter__trade',
      {
        'blotter__trade--new': rowItem.isNew,
        'blotter__trade--highlighted': rowItem.isInFocus,
        'blotter__trade--rejected': rowItem.trade.status.name.toLowerCase() === 'rejected',
        'blotter__trade--processing': rowItem.trade.status.name.toLowerCase() === 'processing'
      }
    );
  }
}
