import React, { FC } from 'react'
import numeral from 'numeral'
import { DateTime } from 'luxon'
import { BlotterFilters } from 'apps/MainRoute'
import { InlineIntent } from './styles'
import { useBlotterTrades } from './useBlotterTrades'
import { ResultsTable, Col, ResultsTableRow } from './resultsTable'
interface BlotterProps {
  readonly filters?: BlotterFilters
}

export const InlineBlotter: FC<BlotterProps> = ({ filters }) => {
  const trades = useBlotterTrades(filters)

  if (!trades || (trades && trades.length === 0)) {
    return <InlineIntent>No last trades</InlineIntent>
  }

  const colDefs: Col[] = [
    { title: 'Trade ID', id: 'tradeId' },
    { title: 'Symbol', id: 'symbol' },
    { title: 'Notional', id: 'notional' },
    { title: 'Trade Date', id: 'tradeDate' },
    { title: 'Status', id: 'status' },
  ]
  const rows = trades.map(trade => ({
    ...trade,
    notional: numeral(trade.notional).format(),
    tradeDate: DateTime.fromJSDate(trade.tradeDate).toFormat('dd-LLL-yyyy'),
  }))

  return (
    <InlineIntent>
      <ResultsTable cols={colDefs}>
        {rows &&
          rows.map((row: any, rowIndex: number) => {
            return <ResultsTableRow row={row} cols={colDefs} status={row.status} key={rowIndex} />
          })}
      </ResultsTable>
    </InlineIntent>
  )
}
