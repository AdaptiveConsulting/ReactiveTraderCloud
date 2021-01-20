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

const ResponseContainer = (props: any) => {
  const symbol = useContext(SymbolContext)
  const { currencyPair, id, tradeId } = useExecution(symbol)
  const baseTerm = useBaseTerm(symbol)

  const closeAlert = () => {
    onExecutionDismiss({ currencyPair, id })
  }

  return (
    <ExecutionStatusAlertContainer status={props.status}>
      <CurrencyPairDiv>
        {props.status === ExecutionStatus.Done ? (
          <AlignedCheck />
        ) : (
          <AlignedTriangle />
        )}
        {baseTerm}
      </CurrencyPairDiv>
      <TradeIdDiv>{`Trade ID: ${tradeId}`}</TradeIdDiv>
      {props.children}
      <Button onClick={closeAlert} success={props.success}>
        Close
      </Button>
    </ExecutionStatusAlertContainer>
  )
}

const Done = () => {
  const symbol = useContext(SymbolContext)
  const { direction, notional, spotRate, valueDate } = useExecution(symbol)

  const { base, terms } = useCurrencyPair(symbol)

  return (
    <ResponseContainer status={ExecutionStatus.Done} success={true}>
      {buildTradeMessage(base, direction, notional, spotRate, terms, valueDate)}
    </ResponseContainer>
  )
}

const Rejected = () => (
  <ResponseContainer status={ExecutionStatus.Rejected} success={false}>
    <TradeMessageDiv>Your trade has been rejected.</TradeMessageDiv>
  </ResponseContainer>
)

const TakingTooLong = () => {
  const symbol = useContext(SymbolContext)
  const baseTerm = useBaseTerm(symbol)
  return (
    <ExecutionStatusAlertContainer status={ExecutionStatus.TakingTooLong}>
      <CurrencyPairDiv>
        <AlignedTriangle />
        {baseTerm}
      </CurrencyPairDiv>
      <TradeMessageDiv>
        Trade execution taking longer than expected
      </TradeMessageDiv>
    </ExecutionStatusAlertContainer>
  )
}

const RequestTimeout = () => {
  const symbol = useContext(SymbolContext)
  const baseTerm = useBaseTerm(symbol)
  return (
    <ExecutionStatusAlertContainer status={ExecutionStatus.RequestTimeout}>
      <CurrencyPairDiv>
        <AlignedTriangle />
        {baseTerm}
      </CurrencyPairDiv>
      <TradeMessageDiv>Trade execution timeout exceeded</TradeMessageDiv>
    </ExecutionStatusAlertContainer>
  )
}

export { Done, Rejected, TakingTooLong, RequestTimeout }
