import { withConnection } from './connection'
import { CurrencyPair, ReferenceDataService } from '../generated/TradingGateway'
import { map, scan } from 'rxjs/operators'

export const currencyPairs$ = ReferenceDataService.getCcyPairs().pipe(
  withConnection(),
  scan(
    (acc, data) => {
      const { updates } = data
      const result = { ...acc }
      updates.forEach(({ type, payload }) => {
        const { symbol } = payload
        if (type === 'removed') {
          delete result[symbol]
        } else {
          result[symbol] = payload
        }
      })
      return result
    },
    {} as Record<string, CurrencyPair>
  )
)

export const currencyPairSymbols$ = currencyPairs$.pipe(map(ccyPairs => Object.keys(ccyPairs)))
