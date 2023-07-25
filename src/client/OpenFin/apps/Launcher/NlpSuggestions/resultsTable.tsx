import { TradeStatus } from "generated/TradingGateway"
import { ReactNode } from "react"
import { FxTrade } from "services/trades"

import { Table, TableCell, TableHeader, TableRow } from "./styles"

export interface Col {
  title: string
  id: string
  align?: "center" | "right"
  formatter?: (value: number) => ReactNode
  fixedWidth?: boolean
}
interface ResultsTableProps {
  cols: Col[]
  children: ReactNode
}

export interface ResultsTableRowType extends Omit<FxTrade, "tradeDate"> {
  notional?: string
  tradeDate?: string
}

interface ResultsTableRowProps {
  row: ResultsTableRowType
  cols: Col[]
}

interface LoadingRowProps {
  cols: Col[]
}

export const LoadingRow = ({ cols }: LoadingRowProps) => (
  <TableRow>
    <TableCell>Loading latest prices...</TableCell>
    {cols.map((_, index) => (
      <TableCell key={index}></TableCell>
    ))}
  </TableRow>
)

export const ResultsTableRow = ({ row, cols }: ResultsTableRowProps) => (
  <TableRow status={row.status as TradeStatus}>
    {cols.map((col: Col, cellIndex: number) => {
      const value = row[col.id] as number
      const formattedValue = col.formatter ? col.formatter(value) : value
      return (
        <TableCell
          align={col.align}
          key={cellIndex}
          fixedWidth={col.fixedWidth}
        >
          {formattedValue}
        </TableCell>
      )
    })}
  </TableRow>
)

export const ResultsTable = ({ cols, children }: ResultsTableProps) => {
  return (
    <Table>
      <thead>
        <tr>
          {cols.map(({ title, align }, index) => (
            <TableHeader align={align} key={index}>
              {title}
            </TableHeader>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </Table>
  )
}

const highlightPip = (value: number, bidAsk: "bid" | "ask") => {
  const array = String(value).split("")
  return array.map((char: string, index: number) => {
    const style =
      index === array.length - 2 || index === array.length - 1
        ? {
            color: bidAsk === "ask" ? "#ff274b" : "#2d95ff",
            fontSize: "1rem",
          }
        : {}
    return (
      <span style={style} key={`${char}-${index}`}>
        {char}
      </span>
    )
  })
}

export const defaultColDefs: Col[] = [
  { title: "Symbol", id: "symbol" },
  {
    title: "Ask",
    id: "ask",
    align: "right",
    formatter: (value) => highlightPip(value, "ask"),
    fixedWidth: true,
  },
  { title: "Mid", id: "mid", align: "right", fixedWidth: true },
  {
    title: "Bid",
    id: "bid",
    align: "right",
    formatter: (value) => highlightPip(value, "bid"),
    fixedWidth: true,
  },
  { title: "Movement", id: "priceMovementType", align: "center" },
  { title: "Date/Time", id: "valueDate" },
  { title: "", id: "openTileBtn", align: "center", fixedWidth: true },
]
