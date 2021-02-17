import { forkJoin } from "rxjs"
import { delay, map } from "rxjs/operators"
import { getCurrencyPair$ } from "../currencyPairs"
import { getPrice$ } from "../prices"
import type { RfqRequest } from "./types"

const mockQuoteBackend = ({ symbol, notional }: RfqRequest) => {
  return forkJoin([getPrice$(symbol), getCurrencyPair$(symbol)]).pipe(
    map(([{ ask, bid, ...prices }, currencyPair]) => {
      const priceChange = 0.3 / Math.pow(10, currencyPair.pipsPosition)
      return {
        notional,
        currencyPair,
        price: {
          ...prices,
          ask: ask + priceChange,
          bid: bid - priceChange,
        },
        time: Date.now(),
        timeout: 10_000,
      }
    }),
    delay(500 + Math.floor(Math.random() * 500)),
  )
}

export const rfq$ = (rfqRequest: RfqRequest) => mockQuoteBackend(rfqRequest)
