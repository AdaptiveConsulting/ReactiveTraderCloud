import styled, { css } from "styled-components"

import { Typography } from "@/client/components/Typography"
import { backgroundFlash, breathing } from "@/client/utils/styling"
import { Direction } from "@/generated/TradingGateway"

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
import { TableHeadCellContainer } from "./TableHeadCell"

export const QuoteDot = styled.div`
  height: 4px;
  width: 4px;
  border-radius: 4px;
  background-color: ${({ theme }) =>
    theme.color["Colors/Foreground/fg-brand-primary (600)"]};
  animation: ${breathing} 1s linear infinite;
`

const TableWrapper = styled.div`
  height: 100%;
  overflow: auto;
  contain: strict;
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-primary"]};
`

const Table = styled.table`
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-secondary_subtle"]};
  position: relative;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  .visually-hidden {
    display: none;
  }
`
const TableHead = styled.thead`
  z-index: 1;
  height: 20px;
`

const TableBody = styled.tbody`
  position: relative;
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-primary"]};
  z-index: 0;
`

const TableHeadRow = styled.tr`
  vertical-align: center;
  position: sticky;
  top: 0;
  z-index: 1;
`

const highlightBackgroundColor = css`
  animation: ${backgroundFlash} 1s ease-in-out 3;
`

const TableBodyRow = styled.tr<{
  pending?: boolean
  highlight?: boolean
  selected?: boolean
}>`
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-primary"]};
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) =>
      theme.color["Colors/Background/bg-active"]};
  }

  border-bottom: 1px solid
    ${({ theme }) => theme.color["Colors/Border/border-secondary"]};
  height: 28px;
  max-height: 24px;
  ${({ selected }) => {
    return (
      selected &&
      css`
        background-color: ${({ theme }) =>
          theme.color["Colors/Background/bg-active"]} !important;
      `
    )
  }}
  ${({ highlight }) => highlight && highlightBackgroundColor};
`

const TableBodyCell = styled.td<{
  align?: "right" | "left"
  crossed?: boolean
  direction?: Direction | undefined
}>`
  text-align: ${({ align = "left" }) => align};
  padding-right: ${({ align: numeric }) => (numeric ? "1.6rem;" : "0.1rem;")};
  position: relative;

  &:before {
    content: " ";
    display: ${({ crossed }) => (crossed ? "block" : "none")};
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
  }
`

const StatusIndicator = styled.td<{ status: SellSideQuoteState }>`
  width: 18px;
    padding-right: 4px;
  border-left: ${({ theme }) => theme.spacing.xs} solid
    ${({ status, theme }) => getSellSideStatusColor(status, theme)}};
  width: 18px;
`

const StatusIndicatorSpacer = styled.th<{ header?: boolean }>`
  top: 0;
  width: 18px;
  position: sticky;
  border-left: solid
    ${({ theme }) => theme.color["Colors/Background/bg-secondary_subtle"]}
    ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-secondary_subtle"]};
  z-index: 2;
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
                      align={
                        columnDefinition.align ??
                        (columnDefinition.filterType === "number"
                          ? "right"
                          : "left")
                      }
                    >
                      <Typography
                        variant="Text sm/Regular"
                        color={
                          field === "direction"
                            ? (row[field as ColKey] as Direction) ===
                              Direction.Buy
                              ? "Colors/Text/text-buy-primary"
                              : "Colors/Text/text-sell-primary"
                            : "Colors/Text/text-secondary (700)"
                        }
                      >
                        {columnDefinition.valueFormatter?.(value) ?? value}
                      </Typography>
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
              <td></td>
              <TableBodyCell colSpan={rfqColFields.length}>
                <Typography
                  variant="Text sm/Regular"
                  color="Colors/Text/text-primary (900)"
                >
                  No{" "}
                  {filter == SellSideQuotesTab.All
                    ? ""
                    : filter === SellSideQuotesTab.Closed
                      ? "closed "
                      : "live "}
                  RFQs in queue
                </Typography>
              </TableBodyCell>
              <td></td>
            </TableBodyRow>
          )}
        </TableBody>
      </Table>
    </TableWrapper>
  )
}
