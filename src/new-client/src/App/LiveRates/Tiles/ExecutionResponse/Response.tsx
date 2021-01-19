import { format } from "date-fns"
import { useCurrencyPair } from "services/currencyPairs"
import {
  useExecution,
  onExecutionDismiss,
  ExecutionStatus,
} from "services/executions"
import { formatNumber } from "utils"
import {
  Button,
  CurrencyPairDiv,
  ExecutionStatusAlertContainer,
  TradeIdDiv,
  TradeMessageDiv,
} from "./styled"
import styled from "styled-components/macro"
import { Direction } from "services/trades"
import { useBaseTerm } from "../TileHeader"
import { useContext } from "react"
import { SymbolContext } from "../Tile"
import { FaCheck, FaExclamationTriangle } from "react-icons/fa"
import Pending from "./Pending"

export const BackgroundColored = styled.span`
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

const pastTenseDirection = (d: Direction): string => {
  if (d === Direction.Buy) {
    return "bought"
  }

  if (d === Direction.Sell) {
    return "sold"
  }

  return "Never" as never
}

const buildTradeMessage = (
  base: string,
  direction: Direction,
  notional: number,
  spotRate: number,
  terms: string,
  valueDate: string,
) => (
  <TradeMessageDiv>
    {`You ${pastTenseDirection(direction)} `}
    <BackgroundColored>{`${base} ${formatNumber(notional)}`}</BackgroundColored>
    {` at a rate of `}
    <BackgroundColored>{`${spotRate}`}</BackgroundColored>
    {` for `}
    <br></br>
    <BoldItalicSpan>
      {terms} {formatNumber(notional * spotRate)}
    </BoldItalicSpan>
    {` settling (Spt) `}
    <BoldSpan>{`${format(new Date(valueDate), "dd MMM")}.`}</BoldSpan>
  </TradeMessageDiv>
)

export const ExecutionResponse = () => {
  const symbol = useContext(SymbolContext)
  const {
    currencyPair,
    id,
    tradeId,
    direction,
    notional,
    spotRate,
    valueDate,
    status,
  } = useExecution(symbol)
  const baseTerm = useBaseTerm(symbol)
  const { base, terms } = useCurrencyPair(symbol)
  const successOrReject =
    status === ExecutionStatus.Done || status === ExecutionStatus.Rejected
  const closeAlert = () => {
    onExecutionDismiss({ currencyPair, id })
  }

  return status !== ExecutionStatus.Ready ? (
    status !== ExecutionStatus.Pending ? (
      <ExecutionStatusAlertContainer status={status}>
        <CurrencyPairDiv>
          {status === ExecutionStatus.Done ? (
            <AlignedCheck />
          ) : (
            <AlignedTriangle />
          )}
          {baseTerm}
        </CurrencyPairDiv>
        {successOrReject && <TradeIdDiv>{`Trade ID: ${tradeId}`}</TradeIdDiv>}
        {status === ExecutionStatus.Done &&
          buildTradeMessage(
            base,
            direction,
            notional,
            spotRate,
            terms,
            valueDate,
          )}
        {status === ExecutionStatus.Rejected && (
          <TradeMessageDiv>Your trade has been rejected.</TradeMessageDiv>
        )}
        {status === ExecutionStatus.TakingTooLong && (
          <TradeMessageDiv>
            Trade execution taking longer than expected
          </TradeMessageDiv>
        )}
        {status === ExecutionStatus.RequestTimeout && (
          <TradeMessageDiv>Trade execution timeout exceeded</TradeMessageDiv>
        )}
        {successOrReject && (
          <Button
            onClick={closeAlert}
            success={status === ExecutionStatus.Done}
          >
            Close
          </Button>
        )}
      </ExecutionStatusAlertContainer>
    ) : (
      <Pending />
    )
  ) : null
}
