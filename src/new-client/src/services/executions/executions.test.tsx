import { whenRpc, getRemoteProcedureCall$, reset } from "utils/mockClient"

import {
  ExecutionTrade,
  ExecutionPayload,
  ExecutionRequest,
  ExecutionResponse,
  ExecutionStatus,
  RawExecutionStatus,
} from "./types"
import { Direction } from "../trades"
import { execute$ } from "./executions"
import { testScheduler } from "utils/testScheduler"

const inputRequest: ExecutionRequest = {
  currencyPair: "EURUSD",
  dealtCurrency: "EUR",
  direction: Direction.Buy,
  notional: 1000000,
  spotRate: 1.20229,
  id: "9b7a2078-f09d-4673-a396-16e901c30915",
}

const rawRequest: ExecutionPayload = {
  CurrencyPair: "EURUSD",
  DealtCurrency: "EUR",
  Direction: Direction.Buy,
  Notional: 1000000,
  SpotRate: 1.20229,
  id: "9b7a2078-f09d-4673-a396-16e901c30915",
}

const rawResponse: ExecutionResponse = {
  Trade: {
    ...rawRequest,
    Status: RawExecutionStatus.Done,
    TradeDate: "2021-02-02T13:17:28.0407085+00:00",
    ValueDate: "2021-02-04T13:17:28.040711+00:00",
    TradeId: 200,
    TraderName: "LMO",
  },
}

const expectedResponse: ExecutionTrade = {
  ...inputRequest,
  valueDate: "2021-02-04T13:17:28.040711+00:00",
  tradeId: 200,
  status: ExecutionStatus.Done,
}

describe("services/executions", () => {
  it("returns an ExecutionTrade when there is a valid response", () => {
    expect(getRemoteProcedureCall$.mock.calls.length).toBe(0)

    const executeStream$ = execute$(inputRequest)

    expect(getRemoteProcedureCall$.mock.calls.length).toBe(1)
    expect(getRemoteProcedureCall$.mock.calls[0][0]).toBe("execution")
    expect(getRemoteProcedureCall$.mock.calls[0][1]).toBe("executeTrade")
    expect(getRemoteProcedureCall$.mock.calls[0][2]).toEqual(rawRequest)

    testScheduler().run(({ expectObservable, cold }) => {
      const input = cold("    ---(a|)", { a: rawResponse })
      const expectedOutput = "---(r|)"

      reset()
      whenRpc("execution", "executeTrade", rawRequest, input)
      expectObservable(executeStream$).toBe(expectedOutput, {
        r: expectedResponse,
      })
    })
  })

  it("returns a TimeoutExecution when the response takes longer than 30 secs to arrive", () => {
    expect(getRemoteProcedureCall$.mock.calls.length).toBe(0)

    const executeStream$ = execute$(inputRequest)

    expect(getRemoteProcedureCall$.mock.calls.length).toBe(1)
    expect(getRemoteProcedureCall$.mock.calls[0][0]).toBe("execution")
    expect(getRemoteProcedureCall$.mock.calls[0][1]).toBe("executeTrade")
    expect(getRemoteProcedureCall$.mock.calls[0][2]).toEqual(rawRequest)

    testScheduler().run(({ expectObservable, cold }) => {
      const input = cold("    30s (a|)", { a: rawResponse })
      const expectedOutput = "30s (r|)"

      reset()
      whenRpc("execution", "executeTrade", rawRequest, input)
      expectObservable(executeStream$).toBe(expectedOutput, {
        r: expectedResponse,
      })
    })

    testScheduler().run(({ expectObservable, cold }) => {
      const input = cold("    30s -(a|)", { a: rawResponse })
      const expectedOutput = "30s (r|)"

      reset()
      whenRpc("execution", "executeTrade", rawRequest, input)
      expectObservable(executeStream$).toBe(expectedOutput, {
        r: { ...inputRequest, status: ExecutionStatus.Timeout },
      })
    })
  })
})
