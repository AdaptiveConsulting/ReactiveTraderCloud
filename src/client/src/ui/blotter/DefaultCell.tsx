import * as React from 'react'
import * as classNames from 'classnames'

import './DefaultCellStyles.scss'

import { TradeStatus } from '../../types/tradeStatus'

export interface BaseCellProps {
  classname?: string
  cellKey: string
  trade: any
}

export const BaseCell = (props: BaseCellProps) => {
  const baseCellClassName = classNames(props.classname, getCellClassName(props.trade.status, props.cellKey))
  return (
    <div className={baseCellClassName}>
      {props.trade[props.cellKey]}
    </div>
  )
}

export const getCellClassName = (tradeStatus: TradeStatus, cellKey: string) => {
  return cellKey !== 'status' && tradeStatus.toString() === 'rejected' && 'rejectedCell' || undefined
}

export default BaseCell
