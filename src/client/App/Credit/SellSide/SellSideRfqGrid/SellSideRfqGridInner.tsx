import { colors } from "client/theme"
import { breathing } from "client/utils/styling"
import { Direction } from "generated/TradingGateway"
import styled, { css } from "styled-components"

import {
  selectRfqId,
  SellSideQuotesTab,
  SellSideQuoteState,
  useHighlightedRfqId,
  useSelectedRfqId,
  useSellSideQuotesFilter,
  useSellSideRfqs,
} from "../sellSideState"
import { getSellSideStatusColor } from "../utils"
import { ColKey, rfqColDef, rfqColFields } from "./colConfig"
import { RfqRow } from "./SellSideRfqGrid"
import { TableHeadCellContainer } from "./TableHeadCell"

export const QuoteDot = styled.div`
  height: 4px;
  width: 4px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.accents.primary.base};
  animation: ${breathing} 1s linear infinite;
`

const TableWrapper = styled.div`
  height: 100%;
  overflow-x: scroll;
  overflow-y: scroll;
  contain: content;
`
const Table = styled.table`
  background-color: ${({ theme }) => theme.core.lightBackground};
  position: relative;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  .visually-hidden {
    display: none;
  }
`
const TableHead = styled.thead`
  font-size: 10px;
  text-transform: uppercase;
  top: 0;
  position: sticky;
  z-index: 1;
`
const TableBody = styled.tbody`
  position: relative;
  z-index: 0;
`

const TableHeadRow = styled.tr`
  vertical-align: center;
  height: 2rem;
`

const highlightBackgroundColor = css`
  animation: ${({ theme }) => theme.flash} 1s ease-in-out 3;
`

const TableBodyRow = styled.tr<{
  pending?: boolean
  highlight?: boolean
  selected?: boolean
}>`
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.core.darkBackground};
  }
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.core.alternateBackground};
  }
  height: 24px;
  max-height: 24px;
  ${({ selected }) => {
    return (
      selected &&
      css`
        background-color: ${({ theme }) => theme.primary[3]} !important;
      `
    )
  }}
  ${({ highlight }) => highlight && highlightBackgroundColor}
`

const TableBodyCell = styled.td<{
  align?: "right" | "left"
  crossed?: boolean
  direction?: Direction | undefined
}>`
  font-size: 11px;
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

const StatusIndicator = styled.td<{ status: SellSideQuoteState }>`
  width: 18px;
  padding-right: 4px;
  border-left: 6px solid
    ${({ status, theme }) => getSellSideStatusColor(status, theme)}};
`

const StatusIndicatorSpacer = styled.th<{ header?: boolean }>`
  width: 18px;
  top: 0;
  position: sticky;
  background-color: ${({ theme, header }) =>
    header ? theme.core.darkBackground : theme.core.lightBackground};
  border-bottom: 0.25rem solid
    ${({ theme, header }) =>
      header ? theme.core.lightBackground : theme.core.darkBackground};
`

export interface RfqGridInner {
  caption: string
}

export const GridQuoteDotWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 8px;
  height: 8px;
  margin: 0 4px;
`

export const RfqGridInner = ({ caption }: RfqGridInner) => {
  const rfqs = useSellSideRfqs()
  const highlightId = useHighlightedRfqId()
  const filter = useSellSideQuotesFilter()
  const selectedId = useSelectedRfqId()

  return (
    <TableWrapper>
      <Table>
        <caption id="rfq-quote-table-heading" className="visually-hidden">
          {caption}
        </caption>
        <TableHead>
          <TableHeadRow>
            <StatusIndicatorSpacer scope="col" aria-label="RFQ Status" header />
            {rfqColFields.map((field) => (
              <TableHeadCellContainer
                key={field as ColKey}
                field={field as ColKey}
              />
            ))}
            <StatusIndicatorSpacer
              scope="col"
              aria-label="Awaiting sell-side price"
              header
            />
          </TableHeadRow>
        </TableHead>
        <TableBody role="grid">
          {rfqs.length ? (
            rfqs.map((row) => (
              <TableBodyRow
                selected={row.id === selectedId}
                highlight={row.id === highlightId}
                key={row.id}
                onClick={() => {
                  selectRfqId(row.id !== selectedId ? row.id : null)
                }}
              >
                <StatusIndicator status={row.status} aria-label={row.status} />
                {rfqColFields.map((field) => {
                  const columnDefinition = rfqColDef[field as ColKey]
                  const value = row[field as ColKey]
                  return (
                    <TableBodyCell
                      key={field as string}
                      style={{
                        color:
                          field === "direction"
                            ? (row[field as ColKey] as Direction) ===
                              Direction.Buy
                              ? colors.spectrum.uniqueCollections.Buy.base
                              : colors.spectrum.uniqueCollections.Sell.base
                            : "inherit",
                      }}
                      align={
                        columnDefinition.align ??
                        (columnDefinition.filterType === "number"
                          ? "right"
                          : "left")
                      }
                    >
                      {columnDefinition.valueFormatter?.(value) ?? value}
                    </TableBodyCell>
                  )
                })}
                <td>
                  <GridQuoteDotWrapper>
                    {SellSideQuoteState.New === row.status && <QuoteDot />}
                  </GridQuoteDotWrapper>
                </td>
              </TableBodyRow>
            ))
          ) : (
            <TableBodyRow>
              <StatusIndicatorSpacer aria-hidden={true} />
              <TableBodyCell colSpan={rfqColFields.length}>
                No{" "}
                {filter == SellSideQuotesTab.All
                  ? ""
                  : filter === SellSideQuotesTab.Closed
                  ? "closed "
                  : "live "}
                RFQs in queue
              </TableBodyCell>
            </TableBodyRow>
          )}
        </TableBody>
      </Table>
    </TableWrapper>
  )
}
