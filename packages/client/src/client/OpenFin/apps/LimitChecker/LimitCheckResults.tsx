import { TradesGrid } from "client/App/Trades/TradesGrid"
import {
  limitCheckerColDef,
  limitCheckerColFields,
} from "client/App/Trades/TradesState/colConfig"
import { scan, share } from "rxjs"
import { LimitCheckStatus, LimitCheckTrade } from "services/trades/types"
import styled from "styled-components"

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
  background-color: ${({ theme }) => theme.core.darkBackground};
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
        showHeaderTools={false}
        title="Limit Check Results"
      />
    </Container>
  )
}
