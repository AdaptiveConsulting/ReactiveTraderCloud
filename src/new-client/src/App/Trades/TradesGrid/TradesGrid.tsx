import React, { useEffect, useState } from "react"
import styled from "styled-components/macro"
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa"
import { Trade, TradeStatus } from "services/trades"
import {
  significantDigitsNumberFormatter,
  formatAsWholeNumber,
} from "utils/formatNumber"
import { capitalize } from "utils/capitalize"
import { format as formatDate } from "date-fns"
import { useTableTrades, sortFieldSelections$, useTableSort } from "../services"
import { FixedSizeList as VirtualizedTable } from "react-window"
import { useSelectedHeight } from "components/Resizer"

export type ColField = keyof Trade
export interface ColConfig {
  field: ColField
  valueFormatter?: (val: unknown) => string
  headerName: string
  numeric?: boolean
  width: number
}

type CellConfig = Pick<ColConfig, "numeric" | "width">

export const colConfigs: ColConfig[] = [
  {
    headerName: "Trade ID",
    field: "tradeId",
    width: 100,
  },
  {
    headerName: "Status",
    field: "status",
    valueFormatter: capitalize,
    width: 110,
  },
  {
    headerName: "Trade Date",
    field: "tradeDate",
    valueFormatter: (v) => formatDate(v as Date, DATE_FORMAT),
    width: 130,
  },
  {
    headerName: "Direction",
    field: "direction",
    width: 110,
  },
  {
    headerName: "CCYCCY",
    field: "symbol",
    width: 110,
  },
  {
    headerName: "Deal CCY",
    field: "dealtCurrency",
    width: 90,
  },
  {
    headerName: "Notional",
    field: "notional",
    valueFormatter: (v) => formatAsWholeNumber(v as number),
    numeric: true,
    width: 110,
  },
  {
    headerName: "Rate",
    field: "spotRate",
    valueFormatter: (v) => formatTo6Digits(v as number),
    numeric: true,
    width: 100,
  },
  {
    headerName: "Value Date",
    field: "valueDate",
    valueFormatter: (v) => formatDate(v as Date, DATE_FORMAT),
    width: 120,
  },
  {
    headerName: "Trader",
    field: "traderName",
    width: 110,
  },
]

const TableWrapper = styled.div`
  height: calc(100% - 4.75rem);
  overflow-x: scroll;
  overflow-y: hidden;
`

const Table = styled.div`
  background-color: ${({ theme }) => theme.core.lightBackground};
  position: relative;
  width: 100%;
  min-width: 60rem;
  border-collapse: separate;
  border-spacing: 0;
`

const TableHeadRow = styled.div`
  vertical-align: center;
  height: 2rem;
  font-size: 0.675rem;
  text-transform: uppercase;
  width: 100%;
  border-bottom: 0.25rem solid ${({ theme }) => theme.core.darkBackground};
`

const TableBodyRow = styled.div`
  width: 100%;
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.core.darkBackground};
  }
  &:hover {
    background-color: ${({ theme }) => theme.core.alternateBackground};
  }
`
const TableHeadCell = styled.div<CellConfig>`
  text-align: ${(props) => (props.numeric ? "right" : "left")};
  font-weight: unset;
  padding-right: ${(props) => (props.numeric ? "1rem" : "0")};
  top: 0;
  position: sticky;
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-bottom: 0.25rem solid ${({ theme }) => theme.core.darkBackground};
  pointer: cursor;
  width: ${(props) => props.width + "px"};
  display: inline-block;
  box-sizing: border-box;
  height: 2rem;
  text-align: left;
  line-height: 30px;
  svg {
    height: 0.675rem;
    vertical-align: text-bottom;
  }

  span.spacer {
    min-width: 0.675rem;
    display: inline-block;
  }
`
const TableBodyCell = styled.div<CellConfig>`
  padding-right: ${(props) => (props.numeric ? "1rem" : ".1rem")};
  text-align: ${(props) => (props.numeric ? "right" : "left")};
  height: 30px;
  display: inline-block;
  box-sizing: border-box;
  width: ${(props) => props.width + "px"};
  line-height: 30px;
`
const StatusIndicator = styled.div<{ status: TradeStatus }>`
  width: 18px;
  height: 30px;
  display: inline-block;
  box-sizing: border-box;
  line-height: 30px;
  color: transparent;
  text-align: left;
  border-left: 6px solid
    ${({ status, theme: { accents } }) =>
      status === TradeStatus.Done
        ? accents.positive.base
        : status === TradeStatus.Rejected
        ? accents.negative.base
        : "inherit"};
`
const StatusIndicatorSpacer = styled.div`
  width: 18px;
  top: 0;
  position: sticky;
  height: 32px;
  display: inline-block;
  box-sizing: border-box;
  line-height: 30px;
  color: transparent;
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-bottom: 0.25rem solid ${({ theme }) => theme.core.darkBackground};
`

const DATE_FORMAT = "dd-MMM-yyyy"

const formatTo6Digits = significantDigitsNumberFormatter(6)

interface RowParam {
  data: Trade[]
  index: number
  style: React.CSSProperties
}

const VirtualizedTableRow = ({ data, index, style }: RowParam) => (
  <TableBodyRow key={data[index].tradeId} style={style}>
    <StatusIndicator status={data[index].status}>
      0
      <span className="spacer" />
    </StatusIndicator>
    {colConfigs.map(({ field, numeric, valueFormatter, width }) => (
      <TableBodyCell key={field} numeric={numeric} width={width}>
        {valueFormatter?.(data[index][field]) ?? data[index][field]}
      </TableBodyCell>
    ))}
  </TableBodyRow>
)

const convertRemToPixels = (rem: number) => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}

export const TradesGrid: React.FC = () => {
  const trades = useTableTrades()
  const tableSort = useTableSort()
  const [tableHeight, setTableHeight] = useState(55)
  const containerPercent = useSelectedHeight()

  useEffect(() => {
    const { innerHeight: height } = window
    const containerHeight =
      containerPercent * 0.01 * (height - convertRemToPixels(3.5 + 2))
    setTableHeight(containerHeight - convertRemToPixels(2 + 5 + 2))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerPercent])
  return (
    <TableWrapper>
      <Table>
        <TableHeadRow>
          <StatusIndicatorSpacer>0</StatusIndicatorSpacer>
          {colConfigs.map(({ field, headerName, numeric, width }) => (
            <TableHeadCell
              key={field}
              numeric={numeric}
              width={width}
              onClick={() => sortFieldSelections$.next(field)}
            >
              {headerName}
              {tableSort.field === field ? (
                tableSort.direction === "ASC" ? (
                  <FaLongArrowAltUp />
                ) : (
                  <FaLongArrowAltDown />
                )
              ) : (
                <span className="spacer" />
              )}
            </TableHeadCell>
          ))}
        </TableHeadRow>
        <VirtualizedTable
          className="List"
          height={tableHeight}
          itemCount={trades.length}
          itemSize={30}
          width={"100%"}
          itemData={trades}
        >
          {VirtualizedTableRow}
        </VirtualizedTable>
      </Table>
    </TableWrapper>
  )
}
