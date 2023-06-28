import { Direction } from "@/generated/TradingGateway"
import { formatNumber } from "@/utils"

import {
  HelpText,
  Pill,
  TradeExecutionActionContainer,
  TradeExecutionContainer,
  TradeResponseContainer,
} from "../../styles"
import { IndeterminateLoadingBar } from "../TradeExecution/IndeterminateLoadingBar"
import {
  NlpExecutionDataReady,
  NlpExecutionStatus,
  useMoveNextOnEnter,
} from "../TradeExecution/state"
import { onNext, useRfqExecutionState } from "./state"

const ConfirmContent = ({
  direction,
  notional,
  symbol,
}: NlpExecutionDataReady["payload"]["requestData"]) => {
  useMoveNextOnEnter(onNext)
  const directionStr = direction === Direction.Buy ? "buying" : "selling"
  const notionalStr = formatNumber(notional)

  return (
    <>
      <p>
        <strong>Are You Sure?</strong>
      </p>
      <p>
        <small>
          You are raising an RFQ for {directionStr} {notionalStr} {symbol}
        </small>
      </p>
    </>
  )
}

const Usage = () => (
  <HelpText>
    Usage: <Pill>buy/sell</Pill> <Pill>quantity</Pill> <Pill>stock</Pill>
  </HelpText>
)

const Confirmation = () => {
  useMoveNextOnEnter(onNext)
  return (
    <HelpText>
      Press <Pill>ENTER</Pill> to create RFQ
    </HelpText>
  )
}

export const RfqExecution = () => {
  const state = useRfqExecutionState()

  switch (state.type) {
    case NlpExecutionStatus.MissingData:
      return <Usage />
    case NlpExecutionStatus.DataReady:
      return <Confirmation />
    case NlpExecutionStatus.WaitingToExecute:
      return (
        <TradeExecutionContainer className="search-container--active">
          <IndeterminateLoadingBar state={state} />
          <TradeResponseContainer>
            <ConfirmContent {...state.payload.requestData} />
          </TradeResponseContainer>
          <TradeExecutionActionContainer>
            {state.type === NlpExecutionStatus.WaitingToExecute ? (
              <button onClick={onNext}>Execute</button>
            ) : null}
          </TradeExecutionActionContainer>
        </TradeExecutionContainer>
      )
    case NlpExecutionStatus.Done:
      return <div>Your RFQ has been created.</div>
    default:
      return <div>default</div>
  }
}
