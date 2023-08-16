import { Card as RfqCard } from "client/App/Credit/CreditRfqs/CreditRfqCards/CreditRfqCard"
import { formatNumber } from "client/utils"
import { ACK_CREATE_RFQ_RESPONSE, Direction } from "generated/TradingGateway"
import { creditInstruments$ } from "services/credit"

import { useOverlayElement } from "../../../overlayContext"
import { onResetInput } from "../../../services/nlpService"
import {
  NlpExecutionActionContainer,
  NlpExecutionContainer,
  NlpResponseContainer,
} from "../../styles"
import { IndeterminateLoadingBar } from "../IndeterminateLoadingBar"
import { useMoveNextOnEnter } from "../useMouseNextOnEnter"
import {
  RfqNlpExecutionDataReady,
  RfqNlpExecutionState,
  RfqNlpExecutionStatus,
} from "./rfqExecutionTypes"
import { onNext } from "./state"

const ConfirmContent = ({
  direction,
  notional,
  symbol,
  maturity,
}: RfqNlpExecutionDataReady["payload"]["requestData"]) => {
  useMoveNextOnEnter(onNext)
  const directionStr = direction === Direction.Buy ? "buying" : "selling"
  const notionalStr = formatNumber(notional * 1000)
  const creditInstrument = creditInstruments$
    .getValue()
    .filter((bond) => bond.ticker === symbol)

  const selectedMaturity =
    maturity === creditInstrument[0].maturity.slice(0, 4) ||
    maturity === creditInstrument[1].maturity.slice(0, 4)
      ? maturity
      : creditInstrument[0].maturity.slice(0, 4)

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
      <p>
        <small>with a maturity set to {selectedMaturity} </small>
      </p>
    </>
  )
}

const ErrorContent = ({ message }: { message: string }) => (
  <>
    <p>
      <strong>Something went wrong while creating your RFQ.</strong>
    </p>
    <p>{<small>{message}</small>}</p>
  </>
)

const Content: React.FC<RfqNlpExecutionState> = (state) => {
  switch (state.type) {
    case RfqNlpExecutionStatus.WaitingToExecute:
      return (
        <NlpResponseContainer>
          <ConfirmContent {...state.payload.requestData} />
        </NlpResponseContainer>
      )

    case RfqNlpExecutionStatus.Executing:
      return <p>Executing Trade...</p>

    case RfqNlpExecutionStatus.Done:
      return state.payload.response.type === ACK_CREATE_RFQ_RESPONSE ? (
        <RfqCard
          id={state.payload.response.response.payload}
          highlight={false}
        />
      ) : (
        <ErrorContent message={state.payload.response.reason} />
      )
    default:
      return <div>Default</div>
  }
}

export const ExecutionWorkflow: React.FC<RfqNlpExecutionState> = (state) => {
  const overlayEl = useOverlayElement()

  return (
    overlayEl && (
      <NlpExecutionContainer className="search-container--active">
        <IndeterminateLoadingBar
          done={state.type === RfqNlpExecutionStatus.Done}
          successful={
            state.type === RfqNlpExecutionStatus.Done &&
            state.payload.response.type === ACK_CREATE_RFQ_RESPONSE
          }
          waitingToExecute={state.type < RfqNlpExecutionStatus.WaitingToExecute}
        />
        <Content {...state} />
        {state.type === RfqNlpExecutionStatus.WaitingToExecute ? (
          <NlpExecutionActionContainer>
            <button onClick={onNext}>Raise</button>

            <button onClick={onResetInput}>Cancel</button>
          </NlpExecutionActionContainer>
        ) : null}
      </NlpExecutionContainer>
    )
  )
}
