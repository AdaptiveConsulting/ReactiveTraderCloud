import { format } from "date-fns"
import { formatNumber } from "utils"
import {
  Button,
  CurrencyPairDiv,
  ExecutionStatusAlertContainer,
  TradeIdDiv,
  TradeMessageDiv,
} from "./Response.styles"
import styled from "styled-components/macro"
import { Direction } from "services/trades"
import { ExecutionStatus } from "services/executions"
import { FaCheck, FaExclamationTriangle } from "react-icons/fa"
import Pending from "./Pending"
import { useTileCurrencyPair } from "../Tile.context"
import {
  onDismissMessage,
  TileState,
  TileStates,
  useTileState,
} from "../Tile.state"
import { CurrencyPair } from "services/currencyPairs"

const BackgroundColored = styled.span`
  background-color: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.colors.accents.positive.base};
  font-weight: 900;
`
const BoldSpan = styled.span`
  font-weight: 900;
`
const BoldItalicSpan = styled.span`
  font-weight: 900;
  font-style: italic;
`

const AlignedCheck = styled(FaCheck)`
  padding-right: 2px;
`

const AlignedTriangle = styled(FaExclamationTriangle)`
  padding-right: 2px;
`

const pastTenseDirection: Record<Direction, string> = {
  [Direction.Buy]: "bought",
  [Direction.Sell]: "sold",
}

const getExecutionMessage = (
  tileState: TileState,
  base: string,
  terms: string,
) => {
  if (tileState.status === TileStates.TooLong) {
    return "Trade execution taking longer than expected."
  }

  if (tileState.status === TileStates.Timeout) {
    return "Trade execution timeout exceeded."
  }

  if (tileState.status !== TileStates.Finished) return null

  if (tileState.trade.status === ExecutionStatus.Rejected)
    return "Your trade has been rejected"

  const { direction, notional, spotRate, valueDate } = tileState.trade
  return (
    <>
      {`You ${pastTenseDirection[direction]} `}
      <BackgroundColored>{`${base} ${formatNumber(
        notional,
      )}`}</BackgroundColored>
      {` at a rate of `}
      <BackgroundColored>{`${spotRate}`}</BackgroundColored>
      {` for `}
      <br></br>
      <BoldItalicSpan>
        {terms} {formatNumber(notional * spotRate)}
      </BoldItalicSpan>
      {` settling (Spt) `}
      <BoldSpan>{`${format(new Date(valueDate), "dd MMM")}.`}</BoldSpan>
    </>
  )
}

const ExecutionMessage: React.FC<{
  tileState: TileState
  currencyPair: CurrencyPair
}> = ({ tileState, currencyPair: { terms, base, symbol } }) => {
  const tradeId = tileState.trade?.id

  const isWaiting =
    tileState.status === TileStates.Started ||
    tileState.status === TileStates.TooLong

  const isSuccessful =
    tileState.status === TileStates.Finished &&
    tileState.trade.status === ExecutionStatus.Done

  return (
    <ExecutionStatusAlertContainer state={tileState}>
      <CurrencyPairDiv>
        {isSuccessful ? <AlignedCheck /> : <AlignedTriangle />}
        {base}/{terms}
      </CurrencyPairDiv>
      <TradeIdDiv>{tradeId && `Trade ID: ${tradeId}`}</TradeIdDiv>
      <TradeMessageDiv>
        {getExecutionMessage(tileState, base, terms)}
      </TradeMessageDiv>
      {!isWaiting && (
        <Button
          onClick={() => {
            onDismissMessage(symbol)
          }}
          success={isSuccessful}
        >
          Close
        </Button>
      )}
    </ExecutionStatusAlertContainer>
  )
}

export const ExecutionResponse = () => {
  const currencyPair = useTileCurrencyPair()
  const tileState = useTileState(currencyPair.symbol)

  if (tileState.status === TileStates.Ready) return null
  return tileState.status === TileStates.Started ? (
    <Pending />
  ) : (
    <ExecutionMessage currencyPair={currencyPair} tileState={tileState} />
  )
}
