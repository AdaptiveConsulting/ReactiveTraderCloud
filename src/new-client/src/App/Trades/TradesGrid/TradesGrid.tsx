import styled from "styled-components"
import { TradeStatus } from "@/services/trades"
import { useTableTrades, colFields, colConfigs } from "../TradesState"
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

const TableBodyCell = styled.td<{ numeric: boolean, rejected: boolean }>`
  text-align: ${({ numeric }) => (numeric ? "right" : "left")};
  padding-right: ${({ numeric }) => (numeric ? "1.6rem;" : "0.1rem;")};
  position: relative;
  &:before {
    content: " ";
    display: ${({ rejected }) => (rejected ? "display;" : "none;")};
    position: absolute;
    top: 50%;
    left: 0;
    border-bottom: 1px solid red;
    width: 100%;
  }
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
  z-index: 1;
`

export const TradesGrid: React.FC = () => {
  const trades = useTableTrades()

  return (
    <TableWrapper>
      <Table>
        <TableHead>
          <TableHeadRow>
            <StatusIndicatorSpacer />
            {colFields.map((field) => (
              <TableHeadCellContainer key={field} field={field}></TableHeadCellContainer>
            ))}
          </TableHeadRow>
        </TableHead>
        <tbody>
          {trades.map((trade) => (
            <TableBodyRow key={trade.tradeId}>
              <StatusIndicator status={trade.status} />
              {colFields.map((field) => (
                <TableBodyCell
                  key={field}
                  numeric={
                    colConfigs[field].filterType === "number" &&
                    field !== "tradeId"
                  }
                  rejected={trade.status === 'Rejected'}
                >
                  {colConfigs[field].valueFormatter?.(trade[field]) ??
                    trade[field]}
                </TableBodyCell>
              ))}
            </TableBodyRow>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  )
}
