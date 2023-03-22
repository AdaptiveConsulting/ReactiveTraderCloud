import { format } from "date-fns"
import { createPortal } from "react-dom"

import { Direction } from "@/generated/TradingGateway"
import { useOverlayElement } from "@/OpenFin/apps/Launcher/overlayContext"
import { onResetInput } from "@/OpenFin/apps/Launcher/services/nlpService"
import { ExecutionStatus, ExecutionTrade } from "@/services/executions"
import { formatNumber } from "@/utils"

import {
  TradeExecutionActionContainer,
  TradeExecutionContainer,
  TradeResponseContainer,
} from "../styles"
import { IndeterminateLoadingBar } from "./IndeterminateLoadingBar"
import {
  NlpExecutionDataReady,
  NlpExecutionState,
  NlpExecutionStatus,
  onNext,
  useMoveNextOnEnter,
} from "./state"

const ConfirmContent = ({
  direction,
  notional,
  symbol,
}: NlpExecutionDataReady["payload"]["requestData"]) => {
  useMoveNextOnEnter()
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

const Content: React.FC<NlpExecutionState> = (state) => {
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

export const ExecutionWorkflow: React.FC<NlpExecutionState> = (state) => {
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
