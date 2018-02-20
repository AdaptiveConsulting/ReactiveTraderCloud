import './DefaultCellStyles.scss'
import * as classNames from 'classnames'
import * as React from 'react'
import { TradeStatus } from '../../../types'

export interface BaseCellProps {
  classname?: string
  cellKey: string
  trade: any
}

export const BaseCell = (props: BaseCellProps) => {
  const baseCellClassName = classNames(props.classname, getCellClassName(props.trade.status, props.cellKey))
  return <div className={baseCellClassName}>{props.trade[props.cellKey]}</div>
}

export const getCellClassName = (tradeStatus: TradeStatus, cellKey: string) => {
  return (cellKey !== 'status' && tradeStatus.toString() === 'rejected' && 'rejectedCell') || undefined
}

export default BaseCell
