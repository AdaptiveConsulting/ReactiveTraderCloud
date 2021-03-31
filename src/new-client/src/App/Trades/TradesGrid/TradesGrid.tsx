import styled, { css } from "styled-components"
import { TradeStatus } from "@/services/trades"
import { colConfigs, colFields, useTableTrades } from "../TradesState"
import { TableHeadCellContainer } from "./TableHeadCell"

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

const pendingBackgroundColor = css`
  background-color: ${({ theme }) => theme.core.alternateBackground};
`

const TableBodyRow = styled.tr<{ pending?: boolean }>`
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.core.darkBackground};
  }
  &:hover {
    background-color: ${({ theme }) => theme.core.alternateBackground};
  }
  height: 2rem;
  ${({ pending }) => pending && pendingBackgroundColor}
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

export const TradesGrid: React.FC = () => {
  const trades = useTableTrades()

  return (
    <TableWrapper>
      <Table>
        <caption id="trades-table-heading" className="visually-hidden">
          Reactive Trader FX Trades Table
        </caption>
        <TableHead>
          <TableHeadRow>
            <StatusIndicatorSpacer scope="col" aria-label="Trade Status" />
            {colFields.map((field) => (
              <TableHeadCellContainer key={field} field={field} />
            ))}
          </TableHeadRow>
        </TableHead>
        <tbody role="grid">
          {trades.length ? (
            trades.map((trade) => (
              <TableBodyRow
                key={trade.tradeId}
                pending={trade.status === TradeStatus.Pending}
              >
                <StatusIndicator
                  status={trade.status}
                  aria-label={trade.status}
                />
                {colFields.map((field, i) => (
                  <TableBodyCell
                    key={field}
                    numeric={
                      colConfigs[field].filterType === "number" &&
                      field !== "tradeId"
                    }
                    rejected={trade.status === "Rejected"}
                  >
                    {colConfigs[field].valueFormatter?.(trade[field]) ??
                      trade[field]}
                  </TableBodyCell>
                ))}
              </TableBodyRow>
            ))
          ) : (
            <TableBodyRow>
              <StatusIndicatorSpacer aria-hidden={true} />
              <TableBodyCell colSpan={colFields.length}>
                No trades to show
              </TableBodyCell>
            </TableBodyRow>
          )}
        </tbody>
      </Table>
    </TableWrapper>
  )
}
