import { format } from "date-fns"
import { createPortal } from "react-dom"

import { Direction } from "@/generated/TradingGateway"
import { ExecutionStatus, ExecutionTrade } from "@/services/executions"
import { formatNumber } from "@/utils"

import { useOverlayElement } from "../../../overlayContext"
import { onResetInput } from "../../../services/nlpService"
import {
  NlpExecutionActionContainer,
  NlpExecutionContainer,
  NlpResponseContainer,
} from "../../styles"
import { IndeterminateLoadingBar } from "../IndeterminateLoadingBar"
import { useMoveNextOnEnter } from "../useMouseNextOnEnter"
import { onNext } from "./state"
import {
  TradeNlpExecutionDataReady,
  TradeNlpExecutionState,
  TradeNlpExecutionStatus,
} from "./tradeExecutionTypes"

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
          You are {directionStr} {notionalStr} {symbol}
        </small>
      </p>
    </>
  )
}

const SuccessContent: React.FC<ExecutionTrade> = (trade) => {
  const message =
    trade.status === ExecutionStatus.Done
      ? `You ${trade.direction === Direction.Buy ? "bought" : "sold"} for ${
          trade.dealtCurrency
        }${formatNumber(trade.notional)} @ ${trade.spotRate} settling ${format(
          trade.tradeDate,
          "dd-MM-yyyy HH:mm:ss",
        )}`
      : "Your trade has been rejected."

  return (
    <>
      <p>
        <strong>Trade ID: {trade.id}</strong>
      </p>
      <p>
        <small>{message}</small>
      </p>
    </>
  )
}

const ErrorContent = ({ message }: { message: string }) => (
  <>
    <p>
      <strong>Something went wrong while executing your trade.</strong>
    </p>
    <p>{<small>{message}</small>}</p>
  </>
)

const Content: React.FC<TradeNlpExecutionState> = (state) => {
  switch (state.type) {
    case TradeNlpExecutionStatus.WaitingToExecute:
      return <ConfirmContent {...state.payload.requestData} />

    case TradeNlpExecutionStatus.Executing:
      return <p>Executing Trade...</p>

    case TradeNlpExecutionStatus.Done:
      return state.payload.response.type === "ok" ? (
        <SuccessContent {...state.payload.response.trade} />
      ) : (
        <ErrorContent message={state.payload.response.reason} />
      )

    default:
      return null
  }
}

export const ExecutionWorkflow: React.FC<TradeNlpExecutionState> = (state) => {
  const overlayEl = useOverlayElement()

  return (
    overlayEl &&
    createPortal(
      <NlpExecutionContainer className="search-container--active">
        <IndeterminateLoadingBar
          done={state.type === TradeNlpExecutionStatus.Done}
          successful={
            state.type === TradeNlpExecutionStatus.Done &&
            state.payload.response.type === "ok"
          }
          waitingToExecute={
            state.type < TradeNlpExecutionStatus.WaitingToExecute
          }
        />
        <NlpResponseContainer>
          <Content {...state} />
        </NlpResponseContainer>
        <NlpExecutionActionContainer>
          {state.type === TradeNlpExecutionStatus.WaitingToExecute ? (
            <button onClick={onNext}>Execute</button>
          ) : null}
          <button
            disabled={state.type === TradeNlpExecutionStatus.Executing}
            onClick={onResetInput}
          >
            {state.type === TradeNlpExecutionStatus.Done ? "Close" : "Cancel"}
          </button>
        </NlpExecutionActionContainer>
      </NlpExecutionContainer>,
      overlayEl,
    )
  )
}
