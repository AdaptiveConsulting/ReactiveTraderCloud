import { ReactNode } from "react"
import styled, { css } from "styled-components"

import { QuoteState } from "@/generated/TradingGateway"
import { LimitCheckStatus, TradeStatus } from "@/client/services/trades/types"

export const Table = styled.div`
  border-bottom: 15px solid ${({ theme }) => theme.core.darkBackground};
  height: calc(100% - 4.75rem);
  width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  .visually-hidden {
    display: none;
  }
`

export const TableHeadRow = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  font-size: 0.675rem;
  text-transform: uppercase;
  z-index: 1;
  height: 2rem;
  background-color: ${({ theme }) => theme.core.lightBackground};
`

export const highlightBackgroundColor = css`
  animation: ${({ theme }) => theme.flash} 1s ease-in-out 3;
`

export const TableBodyRow = styled.div<{
  highlight?: boolean
  index?: number
}>`
  display: flex;
  width: 100%;
  background-color: ${({ theme, index }) =>
    index && index % 2 === 0 ? undefined : theme.core.lightBackground};
  &:hover {
    background-color: ${({ theme }) => theme.core.alternateBackground};
  }
  ${({ highlight }) => highlight && highlightBackgroundColor}
`

export const TableBodyCell = styled.div<{
  align?: "right" | "left"
  width: number
  children: ReactNode
}>`
  display: flex;
  align-items: center;
  justify-content: ${({ align }) =>
    align === "right" ? "flex-end" : "flex-start"};
  width: ${({ width }) => width}%;
  padding-right: ${({ align: numeric }) => (numeric ? "1.5rem;" : null)};
`

export const TableBodyStrikeThrough = styled.div<{
  isRejected?: boolean
}>`
  content: " ";
  display: ${({ isRejected }) => (isRejected ? "block" : "none")};
  position: absolute;
  top: 50%;
  left: 0;
  border-bottom: 1px solid red;
  width: 100%;
`

export const StatusIndicator = styled.div<{
  status: QuoteState | LimitCheckStatus | TradeStatus
}>`
  width: 21px;
  border-left: 6px solid
    ${({ status, theme: { accents } }) => {
      if (
        status === TradeStatus.Done ||
        status === QuoteState.Accepted ||
        status === LimitCheckStatus.Success
      )
        return accents.positive.base
      else if (
        status === TradeStatus.Rejected ||
        status === QuoteState.Rejected ||
        status === LimitCheckStatus.Failure
      ) {
        return accents.negative.base
      }
      return "inherit"
    }};
`

export const StatusIndicatorSpacer = styled.div`
  border-bottom: 0.25rem solid ${({ theme }) => theme.core.darkBackground};
  width: 21px;
`
