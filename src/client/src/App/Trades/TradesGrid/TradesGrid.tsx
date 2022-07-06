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
  CreditColField,
} from "../TradesState"
import { TableHeadCellContainer } from "./TableHeadCell"
import { CreditContextConsumer } from "../Context"
import { AllTrades } from "@/services/trades/types"

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

export const TradesGridInner: React.FC<{
  trades: Trade[]
  highlightedRow?: string | null
  onRowClick: (symbol: string) => void
}> = ({ trades, highlightedRow, onRowClick }) => (
  <CreditContextConsumer>
    {(value) => {
      const correctColFields = (
        value ? creditColFields : colFields
      ) as ColField[] & CreditColField[]
      const correctColConfigs = (
        value ? creditColConfigs : colConfigs
      ) as typeof creditColConfigs & typeof colConfigs

      return (
        <TableWrapper>
          <Table>
            <caption id="trades-table-heading" className="visually-hidden">
              Reactive Trader FX Trades Table
            </caption>
            <TableHead>
              <TableHeadRow>
                <StatusIndicatorSpacer scope="col" aria-label="Trade Status" />
                {correctColFields.map((field) => (
                  <TableHeadCellContainer
                    key={field}
                    field={field}
                    colConfigs={correctColConfigs}
                  />
                ))}
              </TableHeadRow>
            </TableHead>
            <tbody role="grid">
              {trades.length ? (
                trades.map((trade) => (
                  <TableBodyRow
                    key={trade.tradeId}
                    highlight={trade.tradeId === highlightedRow}
                    onClick={() => onRowClick((trade as AllTrades).symbol)}
                  >
                    <StatusIndicator
                      status={trade.status}
                      aria-label={trade.status}
                    />
                    {correctColFields.map((field, i) => (
                      <TableBodyCell
                        key={field}
                        numeric={
                          correctColConfigs[field].filterType === "number" &&
                          field !== "tradeId"
                        }
                        rejected={trade.status === "Rejected"}
                      >
                        {correctColConfigs[field].valueFormatter?.(
                          trade[field],
                        ) ?? trade[field]}
                      </TableBodyCell>
                    ))}
                  </TableBodyRow>
                ))
              ) : (
                <TableBodyRow>
                  <StatusIndicatorSpacer aria-hidden={true} />
                  <TableBodyCell colSpan={correctColFields.length}>
                    No trades to show
                  </TableBodyCell>
                </TableBodyRow>
              )}
            </tbody>
          </Table>
        </TableWrapper>
      )
    }}
  </CreditContextConsumer>
)

interface Props {
  credit?: boolean
}

export const TradesGrid: React.FC<Props> = ({ credit }) => {
  const highlightedRow = useTradeRowHighlight()
  const trades = credit ? useTableCreditTrades() : useTableTrades()

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

  return (
    <TradesGridInner
      trades={trades}
      highlightedRow={highlightedRow}
      onRowClick={tryBroadcastContext}
    />
  )
}
