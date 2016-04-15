import React from 'react';
import { Table, Column, Cell } from 'fixed-data-table';
import { DateCell, NotionalCell } from './';
import Dimensions from 'react-dimensions';
import { Trade } from '../../../services/model';
import { ViewBase } from '../../common';
import { router, logger } from '../../../system';
import classNames from 'classnames';
import { BlotterModel } from '../model';
import 'fixed-data-table/dist/fixed-data-table.css';
import './blotter.scss';

@Dimensions()
export default class BlotterView extends ViewBase {

  constructor(props, context) {
    super(props, context);
    this.state = {
      model: null
    };
  }

  render() {
    let model:BlotterModel = this.state.model;
    if (!model) {
      return null;
    }

    let columns = this._createGridColumns(model.trades);
    let className = classNames(
      'blotter', {
        'blotter--online': model.isConnected,
        'blotter--offline': !model.isConnected
      });
    let containerWidth = this.props.containerWidth; // comes from the the @Dimensions annotation
    let containerHeight = this.props.containerHeight; // comes from the the @Dimensions annotation
    return (
      <div className={className}>
        <div className='blotter-wrapper'>
          <div className='blotter__controls popout__controls'>
            <i className='glyphicon glyphicon-new-window'
               onClick={() => router.publishEvent(this.props.modelId, 'tearOffBlotter', {})} />
          </div>
          <Table
            rowHeight={24}
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
        key='Date'
        header={<Cell>Date</Cell>}
        cell={props => (<DateCell dateValue={this.state.model.trades[props.rowIndex].tradeDate} />)}
        flexGrow={1}
        width={150}/>,
      <Column
        key='Dir'
        header={<Cell>Dir</Cell>}
        cell={props => (<Cell className='blotter__trade-field--emphasized'>{this.state.model.trades[props.rowIndex].direction.name}</Cell>)}
        flexGrow={1}
        width={50}/>,
      <Column
        key='CCY'
        header={<Cell>CCY</Cell>}
        cell={props => (<Cell className='blotter__trade-field--emphasized'>{this.state.model.trades[props.rowIndex].currencyPair.symbol}</Cell>)}
        flexGrow={1}
        width={70}/>,
      <Column
        key='Notional'
        header={<Cell className='blotter__trade-field--align-right'>Notional</Cell>}
        cell={props => {
          let trade = this.state.model.trades[props.rowIndex];
          return (<NotionalCell
            className='blotter__trade-field--emphasized blotter__trade-field--align-right'
            notionalValue={trade.notional}
            suffix={' ' + trade.currencyPair.base} />);
        }}
        flexGrow={1}
        width={120}/>,
      <Column
        key='Rate'
        header={<Cell className='blotter__trade-field--align-right'>Rate</Cell>}
        cell={props => (<Cell className='blotter__trade-field--emphasized blotter__trade-field--align-right'>{this.state.model.trades[props.rowIndex].spotRate}</Cell>)}
        flexGrow={1}
        width={80}/>,
      <Column
        key='Status'
        header={<Cell>Status</Cell>}
        cell={props => (<Cell className='blotter__trade-status'>{this.state.model.trades[props.rowIndex].status.name}</Cell>)}
        flexGrow={1}
        width={80}/>,
      <Column
        key='Value date'
        header={<Cell>Value date</Cell>}
        cell={props => (<DateCell prefix='SP. ' format='%d %b' dateValue={this.state.model.trades[props.rowIndex].valueDate} />)}
        flexGrow={1}
        width={100}/>,
      <Column
        key='Trader'
        header={<Cell>Trader</Cell>}
        cell={props => (<Cell>{this.state.model.trades[props.rowIndex].traderName}</Cell>)}
        flexGrow={1}
        width={80}/>,
      <Column
        key='Id'
        header={<Cell>Trade #</Cell>}
        cell={props => (<Cell>{this.state.model.trades[props.rowIndex].tradeId}</Cell>)}
        flexGrow={1}
        width={80}/>
    ];
  }

  /**
   * Returns the class to apply to a row
   * @param rowItem
   * @returns {string}
   */
  _getRowClass(rowItem:Trade) {
    return classNames(
      'animated',
      'blotter__trade',
      {
        'blotter__trade--rejected': rowItem.status.name.toLowerCase() === 'rejected',
        'blotter__trade--processing': rowItem.status.name.toLowerCase() === 'processing'
      }
    );
  }
}
