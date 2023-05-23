import { useEffect } from "react"

import { LimitCheckResultsTable } from "./LimitCheckResults"
import { LimitInputs } from "./LimitInputs"
import { checkLimit } from "./state"

export interface LimitCheckerRequest {
  id: number
  responseTopic: string
  tradedCurrencyPair: string
  notional: number
  rate: number
}

export const LimitChecker = () => {
  useEffect(() => {
    fin.InterApplicationBus.subscribe(
      { uuid: "*" },
      "request-limit-check",
      checkLimit,
    )

    fin.InterApplicationBus.publish("request-limit-check-status", "ALIVE")

    return () => {
      fin.InterApplicationBus.unsubscribe(
        { uuid: "*" },
        "request-limit-check",
        checkLimit,
      )
    }
  }, [])
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <LimitInputs />
      <LimitCheckResultsTable />
    </div>
  )
}
