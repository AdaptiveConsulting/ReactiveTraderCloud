import { Quotes } from "../../Quotes"
import { HelpText, Pill } from "../../styles"
import { useMoveNextOnEnter } from "../useMouseNextOnEnter"
import { onNext, useTradeExecutionState } from "./state"
import { TradeNlpExecutionStatus } from "./tradeExecutionTypes"
import { ExecutionWorkflow } from "./TradeExecutionWorkflow"

const Usage = () => (
  <HelpText>
    Usage: <Pill>buy/sell</Pill> <Pill>quantity</Pill> <Pill>instrument</Pill>
  </HelpText>
)

const Confirmation = () => {
  useMoveNextOnEnter(onNext)
  return (
    <HelpText>
      Press <Pill>ENTER</Pill> to continue
    </HelpText>
  )
}

export const TradeExecution = () => {
  const state = useTradeExecutionState()

  switch (state.type) {
    case TradeNlpExecutionStatus.MissingData:
      return <Usage />
    case TradeNlpExecutionStatus.DataReady:
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
