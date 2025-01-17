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
          ? theme.newTheme.color["Colors/Background/bg-success-primary"]
          : theme.newTheme.color["Colors/Background/bg-error-primary"]
      case TileStates.TooLong:
        return theme.newTheme.color["Colors/Background/bg-warning-primary"]
      case TileStates.Timeout:
      case TileStates.CreditExceeded:
        return theme.newTheme.color["Colors/Background/bg-error-primary"]
      default:
        return ""
    }
  }};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.newTheme.spacing.sm};
  padding: ${({ theme }) => theme.newTheme.spacing.xl}
    ${({ theme }) => theme.newTheme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.newTheme.spacing.md};
  // Solution to stack flex child ontop of another, height is not respected in safari
  // margin-left: -100%;
  position: absolute;
`

export const CurrencyPairDiv = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.newTheme.spacing.sm};
  svg {
    fill: ${({ theme }) => theme.newTheme.color["Colors/Text/text-white"]};
  }
`
