import { Observable } from "rxjs"

export type CheckLimitStreamGenerator = (message: {
  tradedCurrencyPair: string
  notional: number
  rate: number
}) => Observable<boolean>
