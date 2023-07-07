import { RfqCard } from "@/App/Credit/CreditRfqs/CreditRfqCards/CreditRfqCard"
import { ACK_CREATE_RFQ_RESPONSE, Direction } from "@/generated/TradingGateway"
import { formatNumber } from "@/utils"

import { useOverlayElement } from "../../../overlayContext"
import { onResetInput } from "../../../services/nlpService"
import {
  NlpExecutionActionContainer,
  NlpExecutionContainer,
  NlpResponseContainer,
} from "../../styles"
import { IndeterminateLoadingBar } from "../IndeterminateLoadingBar"
import { useMoveNextOnEnter } from "../useMoveNextOnEnterHook"
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
}: RfqNlpExecutionDataReady["payload"]["requestData"]) => {
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

const Content: React.FC<RfqNlpExecutionState> = (state) => {
  switch (state.type) {
    case RfqNlpExecutionStatus.WaitingToExecute:
      return (
        <NlpResponseContainer>
          <ConfirmContent {...state.payload.requestData} />
        </NlpResponseContainer>
      )

    case RfqNlpExecutionStatus.Done:
      return state.payload.response.type === ACK_CREATE_RFQ_RESPONSE ? (
        <RfqCard id={state.payload.response.response.payload} />
      ) : null
    default:
      return <div>default</div>
  }
}

export const ExecutionWorkflow: React.FC<RfqNlpExecutionState> = (state) => {
  const overlayEl = useOverlayElement()

  return (
    overlayEl && (
      <NlpExecutionContainer className="search-container--active">
        <IndeterminateLoadingBar
          done={state.type === RfqNlpExecutionStatus.Done ? true : false}
          successful={state.type == RfqNlpExecutionStatus.Done ? true : false}
          waitingToExecute={
            state.type < RfqNlpExecutionStatus.WaitingToExecute ? true : false
          }
        />
        <Content {...state} />
        {state.type === RfqNlpExecutionStatus.WaitingToExecute ? (
          <NlpExecutionActionContainer>
            <button onClick={onNext}>Execute</button>

            <button onClick={onResetInput}>Cancel</button>
          </NlpExecutionActionContainer>
        ) : null}
      </NlpExecutionContainer>
    )
  )
}
