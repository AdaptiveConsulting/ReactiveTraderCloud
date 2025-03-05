import { scan, share } from "rxjs"
import styled from "styled-components"

import { GridRegion } from "@/client/App/Trades/GridRegion"
import {
  limitCheckerColDef,
  limitCheckerColFields,
} from "@/client/App/Trades/TradesState/colConfig"
import { LimitCheckStatus, LimitCheckTrade } from "@/services/trades/types"

import { limitResult$ } from "./state"

let tradeId = 0

const tableRows$ = limitResult$.pipe(
  scan((acc, { limit, notional, request, result }) => {
    return [
      {
        status: result ? LimitCheckStatus.Success : LimitCheckStatus.Failure,
        tradeId: tradeId++,
        symbol: request.tradedCurrencyPair,
        notional,
        limit,
        spotRate: request.rate,
      },
      ...acc,
    ]
  }, [] as LimitCheckTrade[]),
  share(),
)

const Container = styled.div`
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
  display: flex;
  flex: 1;
  padding: 0 10px 20px 10px;
`

export const LimitCheckResultsTable = () => {
  return (
    <Container>
      <GridRegion
        columnFields={limitCheckerColFields}
        columnDefinitions={limitCheckerColDef}
        trades$={tableRows$}
        caption="Trade Table"
        highlightedRow={null}
        showHeaderTools={false}
        title="Limit Check Results"
      />
    </Container>
  )
}
