import * as React from 'react'
import { Column, Table } from 'react-virtualized'
import * as classNames from 'classnames'
import 'fixed-data-table/dist/fixed-data-table.css'

import { TradeStatus } from '../../types'
import { DateCell, NotionalCell } from './'
import { BaseCell, getCellClassName } from './DefaultCell';

import './BlotterStyles.scss'

type TradeRow = any

export interface BlotterProps {
  canPopout: boolean
  onPopoutClick: () => void
  isConnected: boolean
  trades: any
  // passed by SizeMe :
  size?: {
    width: number
    height: number,
  }
}

export default class Blotter extends React.Component<BlotterProps, {}> {
  render() {
    const { canPopout, onPopoutClick, isConnected, trades, size } = this.props
    const columns = this.createGridColumns(trades)
    const className = classNames(
      'blotter', {
        'blotter--online': isConnected,
        'blotter--offline': !isConnected
      })
    const newWindowClassName = classNames(
      'glyphicon glyphicon-new-window',
      {
        'blotter__controls--hidden': canPopout
      }
    )

    return (
      <div className={className}>
        <div className="blotter-wrapper">
          <div className="blotter__controls popout__controls">
            <i className={newWindowClassName}
               onClick={() => onPopoutClick()}/>
          </div>
          <Table
            rowHeight={30}
            headerHeight={30}
            rowCount={trades.length}
            width={size.width}
            height={size.height}
            rowStyle={{ display: 'flex' }}
            rowClassName={({ index }) => this.getRowClass(trades[index])}
            rowGetter={({ index }) => trades[index]}>
            {columns}
          </Table>
        </div>
      </div>
    )
  }

  createGridColumns(trades: any): any[] {
    const trade = (rowIndex: number) => trades[rowIndex];
    return [
      <Column
        key="tradeId"
        dataKey="tradeId"
        label={'Id'}
        cellRenderer={(props: any) =>
          <BaseCell
            cellKey="tradeId"
            trade={trade(props.rowIndex)}
          />
        }
        flexGrow={1}
        width={50}/>,
      <Column
        key="Date"
        dataKey="Date"
        label={'Date'}
        cellRenderer={(props: any) =>
          <DateCell
            width={props.width}
            dateValue={trades[props.rowIndex].tradeDate}
            classname={getCellClassName(trades[props.rowIndex].status, "Value date")}
          />
        }
        flexGrow={1}
        width={150}/>,
      <Column
        key="Dir"
        dataKey="Dir"
        label={'Direction'}
        cellRenderer={(props: any) =>
          <BaseCell
            cellKey="direction"
            trade={trade(props.rowIndex)}
          />
        }
        flexGrow={1}
        width={80}/>,
      <Column
        key="CCY"
        dataKey="CCY"
        label={'CCYCCY'}
        cellRenderer={(props: any) =>
          <BaseCell
            cellKey="currencyPair.symbol"
            trade={trade(props.rowIndex)}
          />
        }
        flexGrow={1}
        width={70}/>,
      <Column
        key="Notional"
        dataKey="Notional"
        label={'Notional'}
        cellRenderer={(props: any) => {
          const trade = trades[props.rowIndex]
          return (
            <NotionalCell
              width={props.width}
              className={classNames('blotter__trade-field--align-right', getCellClassName(trades[props.rowIndex].status, "Notional"))}
              notionalValue={trade.notional}
              suffix={' ' + trade.currencyPair.base}/>
          )
        }}
        flexGrow={1}
        width={120}/>,
      <Column
        key="Rate"
        dataKey="Rate"
        label={'Rate'}
        cellRenderer={(props: any) =>
          <BaseCell
            classname="blotter__trade-field--align-right"
            cellKey="spotRate"
            trade={trade(props.rowIndex)}
          />
        }
        flexGrow={1}
        width={80}/>,
      <Column
        key="Status"
        dataKey="Status"
        label={'Status'}
        cellRenderer={(props: any) =>
          <BaseCell
            classname={classNames("blotter__trade-status", getTradeStatusCellStyle(trade(props.rowIndex).status))}
            cellKey="status"
            trade={trade(props.rowIndex)}
          />
        }
        flexGrow={1}
        width={80}/>,
      <Column
        key="Value date"
        dataKey="Value date"
        label={'Value date'}
        cellRenderer={(props: any) =>
          <DateCell
            width={props.width}
            prefix="SP. "
            format="%d %b"
            dateValue={trades[props.rowIndex].valueDate}
            classname={getCellClassName(trades[props.rowIndex].status, "Value date")}
          />
        }
        flexGrow={1}
        width={100}/>,
      <Column
        key="Trader"
        dataKey="Trader"
        label={'Trader'}
        cellRenderer={(props: any) =>
          <BaseCell
            cellKey="traderName"
            trade={trade(props.rowIndex)}
          />
        }
        flexGrow={1}
        width={80}/>
    ]
  }

  /**
   * Returns the class to apply to a row
   */
  getRowClass(rowItem: TradeRow) {
    if (!rowItem) {
      return ''
    }

    return classNames(
      'blotter__trade',
      getTradeClassName(rowItem.status)
    )
  }
}

const getTradeStatusCellStyle = (tradeStatus: TradeStatus) => tradeStatus === 'rejected' && 'tradeRejected'

const getTradeClassName = (tradeStatus: TradeStatus) => {
  const tradeStatusMap = {
    Rejected: 'blotter__trade--rejected',
    Pending: 'blotter__trade--processing'
  }
  return tradeStatusMap[tradeStatus]
}
