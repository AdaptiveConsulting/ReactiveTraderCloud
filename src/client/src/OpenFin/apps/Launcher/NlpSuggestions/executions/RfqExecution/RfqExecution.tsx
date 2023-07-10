import { useEffect } from "react"

import { registerSimulatedDealerResponses } from "@/services/credit/creditRfqResponses"

import { HelpText, Pill } from "../../styles"
import { useMoveNextOnEnter } from "../useMouseNextOnEnter"
import { RfqNlpExecutionStatus } from "./rfqExecutionTypes"
import { ExecutionWorkflow } from "./RfqExecutionWorkflow"
import { onNext, useRfqExecutionState } from "./state"

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
    case RfqNlpExecutionStatus.MissingData:
      return <Usage />
    case RfqNlpExecutionStatus.DataReady:
      return <Confirmation />
    default:
      return (
        <>
          <ExecutionWorkflow {...state} />
        </>
      )
  }
}
