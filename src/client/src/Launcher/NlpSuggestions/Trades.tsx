import { TradesInfoIntent } from "../services/nlpService"
import { useTrades } from "@/services/trades"
import { formatNumber } from "@/utils"
import { format } from "date-fns"
import { ResultsTable, ResultsTableRow, Col } from "./resultsTable"

const colDefs: Col[] = [
  { title: "Trade ID", id: "tradeId" },
  { title: "Symbol", id: "symbol" },
  { title: "Notional", id: "notional" },
  { title: "Trade Date", id: "tradeDate" },
  { title: "Status", id: "status" },
]

export const Trades: React.FC<TradesInfoIntent["payload"]> = ({
  count,
  symbol,
  currency,
}) => {
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

  const rows = trades.map((trade) => ({
    ...trade,
    notional: formatNumber(trade.notional),
    tradeDate: format(trade.tradeDate, "dd-MM-yyyy"),
  }))

  return (
    <ResultsTable cols={colDefs}>
      {rows &&
        rows.map((row: any) => {
          return (
            <ResultsTableRow
              key={row.tradeId}
              row={row}
              cols={colDefs}
              status={row.status}
            />
          )
        })}
    </ResultsTable>
  )
}
