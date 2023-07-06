import { useEffect } from "react"

import { RfqCard } from "@/App/Credit/CreditRfqs/CreditRfqCards/CreditRfqCard"
import { ACK_CREATE_RFQ_RESPONSE, Direction } from "@/generated/TradingGateway"
import { registerSimulatedDealerResponses } from "@/services/credit/creditRfqResponses"
import { formatNumber } from "@/utils"

import { onResetInput } from "../../../services/nlpService"
import {
  HelpText,
  Pill,
  TradeExecutionActionContainer,
  TradeExecutionContainer,
  TradeResponseContainer,
} from "../../styles"
import { IndeterminateLoadingBar } from "../TradeExecution/IndeterminateLoadingBar"
import {
  NlpExecutionStatus,
  TradeNlpExecutionDataReady,
} from "../TradeExecution/tradeExecutionTypes"
import { useMoveNextOnEnter } from "../useMoveNextOnEnterHook"
import { onNext, useRfqExecutionState } from "./state"

const ConfirmContent = ({
  direction,
  notional,
  symbol,
}: TradeNlpExecutionDataReady["payload"]["requestData"]) => {
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
    Usage: <Pill>buy/sell</Pill> <Pill>quantity</Pill> <Pill>bond</Pill>
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

  useEffect(() => {
    const sub = registerSimulatedDealerResponses()

    return () => {
      sub.unsubscribe()
    }
  }, [])

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
            <button onClick={onResetInput}>Cancel</button>
          </TradeExecutionActionContainer>
        </TradeExecutionContainer>
      )
    case NlpExecutionStatus.Done:
      return state.payload.response.type === ACK_CREATE_RFQ_RESPONSE ? (
        <RfqCard id={state.payload.response.response.payload} />
      ) : null
    default:
      return <div>default</div>
  }
}
