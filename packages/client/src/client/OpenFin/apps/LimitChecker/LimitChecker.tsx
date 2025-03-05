import { Context, joinChannel } from "@finos/fdc3"
import { Subscribe } from "@react-rxjs/core"
import { useEffect } from "react"
import styled from "styled-components"

import { Stack } from "@/client/components/Stack"

import { LimitCheckResultsTable } from "./LimitCheckResults"
import { LimitInputs } from "./LimitInputList"
import { checkLimit, LimitCheckerRequest } from "./state"

const contextHandler = (context: Context) => {
  if (context) checkLimit(context.id as unknown as LimitCheckerRequest)
}

window.fdc3.addContextListener("check-limit", contextHandler)

joinChannel("green")

const Container = styled(Stack)`
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
      <Subscribe>
        <LimitInputs />
        <LimitCheckResultsTable />
      </Subscribe>
    </Container>
  )
}

export default LimitChecker
