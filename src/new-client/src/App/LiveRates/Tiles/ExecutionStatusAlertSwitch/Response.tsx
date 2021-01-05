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

export const BackgroundColored = styled.span`
  background-color: ${({ theme }) => theme.textColor};
  color: ${({ theme }) => theme.colors.accents.positive.base};
  padding: 0.25rem;
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
    {` for ${terms} ${formatNumber(notional * spotRate)}`}
    {` settling (SPT) ${format(new Date(valueDate), "dd-MMM")}`}
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
      <CurrencyPairDiv>{baseTerm}</CurrencyPairDiv>
      <TradeIdDiv>{`Trade Id: ${tradeId}`}</TradeIdDiv>
      {props.children}
      <Button onClick={closeAlert} success={props.success}>
        Dismiss
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

export { Done, Rejected }
