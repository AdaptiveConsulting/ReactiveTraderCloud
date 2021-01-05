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

export type ColField = keyof Trade
export interface ColConfig {
  field: ColField
  valueFormatter?: (val: unknown) => string
  headerName: string
  numeric?: boolean
}

type CellConfig = Pick<ColConfig, "numeric">

const colConfigs: ColConfig[] = [
  {
    headerName: "Trade ID",
    field: "tradeId",
  },
  {
    headerName: "Status",
    field: "status",
    valueFormatter: capitalize,
  },
  {
    headerName: "Trade Date",
    field: "tradeDate",
    valueFormatter: (v) => formatDate(v as Date, DATE_FORMAT),
  },
  {
    headerName: "Direction",
    field: "direction",
  },
  {
    headerName: "CCYCCY",
    field: "symbol",
  },
  {
    headerName: "Deal CCY",
    field: "dealtCurrency",
  },
  {
    headerName: "Notional",
    field: "notional",
    valueFormatter: (v) => formatAsWholeNumber(v as number),
    numeric: true,
  },
  {
    headerName: "Rate",
    field: "spotRate",
    valueFormatter: (v) => formatTo6Digits(v as number),
    numeric: true,
  },
  {
    headerName: "Value Date",
    field: "valueDate",
    valueFormatter: (v) => formatDate(v as Date, DATE_FORMAT),
  },
  {
    headerName: "Trader",
    field: "traderName",
  },
]

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
`
const TableHead = styled.thead`
  font-size: 0.675rem;
  text-transform: uppercase;
`
const TableHeadRow = styled.tr`
  vertical-align: center;
  height: 2rem;
`
const TableBodyRow = styled.tr`
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.core.darkBackground};
  }
  &:hover {
    background-color: ${({ theme }) => theme.core.alternateBackground};
  }
  height: 2rem;
`
const TableHeadCell = styled.th<CellConfig>`
  text-align: ${(props) => (props.numeric ? "right" : "left")};
  font-weight: unset;
  padding-right: ${(props) => (props.numeric ? "1rem" : "0")};
  top: 0;
  position: sticky;
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-bottom: 0.25rem solid ${({ theme }) => theme.core.darkBackground};
  pointer: cursor;

  svg {
    height: 0.675rem;
    vertical-align: text-bottom;
  }

  span.spacer {
    min-width: 0.675rem;
    display: inline-block;
  }
`
const TableBodyCell = styled.td<CellConfig>`
  padding-right: ${(props) => (props.numeric ? "1rem" : ".1rem")};
  text-align: ${(props) => (props.numeric ? "right" : "left")};
`
const StatusIndicator = styled.td<{ status: TradeStatus }>`
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

const DATE_FORMAT = "dd-MMM-yyyy"

const formatTo6Digits = significantDigitsNumberFormatter(6)

export const TradesGrid: React.FC = () => {
  const trades = useTableTrades()
  const tableSort = useTableSort()
  return (
    <TableWrapper>
      <Table>
        <TableHead>
          <TableHeadRow>
            <StatusIndicatorSpacer />
            {colConfigs.map(({ field, headerName, numeric }) => (
              <TableHeadCell
                key={field}
                numeric={numeric}
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
        </TableHead>
        <tbody>
          {trades.map((trade) => (
            <TableBodyRow key={trade.tradeId}>
              <StatusIndicator status={trade.status} />
              {colConfigs.map(({ field, numeric, valueFormatter }) => (
                <TableBodyCell key={field} numeric={numeric}>
                  {valueFormatter?.(trade[field]) ?? trade[field]}
                </TableBodyCell>
              ))}
            </TableBodyRow>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  )
}
