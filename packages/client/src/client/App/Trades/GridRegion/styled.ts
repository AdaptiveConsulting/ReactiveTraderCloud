import { ReactNode } from "react"
import styled, { css } from "styled-components"

import { backgroundFlash } from "@/client/utils/styling"
import {
  ACCEPTED_QUOTE_STATE,
  REJECTED_WITH_PRICE_QUOTE_STATE,
  REJECTED_WITHOUT_PRICE_QUOTE_STATE,
} from "@/generated/TradingGateway"
import { QuoteStatus } from "@/services/rfqs/types"
import { LimitCheckStatus, TradeStatus } from "@/services/trades/types"

export const Table = styled.div`
  ${({ theme }) => theme.textStyles["Text sm/Regular"]}
  height: 100%;
  width: 100%;
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.md};
  .visually-hidden {
    display: none;
  }
`

export const TableHeadRow = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  color: ${({ theme }) => theme.color["Colors/Text/text-quaternary (500)"]};
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-primary_alt"]};
  z-index: 1;

  padding: ${({ theme }) => theme.spacing.sm};
`

export const highlightBackgroundColor = css`
  animation: ${backgroundFlash} 1s ease-in-out 3;
`

export const TableBodyRow = styled.div<{
  highlight?: boolean
  index?: number
}>`
  display: flex;
  width: 100%;
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-primary"]};
  border-bottom: 1px solid
    ${({ theme }) => theme.color["Colors/Background/bg-tertiary"]};

  &:hover {
    background-color: ${({ theme }) =>
      theme.color["Colors/Background/bg-secondary"]};
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
  border-bottom: 1px solid
    ${({ theme }) =>
      theme.color[
        "Component colors/Utility/Red/utility-red-400"
      ]}; // TODO talk to UX about getting better error reds
  width: 100%;
`

export const StatusIndicator = styled.div<{
  status: QuoteStatus | LimitCheckStatus | TradeStatus
}>`
  width: 21px;
  border-left: 4px solid
    ${({ status, theme }) => {
      if (
        status === TradeStatus.Done ||
        status === ACCEPTED_QUOTE_STATE ||
        status === LimitCheckStatus.Success
      )
        return theme.color[
          "Component colors/Utility/Success/utility-success-500"
        ]
      else if (
        status === TradeStatus.Rejected ||
        status === REJECTED_WITH_PRICE_QUOTE_STATE ||
        status === REJECTED_WITHOUT_PRICE_QUOTE_STATE ||
        status === LimitCheckStatus.Failure
      ) {
        return theme.color[
          "Component colors/Utility/Red/utility-red-400" // TODO talk to UX about getting better error reds
        ]
      }
      return "inherit"
    }};
`

export const StatusIndicatorSpacer = styled.div`
  width: ${({ theme }) => theme.spacing["lg"]};
`
