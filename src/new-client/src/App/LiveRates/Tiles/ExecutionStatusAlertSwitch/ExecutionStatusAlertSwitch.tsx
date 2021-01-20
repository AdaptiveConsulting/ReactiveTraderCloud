import { useExecution, ExecutionStatus } from "services/executions"
import { SymbolContext } from "../Tile"
import { Done, Rejected, TakingTooLong, RequestTimeout } from "./Response"
import Pending from "./Pending"
import { useContext } from "react"

const ExecutionStatusAlertSwitch = () => {
  const symbol = useContext(SymbolContext)
  const { status } = useExecution(symbol)

  switch (status) {
    case ExecutionStatus.Ready:
      return null
    case ExecutionStatus.Pending:
      return <Pending />
    case ExecutionStatus.Done:
      return <Done />
    case ExecutionStatus.TakingTooLong:
      return <TakingTooLong />
    case ExecutionStatus.RequestTimeout:
      return <RequestTimeout />
    case ExecutionStatus.Rejected:
      return <Rejected />
  }
}

export default ExecutionStatusAlertSwitch
