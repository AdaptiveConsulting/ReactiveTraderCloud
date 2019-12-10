import React, { FC } from 'react'
import numeral from 'numeral'
import { DateTime } from 'luxon'
import { BlotterFilters } from '../../../MainRoute/widgets/blotter'
import { InlineIntent, Table } from './styles';
import { useBlotterTrades } from './useBlotterTrades';

interface BlotterProps {
  readonly filters?: BlotterFilters
}

export const InlineBlotter: FC<BlotterProps> = ({ filters }) => {
  const trades = useBlotterTrades(filters);

  if (!trades || (trades && trades.length === 0)) {
    return (
      <InlineIntent>
        No last trades
      </InlineIntent>
    )
  }

  return (
    <InlineIntent>
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
    </InlineIntent>
  )
}
