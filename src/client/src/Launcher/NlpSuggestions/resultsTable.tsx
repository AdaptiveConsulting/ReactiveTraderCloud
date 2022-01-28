import { FC, ReactNode } from "react"
import { Table, TableRow, TableCell, TableHeader } from "./styles"

export interface Col {
  title: String
  id: String
  align?: "center" | "right"
  formatter?: (value: any) => void
  fixedWidth?: boolean
}
interface ResultsTableProps {
  cols: Col[]
  children: ReactNode
}

interface ResultsTableRowProps {
  row: any
  cols: Col[]
  status?: "rejected" | "done" | "pending" | undefined
}

interface LoadingRowProps {
  cols: Col[]
}

export const LoadingRow: FC<LoadingRowProps> = ({ cols }) => (
  <TableRow>
    <TableCell>Loading latest prices...</TableCell>
    {cols.map((_, index) => (
      <TableCell key={index}></TableCell>
    ))}
  </TableRow>
)

export const ResultsTableRow: FC<ResultsTableRowProps> = ({
  row,
  cols,
  status,
}) => (
  <TableRow status={status}>
    {cols.map((col: any, cellIndex: number) => {
      const value = row[col.id]
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

export const ResultsTable: FC<ResultsTableProps> = ({ cols, children }) => {
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
