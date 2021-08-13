import { Observable } from "rxjs"
import { mockAnalytics } from "./mockData/mockAnalytics"
import { mockPriceHistory } from "./mockData/mockPriceHistory"
import { mockCurrencyPair } from "./mockData/mockCurrencyPair"
import { mockTrade } from "./mockData/mockTrade"

export const getStream$ = <TResponse, TPayload = {}>(
  service: string,
  operationName: string,
  payload: TPayload,
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
  service: string,
  operationName: string,
  payload: TPayload,
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
