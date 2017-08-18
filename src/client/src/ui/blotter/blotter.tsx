import * as React from 'react'
import { Column, Table } from 'react-virtualized'
import { DateCell, NotionalCell } from './'
import * as classNames from 'classnames'
import 'fixed-data-table/dist/fixed-data-table.css'
import './blotter.scss'
import { TradeStatus } from '../../services/model/index';

// import { TradeRow } from '../../../services/model'
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
    return [
      <Column
        key="tradeId"
        dataKey="tradeId"
        label={'Id'}
        cellRenderer={(props: any) => <div>{trades[props.rowIndex].tradeId}</div>}
        flexGrow={1}
        width={50}/>,
      <Column
        key="Date"
        dataKey="Date"
        label={'Date'}
        cellRenderer={(props: any) => <DateCell
          width={props.width}
          dateValue={trades[props.rowIndex].tradeDate}/>}
        flexGrow={1}
        width={150}/>,
      <Column
        key="Dir"
        dataKey="Dir"
        label={'Direction'}
        cellRenderer={(props: any) => <div>{trades[props.rowIndex].direction.name.toUpperCase()}</div>}
        flexGrow={1}
        width={80}/>,
      <Column
        key="CCY"
        dataKey="CCY"
        label={'CCYCCY'}
        cellRenderer={(props: any) => <div>{trades[props.rowIndex].currencyPair.symbol}</div>}
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
              className="blotter__trade-field--align-right"
              notionalValue={trade._notional}
              suffix={' ' + trade._currencyPair.base}/>
          )
        }}
        flexGrow={1}
        width={120}/>,
      <Column
        key="Rate"
        dataKey="Rate"
        label={'Rate'}
        cellRenderer={(props: any) => <div className="blotter__trade-field--align-right">
          {trades[props.rowIndex].spotRate}</div>}
        flexGrow={1}
        width={80}/>,
      <Column
        key="Status"
        dataKey="Status"
        label={'Status'}
        cellRenderer={(props: any) =>
          <div className={classNames("blotter__trade-status", getStatusCellStyles(trades[props.rowIndex].status.name))}>
            {trades[props.rowIndex].status.name}
          </div>}
        flexGrow={1}
        width={80}/>,
      <Column
        key="Value date"
        dataKey="Value date"
        label={'Value date'}
        cellRenderer={(props: any) => <DateCell
          width={props.width}
          prefix="SP. "
          format="%d %b"
          dateValue={trades[props.rowIndex].valueDate}/>}
        flexGrow={1}
        width={100}/>,
      <Column
        key="Trader"
        dataKey="Trader"
        label={'Trader'}
        cellRenderer={(props: any) => <div>{trades[props.rowIndex].traderName}</div>}
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

const getTradeClassName = (tradeStatus: TradeStatus) => {
  const tradeStatusMap = {
    'Rejected': 'blotter__trade--rejected',
    'Pending': 'blotter__trade--processing'
  }
  return tradeStatusMap[tradeStatus.name]
}

const getStatusCellStyles = (tradeStatus: string) => {
  return tradeStatus === 'Rejected' && 'cellRejected'
}
