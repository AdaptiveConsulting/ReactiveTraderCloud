import styled from "styled-components/macro"
import { TradeStatus } from "services/trades"
import {
  useTableTrades,
  useTableSort,
  useDistinctFieldValues as useFilterOptions,
  useAppliedFilters,
  colFields,
  colConfigs,
} from "../TradesState"
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

const TableBodyCell = styled.td`
  padding-right: 0.1rem;
  text-align: left;
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

export const TradesGrid: React.FC = () => {
  const trades = useTableTrades()
  const tableSort = useTableSort()
  const filterOptions = useFilterOptions()
  const appliedFilters = useAppliedFilters()
  return (
    <TableWrapper>
      <Table>
        <TableHead>
          <TableHeadRow>
            <StatusIndicatorSpacer />
            {colFields.map((field) => (
              <TableHeadCellContainer
                {...colConfigs[field]}
                field={field}
                tableSort={tableSort}
                appliedFilters={appliedFilters}
                filterOptions={filterOptions}
              ></TableHeadCellContainer>
            ))}
          </TableHeadRow>
        </TableHead>
        <tbody>
          {trades.map((trade) => (
            <TableBodyRow key={trade.tradeId}>
              <StatusIndicator status={trade.status} />
              {colFields.map((field) => (
                <TableBodyCell key={field}>
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
