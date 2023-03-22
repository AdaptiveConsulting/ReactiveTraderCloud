import { Quotes } from "../Quotes"
import { HelpText, Pill } from "../styles"
import { ExecutionWorkflow } from "./ExecutionWorkflow"
import {
  NlpExecutionStatus,
  useMoveNextOnEnter,
  useNlpExecutionState,
} from "./state"

const Usage = () => (
  <HelpText>
    Usage: <Pill>buy/sell</Pill> <Pill>quantity</Pill> <Pill>instrument</Pill>
  </HelpText>
)

const Confirmation = () => {
  useMoveNextOnEnter()
  return (
    <HelpText>
      Press <Pill>ENTER</Pill> to continue
    </HelpText>
  )
}

export const TradeExecution = () => {
  const state = useNlpExecutionState()

  switch (state.type) {
    case NlpExecutionStatus.MissingData:
      return <Usage />
    case NlpExecutionStatus.DataReady:
      return <Confirmation />
    default:
      return (
        <>
          <ExecutionWorkflow {...state} />
          <Quotes symbols={[state.payload.requestData.symbol]} />
        </>
      )
  }
}
