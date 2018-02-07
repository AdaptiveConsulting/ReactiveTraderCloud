import * as React from 'react'
import { Column, Table } from 'react-virtualized'
import * as classNames from 'classnames'
import 'fixed-data-table/dist/fixed-data-table.css'

import { CurrencyPair, Trade, TradeStatus } from '../../types'
import { DateCell } from './'
import { BaseCell, getCellClassName } from './DefaultCell'
import { timeFormat } from 'd3-time-format'

import './BlotterStyles.scss'

type TradeRow = any

export interface BlotterProps {
  canPopout: boolean
  onPopoutClick: () => void
  isConnected: boolean
  trades: any
  currencyPairs: CurrencyPair[]
  // passed by SizeMe :
  size?: {
    width: number
    height: number,
  }
}

export default class Blotter extends React.Component<BlotterProps, {}> {
  render() {
    const { canPopout, onPopoutClick, isConnected, trades, currencyPairs, size } = this.props
    const columns = this.createGridColumns(trades, currencyPairs)
    const className = classNames(
      'blotter', {
        'blotter--online': isConnected,
        'blotter--offline': !isConnected,
      })
    const newWindowClassName = classNames(
      'glyphicon glyphicon-new-window',
      {
        'blotter__controls--hidden': canPopout,
      },
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

  private baseCellRenderer = (cellKey:string, className:string = null) => (props: any) => {
    return <BaseCell cellKey={cellKey} trade={props.rowData} classname={className}/>
  }

  private dateCellRenderer = (formattedValue:string, cellClassName = null) => (props: any) => {
    const className = cellClassName ? cellClassName : getCellClassName(this.props.trades[props.rowIndex].status, 'Value date')
    return <DateCell formattedValue={formattedValue} classname={className } />
  }

  createGridColumns(trades: Trade[], currencyPairs: CurrencyPair[]): any[] {
    return [
      <Column
        key="tradeId"
        dataKey="tradeId"
        label={'Id'}
        cellRenderer={this.baseCellRenderer('tradeId')}
        flexGrow={1}
        width={50}/>,
      <Column
        key="Date"
        dataKey="Date"
        label={'Date'}
        cellRenderer={(props: any) => this.dateCellRenderer(`${timeFormat('%e-%b %H:%M:%S')(trades[props.rowIndex].tradeDate)}`)(props)}
        flexGrow={1}
        width={150}/>,
      <Column
        key="Dir"
        dataKey="Dir"
        label={'Direction'}
        cellRenderer={this.baseCellRenderer('direction')}
        flexGrow={1}
        width={80}/>,
      <Column
        key="CCY"
        dataKey="CCY"
        label={'CCYCCY'}
        cellRenderer={this.baseCellRenderer('symbol')}
        flexGrow={1}
        width={70}/>,
      <Column
        key="Notional"
        dataKey="Notional"
        label={'Notional'}
        cellRenderer={(props: any) => this.dateCellRenderer(trades[props.rowIndex].notional.toString(), classNames('blotter__trade-field--align-right', getCellClassName(trades[props.rowIndex].status, 'Notional')))(props) }
        flexGrow={1}
        width={120}/>,
      <Column
        key="Rate"
        dataKey="Rate"
        label={'Rate'}
        cellRenderer={this.baseCellRenderer('spotRate', 'blotter__trade-field--align-right')}
        flexGrow={1}
        width={80}/>,
      <Column
        key="Status"
        dataKey="Status"
        label={'Status'}
        cellRenderer={(props:any) => this.baseCellRenderer('status', classNames('blotter__trade-status', getTradeStatusCellStyle(trades[props.rowIndex].status)))(props)}
        flexGrow={1}
        width={80}/>,
      <Column
        key="Value date"
        dataKey="Value date"
        label={'Value date'}
        cellRenderer={(props: any) => this.dateCellRenderer(`SP.${timeFormat('%d %b')(trades[props.rowIndex].valueDate)}`)(props)}
        flexGrow={1}
        width={100}/>,
      <Column
        key="Trader"
        dataKey="Trader"
        label={'Trader'}
        cellRenderer={this.baseCellRenderer('traderName')}
        flexGrow={1}
        width={80}/>,
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
      rowItem.status === 'pending' && 'blotter__trade--processing',
    )
  }
}

const getTradeStatusCellStyle = (tradeStatus: TradeStatus) => tradeStatus === TradeStatus.Rejected && 'tradeRejected'
