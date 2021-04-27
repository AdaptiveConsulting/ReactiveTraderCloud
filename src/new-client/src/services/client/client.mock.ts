import { Observable } from "rxjs"

const mockTrade = {
  Trades: [
    {
      TradeId: 1,
      TraderName: "EDO",
      CurrencyPair: "EURUSD",
      Notional: 1000000.0,
      DealtCurrency: "USD",
      Direction: "Sell",
      SpotRate: 1.2082,
      TradeDate: "2021-04-27T03:22:09.6095015+00:00",
      ValueDate: "2021-04-29T03:22:09.6098209+00:00",
      Status: "Done",
    },
  ],
  IsStateOfTheWorld: true,
  IsStale: false,
}

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
    default:
      return new Observable<TResponse>()
  }
}
