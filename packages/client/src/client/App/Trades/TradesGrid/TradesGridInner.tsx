import {
  createContext,
  CSSProperties,
  forwardRef,
  PropsWithChildren,
  useContext,
} from "react"
import AutoSizer from "react-virtualized-auto-sizer"
import { FixedSizeList as List, FixedSizeListProps } from "react-window"

import { Trade } from "@/services/trades"

import {
  useColDef,
  useColFields,
  useHighlightedRow,
  useTrades$,
} from "../Context"
import { useTableTrades } from "../TradesState"
import { useTableTradeWithIndex } from "../TradesState/tableTrades"
import {
  StatusIndicator,
  StatusIndicatorSpacer,
  Table,
  TableBodyCell,
  TableBodyRow,
  TableBodyStrikeThrough,
  TableHeadRow,
} from "./styled"
import { TableHeadCellContainer } from "./TableHeadCell"
import { convertRemToPixels, getWidthPercentage } from "./utils"

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
      <div
        role="grid"
        ref={ref}
        style={{
          ...style,
          minWidth: `${fields.length * 6}rem`,
        }}
      >
        <TableHeadRow>
          <StatusIndicatorSpacer aria-label="Trade Status" />
          {fields.map((field, index) => (
            <TableHeadCellContainer
              key={field as string}
              field={field as string}
              isLast={index === fields.length - 1}
            />
          ))}
        </TableHeadRow>

        {rows.length ? (
          children
        ) : (
          <TableBodyRow style={{ height: "2rem" }}>
            <StatusIndicatorSpacer aria-hidden={true} />
            <TableBodyCell width={100}>No trades to show</TableBodyCell>
          </TableBodyRow>
        )}
      </div>
    </>
  )
})

const OuterElementType = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{
    style: CSSProperties
  }>
>(function ListOuterElement({ children, style, ...rest }, ref) {
  return (
    <div
      ref={ref}
      {...rest}
      style={{
        ...style,
        overflowX: "scroll",
      }}
    >
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
  const highlightedRow = useHighlightedRow()
  const { onRowClick, isRejected } = data

  return (
    <TableBodyRow
      index={index}
      highlight={row.tradeId === highlightedRow}
      onClick={() => onRowClick?.(row as unknown as Row)}
      data-testid={`trades-grid-row-${row.tradeId}`}
      style={{ ...style, minWidth: `${fields.length * 6}rem` }}
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
          >
            {columnDefinition.valueFormatter?.(value) ?? (value as string)}
          </TableBodyCell>
        )
      })}
      <TableBodyStrikeThrough
        isRejected={isRejected?.(row as unknown as Row)}
      />
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
                                      }: FixedSizeListProps<ItemData<Row>>) => (
  <List itemData={{ ...itemData, ItemRenderer: children }} {...rest}>
    {ItemWrapper}
  </List>
)

export const TradesGridInner = <Row extends Trade>({
                                                     onRowClick,
                                                     isRejected,
                                                     caption,
                                                   }: TradesGridInnerProps<Row>) => {
  const rows$ = useTrades$()
  const colDef = useColDef()
  const fields = useColFields()
  const trades = useTableTrades(rows$, colDef)
  return (
    <BlotterContext.Provider value={caption}>
      <Table>
        <AutoSizer>
          {({ height, width }) => (
            <TableRows
              itemCount={trades.length + 1}
              itemSize={convertRemToPixels(2)}
              height={height ? height : 100}
              width={width ? width : 100}
              innerElementType={InnerElementType}
              outerElementType={OuterElementType}
              itemData={{
                onRowClick,
                isRejected,
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
  onRowClick?: (row: Row) => void
  isRejected?: (row: Row) => boolean
  caption: string
}