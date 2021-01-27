import styled, { DefaultTheme } from "styled-components/macro"
import { ExecutionStatus } from "services/executions"
import { TileState, TileStates } from "../Tile.state"

export const OverlayDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
`

export const ExecutionStatusAlertContainer = styled(OverlayDiv)<{
  state: TileState
}>`
  background-color: ${({ state, theme }) => {
    switch (state.status) {
      case TileStates.Finished:
        return state.trade.status === ExecutionStatus.Done
          ? theme.colors.accents.positive.darker
          : theme.colors.accents.negative.darker
      case TileStates.TooLong:
        return theme.colors.accents.aware.darker
      case TileStates.Timeout:
        return theme.colors.accents.negative.darker
      default:
        return ""
    }
  }};
  display: flex;
  flex-direction: column;
  font-weight: bolder;
  justify-content: space-evenly;
  color: ${({ theme }) => theme.white};
`

export const TradeIdDiv = styled.div`
  margin: 0 1.25rem;
  text-align: center;
  font-weight: 900;
  font-size: 0.9rem;
`

export const TradeMessageDiv = styled.div`
  font-size: 0.8rem;
  line-height: 1.5rem;
  margin: 0 1.25rem;
  text-align: center;
`

export const Button = styled("button")<{
  success: Boolean
  theme: DefaultTheme
}>`
  background-color: ${({ success, theme }) =>
    success ? theme.accents.positive.base : theme.accents.negative.base};
  border-radius: 2rem;
  margin: 0 auto;
  padding: 0.5rem 0;
  text-align: center;
  width: 15%;
  font-size: 0.8rem;
`

export const CurrencyPairDiv = styled.div`
  margin: 0 1.25rem;
  font-weight: 900;
  font-size: 0.9rem;
`
