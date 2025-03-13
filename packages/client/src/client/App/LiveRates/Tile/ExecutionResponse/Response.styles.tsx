import styled from "styled-components"

import { OverlayDiv } from "@/client/components/OverlayDiv"
import { ExecutionStatus } from "@/services/executions"

import { TileState, TileStates } from "../Tile.state"

export const ExecutionStatusAlertContainer = styled(OverlayDiv)<{
  state: TileState
}>`
  background-color: ${({ state, theme }) => {
    switch (state.status) {
      case TileStates.Finished:
        return state.trade.status === ExecutionStatus.Done
          ? theme.color["Colors/Background/bg-success-primary"]
          : theme.color["Colors/Background/bg-error-primary"]
      case TileStates.TooLong:
        return theme.color["Colors/Background/bg-warning-primary"]
      case TileStates.Timeout:
      case TileStates.CreditExceeded:
        return theme.color["Colors/Background/bg-error-primary"]
      default:
        return ""
    }
  }};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  position: absolute;
`

export const CurrencyPairDiv = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  svg {
    fill: ${({ theme }) => theme.color["Colors/Text/text-white"]};
  }
`
