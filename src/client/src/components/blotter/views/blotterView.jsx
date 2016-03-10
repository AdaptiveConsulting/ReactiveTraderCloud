import React from 'react';
import { Table, Column, Cell } from 'fixed-data-table';
import { DateCell, NotionalCell } from './';
import Dimensions from 'react-dimensions';
import { Trade } from '../../../services/model';
import { ViewBase } from '../../common';
import { router, logger } from '../../../system';
import classNames from 'classnames';
import { BlotterModel } from '../model';

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
        'online': model.isConnected,
        'offline': !model.isConnected
      });
    let containerWidth = this.props.containerWidth; // comes from the the @Dimensions annotation
    return (
      <div className={className}>
        <div className='container-control'>
          <i className='tearoff-trigger glyphicon glyphicon-new-window' onClick={() => router.publishEvent(this.props.modelId, 'tearOffBlotter')}/>
        </div>
        <div className='blotter-wrapper'>
          <div className='status'>
            <i className='fa fa-plug animated infinite fadeIn'/>
          </div>
          <Table
            rowHeight={24}
            headerHeight={30}
            rowsCount={model.trades.length}
            width={containerWidth}
            height={280}
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
        cell={props => (<Cell width={80}>{this.state.model.trades[props.rowIndex].tradeId}</Cell>)}
        width={80}/>,
      <Column
        key='Date'
        header={<Cell>Date</Cell>}
        cell={props => (<DateCell width={150} dateValue={this.state.model.trades[props.rowIndex].tradeDate} />)}
        width={150}/>,
      <Column
        key='Dir'
        header={<Cell>Dir</Cell>}
        cell={props => (<Cell width={50}>{this.state.model.trades[props.rowIndex].direction.name}</Cell>)}
        width={50}/>,
      <Column
        key='CCY'
        header={<Cell>CCY</Cell>}
        cell={props => (<Cell width={70}>{this.state.model.trades[props.rowIndex].currencyPair.symbol}</Cell>)}
        width={70}/>,
      <Column
        key='Notional'
        header={<Cell className='text-right'>Notional</Cell>}
        cell={props => {
          let trade = this.state.model.trades[props.rowIndex];
          return (<NotionalCell
            className='text-right'
            width={120}
            notionalValue={trade.notional}
            suffix={' ' + trade.currencyPair.base} />);
        }}
        width={120}/>,
      <Column
        key='Rate'
        header={<Cell className='text-right'>Rate</Cell>}
        cell={props => (<Cell width={80} className='text-right'>{this.state.model.trades[props.rowIndex].spotRate}</Cell>)}
        width={80}/>,
      <Column
        key='Status'
        header={<Cell>Status</Cell>}
        cell={props => (<Cell className='trade-status' width={80}>{this.state.model.trades[props.rowIndex].status.name}</Cell>)}
        width={80}/>,
      <Column
        key='Value date'
        header={<Cell>Value date</Cell>}
        cell={props => (<DateCell width={100} prefix='SP. ' format='%d %b' dateValue={this.state.model.trades[props.rowIndex].valueDate} />)}
        width={100}/>,
      <Column
        key='Trader'
        header={<Cell>Trader</Cell>}
        cell={props => (<Cell width={80}>{this.state.model.trades[props.rowIndex].traderName}</Cell>)}
        width={80}/>
    ];
  }

  /**
   * Returns the class to apply to a row
   * @param rowItem
   * @returns {string}
   */
  _getRowClass(rowItem:Trade){
    return classNames(rowItem.status.name, ' animated ');
  }
}
