import { Observable } from "rxjs"

import { mockAnalytics } from "./mockData/analytics.mock"
import { mockCurrencyPair } from "./mockData/currencyPairs.mock"
import { mockPriceHistory } from "./mockData/priceHistory.mock"
import { mockTrade } from "./mockData/trade.mock"

export const getStream$ = <TResponse, TPayload = Record<string, unknown>>(
  _service: string,
  operationName: string,
  _payload: TPayload,
): Observable<TResponse> => {
  switch (operationName) {
    case "getTradesStream":
      return new Observable<any>((observable) => {
        observable.next(mockTrade)
      })
    case "getAnalytics":
      return new Observable<any>((observable) => {
        observable.next(mockAnalytics)
      })
    case "getCurrencyPairUpdatesStream":
      return new Observable<any>((observable) => {
        observable.next(mockCurrencyPair)
      })
    default:
      return new Observable<TResponse>()
  }
}

export const getRemoteProcedureCall$ = <TResponse, TPayload>(
  _service: string,
  operationName: string,
  _payload: TPayload,
): Observable<TResponse> => {
  switch (operationName) {
    case "getPriceHistory":
      return new Observable<any>((observable) => {
        observable.next(mockPriceHistory)
      })
    default:
      return new Observable<TResponse>()
  }
}
