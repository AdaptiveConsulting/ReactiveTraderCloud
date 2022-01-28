import styled, { DefaultTheme } from "styled-components"
import { ExecutionStatus } from "@/services/executions"
import { TileState, TileStates } from "../Tile.state"
import { OverlayDiv } from "@/components/OverlayDiv"

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
      case TileStates.CreditExceeded:
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
  // Solution to stack flex child ontop of another, height is not respected in safari
  // margin-left: -100%;
  position: absolute;
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
  display: -webkit-box;
  -webkit-box-pack: center;
  -webkit-box-align: center;
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

export const AssetText = styled.span`
  vertical-align: middle;
`
