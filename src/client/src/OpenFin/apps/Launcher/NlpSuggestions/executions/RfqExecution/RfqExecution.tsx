import { NlpExecutionStatus, onNext, useRfqExecutionIntent } from "./state"

const ExecuteButtons = () => <button onClick={onNext}>Execute</button>

export const RfqExecution = () => {
  const state = useRfqExecutionIntent()

  switch (state.type) {
    case NlpExecutionStatus.MissingData:
      return <div>Missing Data</div>
    case NlpExecutionStatus.DataReady:
      return (
        <>
          <div>Data Ready</div>
          <ExecuteButtons />
        </>
      )
    case NlpExecutionStatus.WaitingToExecute:
      return <div>Waiting to Execute</div>
    case NlpExecutionStatus.Done:
      return <div>Done</div>
    default:
      return <div>default</div>
  }
}
