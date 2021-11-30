import { broadcast } from "@finos/fdc3"
import styled, { css } from "styled-components"
import { TradeStatus } from "@/services/trades"

export const VirtuosoTableWrapper = styled.div`
  overflow-y: hidden;
  overflow-x: scroll;
`
export const Table = styled.table`
  border-spacing: 0;
`

export const TableWrapper = styled.div<{ relativeWidth?: number }>`
  background-color: ${({ theme }) => theme.core.lightBackground};
  position: relative;
  width: ${({ relativeWidth }) => `${relativeWidth}px`};
  min-width: 60rem;
  border-collapse: separate;
  border-spacing: 0;

  .visually-hidden {
    display: none;
  }
`
export const TableHead = styled.thead`
  font-size: 0.675rem;
  text-transform: uppercase;
`
export const TableHeadRow = styled.tr`
  vertical-align: center;
  height: 2rem;
`

const highlightBackgroundColor = css`
  animation: ${({ theme }) => theme.flash} 1s ease-in-out 3;
`

export const TableBodyRow = styled.tr<{
  pending?: boolean
  highlight?: boolean
}>`
  height: 2rem;
  ${({ highlight }) => highlight && highlightBackgroundColor}
`

export const TableBodyCell = styled.td<{
  numeric?: boolean
  rejected?: boolean
  relativeWidth: number
}>`
  text-align: ${({ numeric }) => (numeric ? "right" : "left")};
  padding-right: ${({ numeric }) => (numeric ? "1.6rem;" : "0.1rem;")};
  position: relative;
  width: ${({ relativeWidth }) => `${relativeWidth}vw`};
  vertical-align: middle;
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
export const StatusIndicator = styled.td<{ status?: TradeStatus }>`
  width: 18px;
  border-left: 6px solid
    ${({ status, theme: { accents } }) =>
      status === TradeStatus.Done
        ? accents.positive.base
        : status === TradeStatus.Rejected
        ? accents.negative.base
        : "inherit"};
`
export const StatusIndicatorSpacer = styled.th`
  width: 18px;
  top: 0;
  position: sticky;
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-bottom: 0.25rem solid ${({ theme }) => theme.core.darkBackground};
`

export const VirtuosoTable = styled.div`
  [data-test-id] > div {
    &:nth-child(even) {
      background-color: ${({ theme }) => theme.core.darkBackground};
    }
    &:hover {
      background-color: ${({ theme }) => theme.core.alternateBackground};
    }
    height: 2rem;
  }
`

export const Spacer = styled.th`
  min-width: 0.275rem;
`

export const SpacerHeader = styled.th`
  min-width: 0.275rem;
  border-bottom: 0.25rem solid ${({ theme }) => theme.core.darkBackground};
`
