import { format } from "date-fns"
import { createPortal } from "react-dom"

import { Direction } from "@/generated/TradingGateway"
import { ExecutionStatus, ExecutionTrade } from "@/services/executions"
import { formatNumber } from "@/utils"

import { useOverlayElement } from "../../../overlayContext"
import { onResetInput } from "../../../services/nlpService"
import {
  TradeExecutionActionContainer,
  TradeExecutionContainer,
  TradeResponseContainer,
} from "../../styles"
import { useMoveNextOnEnter } from "../useMoveNextOnEnterHook"
import { IndeterminateLoadingBar } from "./IndeterminateLoadingBar"
import { onNext } from "./state"
import {
  NlpExecutionStatus,
  TradeNlpExecutionDataReady,
  TradeNlpExecutionState,
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
    case NlpExecutionStatus.WaitingToExecute:
      return <ConfirmContent {...state.payload.requestData} />

    case NlpExecutionStatus.Executing:
      return <p>Executing Trade...</p>

    case NlpExecutionStatus.Done:
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
      <TradeExecutionContainer className="search-container--active">
        <IndeterminateLoadingBar state={state} />
        <TradeResponseContainer>
          <Content {...state} />
        </TradeResponseContainer>
        <TradeExecutionActionContainer>
          {state.type === NlpExecutionStatus.WaitingToExecute ? (
            <button onClick={onNext}>Execute</button>
          ) : null}
          <button
            disabled={state.type === NlpExecutionStatus.Executing}
            onClick={onResetInput}
          >
            {state.type === NlpExecutionStatus.Done ? "Close" : "Cancel"}
          </button>
        </TradeExecutionActionContainer>
      </TradeExecutionContainer>,
      overlayEl,
    )
  )
}
