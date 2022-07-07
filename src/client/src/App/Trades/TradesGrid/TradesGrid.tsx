import { broadcast } from "@finos/fdc3"
import styled, { css } from "styled-components"
import { Trade, TradeStatus } from "@/services/trades"
import {
  colConfigs,
  creditColFields,
  useTradeRowHighlight,
  useTableTrades,
  useTableCreditTrades,
  colFields,
  creditColConfigs,
  ColField,
  ColConfig,
  CreditColField,
} from "../TradesState"
import { TableHeadCellContainer } from "./TableHeadCell"
import { CreditContext } from "../Context"
import { AllTrades } from "@/services/trades/types"
import { useContext } from "react"

const TableWrapper = styled.div`
  height: calc(100% - 4.75rem);
  overflow-x: scroll;
  overflow-y: scroll;
`
const Table = styled.table`
  background-color: ${({ theme }) => theme.core.lightBackground};
  position: relative;
  width: 100%;
  min-width: 60rem;
  border-collapse: separate;
  border-spacing: 0;
  .visually-hidden {
    display: none;
  }
`
const TableHead = styled.thead`
  font-size: 0.675rem;
  text-transform: uppercase;
`
const TableHeadRow = styled.tr`
  vertical-align: center;
  height: 2rem;
`

const highlightBackgroundColor = css`
  animation: ${({ theme }) => theme.flash} 1s ease-in-out 3;
`

const TableBodyRow = styled.tr<{ pending?: boolean; highlight?: boolean }>`
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.core.darkBackground};
  }
  &:hover {
    background-color: ${({ theme }) => theme.core.alternateBackground};
  }
  height: 2rem;
  ${({ highlight }) => highlight && highlightBackgroundColor}
`

const TableBodyCell = styled.td<{ numeric?: boolean; rejected?: boolean }>`
  text-align: ${({ numeric }) => (numeric ? "right" : "left")};
  padding-right: ${({ numeric }) => (numeric ? "1.6rem;" : "0.1rem;")};
  position: relative;
  &:before {
    content: " ";
    display: ${({ rejected }) => (rejected ? "block;" : "none;")};
    position: absolute;
    top: 50%;
    left: 0;
    border-bottom: 1px solid red;
    width: 100%;
  }
`
const StatusIndicator = styled.td<{ status?: TradeStatus }>`
  width: 18px;
  border-left: 6px solid
    ${({ status, theme: { accents } }) =>
      status === TradeStatus.Done
        ? accents.positive.base
        : status === TradeStatus.Rejected
        ? accents.negative.base
        : "inherit"};
`

const StatusIndicatorSpacer = styled.th`
  width: 18px;
  top: 0;
  position: sticky;
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-bottom: 0.25rem solid ${({ theme }) => theme.core.darkBackground};
`

export interface TradesGridInnerProps<
  Field extends keyof any,
  Row extends Record<Field, any>,
> {
  rows: Row[]
  fields: Field[]
  colConfigs: Record<Field, ColConfig>
  highlightedRow?: string | null
  onRowClick: (symbol: string) => void
}

export const TradesGridInner = <
  Field extends keyof any,
  Row extends Record<Field, any>,
>({
  rows,
  highlightedRow,
  onRowClick,
  fields,
  colConfigs,
}: TradesGridInnerProps<Field, Row>) => (
  <TableWrapper>
    <Table>
      <caption id="trades-table-heading" className="visually-hidden">
        Reactive Trader FX Trades Table
      </caption>
      <TableHead>
        <TableHeadRow>
          <StatusIndicatorSpacer scope="col" aria-label="Trade Status" />
          {fields.map((field) => (
            <TableHeadCellContainer
              key={field}
              field={field}
              colConfigs={colConfigs}
            />
          ))}
        </TableHeadRow>
      </TableHead>
      <tbody role="grid">
        {rows.length ? (
          rows.map((row) => (
            <TableBodyRow
              key={row.tradeId}
              highlight={row.tradeId === highlightedRow}
              onClick={() => onRowClick((row as AllTrades).symbol)}
            >
              <StatusIndicator status={row.status} aria-label={row.status} />
              {fields.map((field, i) => (
                <TableBodyCell
                  key={field}
                  numeric={
                    colConfigs[field].filterType === "number" &&
                    field !== "tradeId"
                  }
                  rejected={row.status === "Rejected"}
                >
                  {colConfigs[field].valueFormatter?.(row[field]) ?? row[field]}
                </TableBodyCell>
              ))}
            </TableBodyRow>
          ))
        ) : (
          <TableBodyRow>
            <StatusIndicatorSpacer aria-hidden={true} />
            <TableBodyCell colSpan={fields.length}>
              No trades to show
            </TableBodyCell>
          </TableBodyRow>
        )}
      </tbody>
    </Table>
  </TableWrapper>
)

export const TradesGrid: React.FC = () => {
  const credit = useContext(CreditContext)
  const highlightedRow = useTradeRowHighlight()
  const tryBroadcastContext = (symbol: string) => {
    const context = {
      type: "fdc3.instrument",
      id: { ticker: symbol },
    }

    if (window.fdc3) {
      broadcast(context)
    } else if (window.fin) {
      // @ts-ignore
      fin.me.interop.setContext(context)
    }
  }

  return credit ? (
    <TradesCreditGrid
      onRowClick={tryBroadcastContext}
      highlightedRow={highlightedRow}
    />
  ) : (
    <TradesFXGrid
      onRowClick={tryBroadcastContext}
      highlightedRow={highlightedRow}
    />
  )
}

interface CommonGridsProps {
  onRowClick: (symbol: string) => void
  highlightedRow: string | null | undefined
}

export const TradesFXGrid: React.FC<CommonGridsProps> = (props) => {
  const trades = useTableTrades()
  return (
    <TradesGridInner
      trades={trades}
      fields={colFields}
      colConfigs={colConfigs}
      {...props}
    />
  )
}

export const TradesCreditGrid: React.FC<CommonGridsProps> = (props) => {
  const trades = useTableCreditTrades()
  return (
    <TradesGridInner
      trades={trades}
      fields={creditColFields}
      colConfigs={creditColConfigs}
      {...props}
    />
  )
}
