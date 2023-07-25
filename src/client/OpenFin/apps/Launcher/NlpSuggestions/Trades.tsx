import { format } from "date-fns"

import { formatNumber } from "@/client/utils"
import { useTrades } from "@/services/trades"

import { TradesInfoIntent } from "../services/nlpService"
import {
  Col,
  ResultsTable,
  ResultsTableRow,
  ResultsTableRowType,
} from "./resultsTable"

const colDefs: Col[] = [
  { title: "Trade ID", id: "tradeId" },
  { title: "Symbol", id: "symbol" },
  { title: "Notional", id: "notional" },
  { title: "Trade Date", id: "tradeDate" },
  { title: "Status", id: "status" },
]

export const Trades = ({
  count,
  symbol,
  currency,
}: TradesInfoIntent["payload"]) => {
  const trades = useTrades()
    .filter(
      (trade) =>
        (!symbol || trade.symbol === symbol) &&
        (!currency || trade.dealtCurrency === currency),
    )
    .slice(0, count && Math.max(0, count))

  if (trades.length === 0) {
    return <>No last trades</>
  }

  const rows: ResultsTableRowType[] = trades.map((trade) => ({
    ...trade,
    notional: formatNumber(trade.notional),
    tradeDate: format(trade.tradeDate, "dd-MM-yyyy"),
  }))

  return (
    <ResultsTable cols={colDefs}>
      {rows &&
        rows.map((row: ResultsTableRowType) => (
          <ResultsTableRow
            key={row.tradeId as string}
            row={row}
            cols={colDefs}
          />
        ))}
    </ResultsTable>
  )
}
