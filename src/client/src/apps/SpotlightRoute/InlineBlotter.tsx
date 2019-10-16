import React, { FC, useEffect, useState } from 'react'
import numeral from 'numeral'
import { DateTime } from 'luxon'
import styled from 'styled-components'
import { map, scan } from 'rxjs/operators'
import { useBlotterService } from './hooks'
import { useServiceStub } from './context'
import { Trade } from 'rt-types'
// TODO - lift out
import { TradesUpdate } from '../MainRoute/widgets/blotter/blotterService'

type TradeLookup = Map<number, Trade>

const MAX_TRADES = 20

const Table = styled.table`
  th, td {
    text-align: left;
    width: 100px;
  }
`

interface IProps {
  currency?: string
  count?: number
}

export const InlineBlotter: FC<IProps> = ({currency, count}) => {
  const [trades, setTrades] = useState([])
  const [tradeCount, setTradeCount] = useState(0)
  const serviceStub = useServiceStub()
  const blotterService = useBlotterService(serviceStub)

  useEffect(() => {
    if (!blotterService) {
      return
    }
    const subscription = blotterService.getTradesStream()
      .pipe(
        map((tradeUpdate: TradesUpdate) => tradeUpdate.trades.filter(trade => !currency || trade.dealtCurrency === currency)),
        scan<Trade[], Map<number, Trade>>((acc, trades) => {
          trades.forEach(trade => acc.set(trade.tradeId, trade))
          return acc
        }, new Map<number, Trade>()),
        map((trades: TradeLookup) => Array.from(trades.values()).reverse()),
      )
      .subscribe(result => {
        setTradeCount(result.length)
        setTrades(result.slice(0, typeof count !== 'undefined' ? count : MAX_TRADES))
      }, console.error)

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [blotterService, currency, count])

  return (
    <>
      <span>Showing {trades.length} of {tradeCount} trades.</span>
      <Table>
        <thead>
        <tr>
          <th>Trade ID</th>
          <th>Symbol</th>
          <th>Notional</th>
          <th>Trade Date</th>
          <th>Status</th>
        </tr>
        </thead>
        <tbody>
        {trades.map(trade => (
          <tr key={trade.tradeId}>
            <td>{trade.tradeId}</td>
            <td>{trade.symbol}</td>
            <td>{numeral(trade.notional).format()}</td>
            <td>{DateTime.fromJSDate(trade.tradeDate).toFormat('yyyy LLL dd')}</td>
            <td>{trade.status}</td>
          </tr>
        ))}
        </tbody>
      </Table>
    </>
  )
}
