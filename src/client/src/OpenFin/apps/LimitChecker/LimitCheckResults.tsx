import styled from "styled-components"

import { TradesGrid } from "@/App/Trades/TradesGrid"
import {
  limitCheckerColDef,
  limitCheckerColFields,
} from "@/App/Trades/TradesState/colConfig"

import { tableRows$ } from "./state"

const Container = styled.div`
  display: flex;
  flex: 1;
  padding: 0 10px 20px 10px;
`

export const LimitCheckResultsTable = () => {
  return (
    <Container>
      <TradesGrid
        columnFields={limitCheckerColFields}
        columnDefinitions={limitCheckerColDef}
        trades$={tableRows$}
        caption="Trade Table"
        highlightedRow={null}
        section="limitChecker"
      />
    </Container>
  )
}
