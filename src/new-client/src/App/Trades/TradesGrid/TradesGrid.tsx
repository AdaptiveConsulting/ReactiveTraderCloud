import { broadcast } from "@finos/fdc3"
import {
  colConfigs,
  colFields,
  useTradeRowHighlight,
  useTableTrades,
} from "../TradesState"
import { TableHeadCellContainer } from "./TableHeadCell"
import { Virtuoso } from "react-virtuoso"
import { useRef } from "react"
import { Trade } from "@/services/trades"

import {
  VirtuosoTableWrapper,
  Table,
  TableWrapper,
  TableHead,
  TableHeadRow,
  TableBodyRow,
  TableBodyCell,
  StatusIndicator,
  StatusIndicatorSpacer,
  VirtuosoTable,
  Spacer,
  SpacerHeader,
} from "./TradesGrid.styles"
interface TradeGridProps {
  trade: Trade
  highlightedRow?: string | null
}

export const TradeGridRow: React.FC<TradeGridProps> = ({
  trade,
  highlightedRow,
}) => {
  const tryBroadcastContext = (symbol: string) => {
    if (window.fdc3) {
      broadcast({
        type: "fdc3.instrument",
        id: { ticker: symbol },
      })
    }
  }

  return (
    <TableBodyRow
      key={trade.tradeId}
      highlight={trade.tradeId === highlightedRow}
      onClick={() => tryBroadcastContext(trade.symbol)}
    >
      <StatusIndicator status={trade.status} aria-label={trade.status} />
      <Spacer aria-hidden={true} />
      {colFields.map((field, i) => (
        <TableBodyCell
          key={field}
          numeric={
            colConfigs[field].filterType === "number" && field !== "tradeId"
          }
          rejected={trade.status === "Rejected"}
          relativeWidth={colConfigs[field].width}
        >
          {colConfigs[field].valueFormatter?.(trade[field]) ?? trade[field]}
        </TableBodyCell>
      ))}
    </TableBodyRow>
  )
}

export const TradesGrid: React.FC<any> = ({ height = 200, width = 200 }) => {
  const trades = useTableTrades()
  const highlightedRow = useTradeRowHighlight()
  const ref = useRef(null)

  return (
    <VirtuosoTableWrapper>
      {height}
      <VirtuosoTable role="grid">
        <TableWrapper relativeWidth={width}>
          <Table>
            <caption id="trades-table-heading" className="visually-hidden">
              Reactive Trader FX Trades Table
            </caption>
            <TableHead>
              <TableHeadRow>
                <StatusIndicatorSpacer scope="col" aria-label="Trade Status" />
                <SpacerHeader aria-hidden={true} />
                {colFields.map((field) => (
                  <TableHeadCellContainer key={field} field={field} />
                ))}
              </TableHeadRow>
            </TableHead>
          </Table>
          {trades.length !== 0 && (
            <Virtuoso
              style={{
                /*We substract 120px since the height we get it's from the entire trades component
                  In order to get the exact height for only the rows, we have the 120 that comes
                  from the values of the footer+header+margins
                */
                height: height - 120 + "px",
                overflow: "hidden overlay",
              }}
              totalCount={trades.length}
              itemContent={(index) => (
                <Table>
                  <tbody>
                    <TradeGridRow
                      trade={trades[index]}
                      highlightedRow={highlightedRow}
                    />
                  </tbody>
                </Table>
              )}
            />
          )}
          {trades.length === 0 && (
            <Table>
              <tbody role="grid">
                <TableBodyRow>
                  <StatusIndicator aria-hidden={true} />
                  <TableBodyCell colSpan={colFields.length} relativeWidth={50}>
                    No trades to show
                  </TableBodyCell>
                </TableBodyRow>
              </tbody>
            </Table>
          )}
        </TableWrapper>
      </VirtuosoTable>
    </VirtuosoTableWrapper>
  )
}
