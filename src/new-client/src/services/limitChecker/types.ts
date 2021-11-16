import { Observable } from "rxjs"

export type checkLimitFn = (message: {
  tradedCurrencyPair: string
  notional: number
  rate: number
}) => Observable<boolean>
