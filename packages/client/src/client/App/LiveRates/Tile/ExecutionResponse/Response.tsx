import { formatNumber } from "client/utils"
import { format } from "date-fns"
import { Direction } from "generated/TradingGateway"
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa"
import { CurrencyPair } from "services/currencyPairs"
import { ExecutionStatus } from "services/executions"
import styled from "styled-components"

import { useTileCurrencyPair } from "../Tile.context"
import {
  getTileState$,
  onDismissMessage,
  TileState,
  TileStates,
  useTileState,
} from "../Tile.state"
import Pending from "./Pending"
import {
  AssetText,
  Button,
  CurrencyPairDiv,
  ExecutionStatusAlertContainer,
  TradeIdDiv,
  TradeMessageDiv,
} from "./Response.styles"

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

const AlignedCheck = styled(FaCheckCircle)`
  padding-right: 4px;
  vertical-align: middle;
  font-size: 1.5em;
`

const AlignedTriangle = styled(FaExclamationTriangle)`
  padding-right: 4px;
  vertical-align: middle;
  font-size: 1.5em;
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
    return "Trade execution taking longer than expected"
  }

  if (tileState.status === TileStates.Timeout) {
    return "Trade execution timeout exceeded"
  }

  if (tileState.status === TileStates.CreditExceeded) {
    return "Credit limit exceeded"
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

const ExecutionMessage = ({
  tileState,
  currencyPair: { terms, base },
  onClose,
}: {
  tileState: TileState
  currencyPair: CurrencyPair
  onClose: () => void
}) => {
  const tradeId = tileState.trade?.tradeId

  const isWaiting =
    tileState.status === TileStates.Started ||
    tileState.status === TileStates.TooLong

  const isSuccessful =
    tileState.status === TileStates.Finished &&
    tileState.trade.status === ExecutionStatus.Done
  return (
    <ExecutionStatusAlertContainer state={tileState} role="dialog">
      <CurrencyPairDiv>
        {isSuccessful ? <AlignedCheck /> : <AlignedTriangle />}
        <AssetText>
          {base}/{terms}
        </AssetText>
      </CurrencyPairDiv>
      <TradeIdDiv>
        {tradeId && (
          <>
            Trade ID: <span data-testid="trade-id">{tradeId}</span>
          </>
        )}
      </TradeIdDiv>
      <TradeMessageDiv role="alert">
        {getExecutionMessage(tileState, base, terms)}
      </TradeMessageDiv>
      {!isWaiting && (
        <Button onClick={onClose} success={isSuccessful}>
          Close
        </Button>
      )}
    </ExecutionStatusAlertContainer>
  )
}

export const executionResponse$ = getTileState$
export const ExecutionResponse = () => {
  const currencyPair = useTileCurrencyPair()
  const tileState = useTileState(currencyPair.symbol)
  const props = {
    currencyPair,
    tileState,
    onClose: () => {
      onDismissMessage(currencyPair.symbol)
    },
  }

  return <StatelessExecutionResponse {...props} />
}

export const StatelessExecutionResponse = ({
  currencyPair,
  tileState,
  onClose,
}: {
  currencyPair: CurrencyPair
  tileState: TileState
  onClose: () => void
}) => {
  if (tileState.status === TileStates.Ready) return null

  return tileState.status === TileStates.Started ? (
    <Pending />
  ) : (
    <ExecutionMessage
      currencyPair={currencyPair}
      tileState={tileState}
      onClose={onClose}
    />
  )
}
