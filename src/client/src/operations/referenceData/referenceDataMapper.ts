import { CollectionUpdate, CollectionUpdates, CurrencyPair, CurrencyPairUpdate, CurrencyPairUpdates } from 'rt-types'

export interface CurrencyRaw {
  Symbol: string
  RatePrecision: number
  PipsPosition: number
}

export interface RawCurrencyPairUpdate extends CollectionUpdate {
  CurrencyPair: CurrencyRaw
}

export interface RawCurrencyPairUpdates extends CollectionUpdates {
  Updates: RawCurrencyPairUpdate[]
}

const referenceDataMapper = {
  mapCurrencyPairsFromDto(dto: RawCurrencyPairUpdates): CurrencyPairUpdates {
    const updates = referenceDataMapper.mapUpdatesFromDto(dto.Updates)
    return {
      isStateOfTheWorld: dto.IsStateOfTheWorld,
      isStale: dto.IsStale,
      currencyPairUpdates: updates
    }
  },

  mapUpdatesFromDto(currencyPairUpdateDtos: RawCurrencyPairUpdate[]): CurrencyPairUpdate[] {
    return currencyPairUpdateDtos.map<CurrencyPairUpdate>(dto => {
      const updateType = dto.UpdateType
      const currencyPair = createCurrencyPair(
        dto.CurrencyPair.Symbol,
        dto.CurrencyPair.RatePrecision,
        dto.CurrencyPair.PipsPosition
      )

      return {
        currencyPair,
        updateType
      }
    })
  }
}

export default referenceDataMapper

function createCurrencyPair(symbol: string, ratePrecision: number, pipsPosition: number): CurrencyPair {
  return {
    symbol,
    ratePrecision,
    pipsPosition,
    base: symbol.substr(0, 3),
    terms: symbol.substr(3, 3)
  }
}
