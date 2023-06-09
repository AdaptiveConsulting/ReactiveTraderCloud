import { Context, joinChannel } from "@finos/fdc3"
import { useEffect } from "react"
import styled from "styled-components"

import { LimitCheckResultsTable } from "./LimitCheckResults"
import { LimitInputs } from "./LimitInputGrid"
import { checkLimit, LimitCheckerRequest } from "./state"

const contextHandler = (context: Context) => {
  if (context) checkLimit(context.id as unknown as LimitCheckerRequest)
}

window.fdc3.addContextListener("check-limit", contextHandler)

joinChannel("green")

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const LimitChecker = () => {
  useEffect(() => {
    window.fdc3.broadcast({
      type: "limit-checker-status",
      id: { isAlive: "true" },
    })
  }, [])

  return (
    <Container>
      <LimitInputs />
      <LimitCheckResultsTable />
    </Container>
  )
}

export default LimitChecker
