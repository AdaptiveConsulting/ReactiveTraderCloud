import {
  createContext,
  CSSProperties,
  forwardRef,
  PropsWithChildren,
  useContext,
} from "react"
import AutoSizer from "react-virtualized-auto-sizer"
import { FixedSizeList as List, FixedSizeListProps } from "react-window"
import styled, { css } from "styled-components"

import { QuoteState } from "@/generated/TradingGateway"
import { Trade, TradeStatus } from "@/services/trades"

import { useColDef, useColFields, useTrades$ } from "../Context"
import { useTableTrades } from "../TradesState"
import { useTableTradeWithIndex } from "../TradesState/tableTrades"
import { TableHeadCellContainer } from "./TableHeadCell"
import { convertRemToPixels, getWidthPercentage } from "./utils"

const Table = styled.div`
  border-bottom: 15px solid ${({ theme }) => theme.core.darkBackground};
  height: calc(100% - 4.75rem);
  width: 100%;
  .visually-hidden {
    display: none;
  }
`

const TableHeadRow = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  font-size: 0.675rem;
  text-transform: uppercase;
  z-index: 1;
  height: 2rem;
  background-color: ${({ theme }) => theme.core.lightBackground};
`

const highlightBackgroundColor = css`
  animation: ${({ theme }) => theme.flash} 1s ease-in-out 3;
`

const TableBodyRow = styled.div<{
  highlight?: boolean
  index?: number
}>`
  display: flex;
  min-width: 60rem;
  width: 100%;
  background-color: ${({ theme, index }) =>
    index && index % 2 === 0 ? undefined : theme.core.lightBackground};
  &:hover {
    background-color: ${({ theme }) => theme.core.alternateBackground};
  }
  ${({ highlight }) => highlight && highlightBackgroundColor}
`

const TableBodyCell = styled.div<{
  align?: "right" | "left"
  crossed?: boolean
  width: number
}>`
  display: flex;
  align-items: center;
  justify-content: ${({ align }) =>
    align === "right" ? "flex-end" : "flex-start"};
  width: ${({ width }) => width}%;
  padding-right: ${({ align: numeric }) => (numeric ? "1.5rem;" : null)};
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

const StatusIndicator = styled.div<{ status?: TradeStatus | QuoteState }>`
  width: 21px;
  border-left: 6px solid
    ${({ status, theme: { accents } }) =>
      status === TradeStatus.Done || status === QuoteState.Accepted
        ? accents.positive.base
        : status === TradeStatus.Rejected
        ? accents.negative.base
        : "inherit"};
`

const StatusIndicatorSpacer = styled.div`
  border-bottom: 0.25rem solid ${({ theme }) => theme.core.darkBackground};
  width: 21px;
`

const TableBackground = styled.div`
  min-width: 60rem;
`

const BlotterContext = createContext("Caption not loaded")

const InnerElementType = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{ style: CSSProperties }>
>(function ListInnerElement({ children, style }, ref) {
  const trades$ = useTrades$()
  const fields = useColFields()
  const colDef = useColDef()
  const rows = useTableTrades(trades$, colDef)
  const caption = useContext(BlotterContext)
  return (
    <>
      <p id="trades-table-heading" className="visually-hidden">
        {caption}
      </p>
      <TableBackground role="grid" ref={ref} style={style}>
        <TableHeadRow>
          <StatusIndicatorSpacer aria-label="Trade Status" />
          {fields.map((field) => (
            <TableHeadCellContainer
              key={field as string}
              field={field as string}
            />
          ))}
        </TableHeadRow>

        {rows.length ? (
          children
        ) : (
          <TableBodyRow>
            <StatusIndicatorSpacer aria-hidden={true} />
            <TableBodyCell width={100}>No trades to show</TableBodyCell>
          </TableBodyRow>
        )}
      </TableBackground>
    </>
  )
})

const OuterElementType = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{
    style: CSSProperties
  }>
>(function ListOuterElement({ children, ...rest }, ref) {
  return (
    <div ref={ref} {...rest} style={{ ...rest.style, overflow: "scroll" }}>
      {children}
    </div>
  )
})

type ItemData<Row extends Trade> = Omit<TradesGridInnerProps<Row>, "caption">

const Row = <Row extends Trade>({
  index,
  style,
  data,
}: {
  index: number
  style: CSSProperties
  data: ItemData<Row>
}) => {
  const rows$ = useTrades$()
  const colDef = useColDef()
  const fields = useColFields()
  const row = useTableTradeWithIndex(rows$, colDef, index - 1)
  const { highlightedRow, onRowClick, isRowCrossed } = data

  return (
    <TableBodyRow
      index={index}
      highlight={row.tradeId === highlightedRow}
      onClick={() => onRowClick?.(row as unknown as Row)}
      data-testid={`trades-grid-row-${row.tradeId}`}
      style={style}
    >
      <StatusIndicator status={row.status} aria-label={row.status} />
      {fields.map((field) => {
        const columnDefinition = colDef[field]
        const value = row[field]
        const widthPercentage = getWidthPercentage(
          Object.values(colDef).map((value) => value.width),
          columnDefinition.width,
        )
        return (
          <TableBodyCell
            width={widthPercentage}
            key={field as string}
            align={
              columnDefinition.align ??
              (columnDefinition.filterType === "number" ? "right" : "left")
            }
            crossed={isRowCrossed?.(row as unknown as Row)}
          >
            {columnDefinition.valueFormatter?.(value) ?? value}
          </TableBodyCell>
        )
      })}
    </TableBodyRow>
  )
}

interface ItemWrapperData<Row extends Trade> extends ItemData<Row> {
  ItemRenderer: React.ComponentType<{
    index: number
    style: CSSProperties
    data: ItemData<Row>
  }>
}

const ItemWrapper = <Row extends Trade>({
  data,
  index,
  style,
}: {
  index: number
  style: CSSProperties
  data: ItemWrapperData<Row>
}) => {
  const { ItemRenderer, ...rest } = data

  if (index === 0) return null

  return <ItemRenderer index={index} style={style} data={rest} />
}

const TableRows = <Row extends Trade>({
  children,
  itemData,
  ...rest
}: FixedSizeListProps<ItemData<Row>>) => {
  return (
    <List itemData={{ ...itemData, ItemRenderer: children }} {...rest}>
      {ItemWrapper}
    </List>
  )
}

export const TradesGridInner = <Row extends Trade>({
  highlightedRow,
  onRowClick,
  isRowCrossed,
  caption,
}: TradesGridInnerProps<Row>) => {
  const rows$ = useTrades$()
  const colDef = useColDef()
  const trades = useTableTrades(rows$, colDef)

  return (
    <BlotterContext.Provider value={caption}>
      <Table>
        <AutoSizer>
          {({ height, width }) => (
            <TableRows
              itemCount={trades.length + 1}
              itemSize={convertRemToPixels(2)}
              height={height}
              width={width}
              innerElementType={InnerElementType}
              outerElementType={OuterElementType}
              itemData={{
                highlightedRow,
                onRowClick,
                isRowCrossed,
              }}
            >
              {Row}
            </TableRows>
          )}
        </AutoSizer>
      </Table>
    </BlotterContext.Provider>
  )
}

export interface TradesGridInnerProps<Row extends Trade> {
  highlightedRow?: string | null
  onRowClick?: (row: Row) => void
  isRowCrossed?: (row: Row) => boolean
  caption: string
}
