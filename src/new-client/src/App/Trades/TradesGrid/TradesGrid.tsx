import styled from "styled-components/macro"
import { Trade, TradeStatus, useTrades } from "services/trades"
import {
  significantDigitsNumberFormatter,
  formatAsWholeNumber,
} from "utils/formatNumber"
import { capitalize } from "utils/capitalize"
import { format as formatDate } from "date-fns"

type ColField =
  | "tradeId"
  | "status"
  | "tradeDate"
  | "direction"
  | "symbol"
  | "dealtCurrency"
  | "notional"
  | "spotRate"
  | "valueDate"
  | "traderName"

interface ColConfig {
  field: ColField
  valueFormatter?: (val: unknown) => string
  width: number
  headerName: string
  numeric?: boolean
}

type CellConfig = Pick<ColConfig, "width" | "numeric">

const colConfigs: ColConfig[] = [
  {
    headerName: "Trade ID",
    field: "tradeId",
    width: 100,
  },
  {
    headerName: "Status",
    field: "status",
    width: 110,
    valueFormatter: capitalize,
  },
  {
    headerName: "Trade Date",
    field: "tradeDate",
    width: 130,
    valueFormatter: (v) => formatDate(v as Date, DATE_FORMAT),
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
    width: 110,
    valueFormatter: (v) => formatAsWholeNumber(v as number),
    numeric: true,
  },
  {
    headerName: "Rate",
    field: "spotRate",
    width: 120,
    valueFormatter: (v) => formatTo6Digits(v as number),
    numeric: true,
  },
  {
    headerName: "Value Date",
    field: "valueDate",
    width: 120,
    valueFormatter: (v) => formatDate(v as Date, DATE_FORMAT),
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
  const trades = useTrades()
  return (
    <TableWrapper>
      <Table>
        <TableHead>
          <TableHeadRow>
            <StatusIndicatorSpacer />
            {colConfigs.map(({ field, headerName, width, numeric }) => (
              <TableHeadCell key={field} width={width} numeric={numeric}>
                {headerName}
              </TableHeadCell>
            ))}
          </TableHeadRow>
        </TableHead>
        <tbody>
          {trades.map((trade) => (
            <TableBodyRow key={trade.tradeId}>
              <StatusIndicator status={trade.status} />
              {colConfigs.map(({ field, width, numeric, valueFormatter }) => {
                const value = trade[field as keyof Trade]
                return (
                  <TableBodyCell key={field} width={width} numeric={numeric}>
                    {valueFormatter?.(value) ?? value}
                  </TableBodyCell>
                )
              })}
            </TableBodyRow>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  )
}
