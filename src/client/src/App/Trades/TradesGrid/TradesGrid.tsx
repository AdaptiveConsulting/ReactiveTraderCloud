import styled, { css } from "styled-components"

import { QuoteState } from "@/generated/TradingGateway"
import { CreditTrade, FxTrade, Trade, TradeStatus } from "@/services/trades"

import { useColDef, useColFields, useTrades$ } from "../Context"
import { useTableTrades } from "../TradesState"
import { TableHeadCellContainer } from "./TableHeadCell"

const TableWrapper = styled.div`
  height: calc(100% - 4.75rem);
  overflow-x: scroll;
  overflow-y: scroll;
  contain: content;
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

const TableBodyCell = styled.td<{
  align?: "right" | "left"
  crossed?: boolean
}>`
  text-align: ${({ align = "left" }) => align};
  padding-right: ${({ align: numeric }) => (numeric ? "1.6rem;" : "0.1rem;")};
  position: relative;
  &:before {
    content: " ";
    display: ${({ crossed }) => (crossed ? "block" : "none")};
    position: absolute;
    top: 50%;
    left: 0;
    border-bottom: 1px solid red;
    width: 100%;
  }
`
const StatusIndicator = styled.td<{ status?: TradeStatus | QuoteState }>`
  width: 18px;
  border-left: 6px solid
    ${({ status, theme: { accents } }) =>
      status === TradeStatus.Done || status === QuoteState.Accepted
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

export interface TradesGridInnerProps<Row extends Trade> {
  highlightedRow?: string | null
  onRowClick?: (row: Row) => void
  isRowCrossed?: (row: Row) => boolean
  caption: string
}

export const TradesGridInner = <Row extends Trade>({
  highlightedRow,
  onRowClick,
  isRowCrossed,
  caption,
}: TradesGridInnerProps<Row>) => {
  const rows$ = useTrades$()
  const colDef = useColDef()
  const fields = useColFields()
  const trades = useTableTrades(rows$, colDef)
  return (
    <TableWrapper>
      <Table>
        <caption id="trades-table-heading" className="visually-hidden">
          {caption}
        </caption>
        <TableHead>
          <TableHeadRow>
            <StatusIndicatorSpacer scope="col" aria-label="Trade Status" />
            {fields.map((field) => (
              <TableHeadCellContainer
                key={field as string}
                field={field as string}
              />
            ))}
          </TableHeadRow>
        </TableHead>
        <tbody role="grid">
          {trades.length ? (
            trades.map((row: FxTrade | CreditTrade) => (
              <TableBodyRow
                key={row.tradeId}
                highlight={row.tradeId === highlightedRow}
                onClick={() => onRowClick?.(row as unknown as Row)}
                data-testid={`trades-grid-row-${row.tradeId}`}
              >
                <StatusIndicator status={row.status} aria-label={row.status} />
                {fields.map((field) => {
                  const columnDefinition = colDef[field]
                  const value = row[field]
                  return (
                    <TableBodyCell
                      key={field as string}
                      align={
                        columnDefinition.align ??
                        (columnDefinition.filterType === "number"
                          ? "right"
                          : "left")
                      }
                      crossed={isRowCrossed?.(row as unknown as Row)}
                    >
                      {columnDefinition.valueFormatter?.(value) ?? value}
                    </TableBodyCell>
                  )
                })}
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
}
