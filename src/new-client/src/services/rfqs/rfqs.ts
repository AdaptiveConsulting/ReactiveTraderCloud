import { forkJoin } from "rxjs"
import { delay, map, take } from "rxjs/operators"
import { getCurrencyPair$ } from "../currencyPairs"
import { getPrice$ } from "../prices"
import type { RfqRequest, RfqResponse } from "./types"

const mockRfqBackendCommunication = ({ symbol, notional }: RfqRequest) =>
  forkJoin([
    getPrice$(symbol).pipe(take(1)),
    getCurrencyPair$(symbol).pipe(take(1)),
  ]).pipe(
    delay(500 + Math.floor(Math.random() * 500)),
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
      } as RfqResponse
    }),
  )

export const rfq$ = (rfqRequest: RfqRequest) =>
  mockRfqBackendCommunication(rfqRequest)
