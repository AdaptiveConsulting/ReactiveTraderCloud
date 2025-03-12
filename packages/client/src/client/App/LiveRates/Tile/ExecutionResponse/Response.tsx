import { format } from "date-fns"
import styled from "styled-components"

import { Button } from "@/client/components/Button"
import { CheckCircleIcon } from "@/client/components/icons/CheckCircleIcon"
import { WarningIcon } from "@/client/components/icons/WarningIcon"
import { Typography } from "@/client/components/Typography"
import { formatNumber } from "@/client/utils"
import { Direction } from "@/generated/TradingGateway"
import { CurrencyPair } from "@/services/currencyPairs"
import { ExecutionStatus } from "@/services/executions"

import { useTileCurrencyPair } from "../Tile.context"
import {
  getTileState$,
  onDismissMessage,
  TileState,
  TileStates,
  useTileState,
} from "../Tile.state"
import { Pending } from "./Pending"
import {
  CurrencyPairDiv,
  ExecutionStatusAlertContainer,
} from "./Response.styles"

const BackgroundColored = styled.span`
  color: ${({ theme }) =>
    theme.color["Colors/Text/text-success-primary (600)"]};
  background-color: ${({ theme }) => theme.color["Colors/Foreground/fg-white"]};
  font-weight: 700;
  padding: 0 ${({ theme }) => theme.spacing.xs};
`
const BoldSpan = styled.span`
  font-weight: 700;
`
const BoldItalicSpan = styled.span`
  font-weight: 700;
  font-style: italic;
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
      <BackgroundColored>{`${base} ${formatNumber(notional)}`}</BackgroundColored>
      {` at a rate of `}
      <BackgroundColored>{`${spotRate}`}</BackgroundColored>
      {` for `}
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
        {isSuccessful ? <CheckCircleIcon /> : <WarningIcon />}
        <Typography variant="Text xl/Bold">
          {base}/{terms}
        </Typography>
      </CurrencyPairDiv>
      <Typography variant="Text lg/Bold">
        {tradeId && (
          <>
            Trade ID: <span data-testid="trade-id">{tradeId}</span>
          </>
        )}
      </Typography>
      <Typography
        variant="Text lg/Regular"
        color="Colors/Text/text-white"
        role="alert"
      >
        {getExecutionMessage(tileState, base, terms)}
      </Typography>
      {!isWaiting && (
        <Button
          variant="white-outline"
          size="xs"
          onClick={onClose}
          style={{ marginTop: "auto" }}
        >
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
