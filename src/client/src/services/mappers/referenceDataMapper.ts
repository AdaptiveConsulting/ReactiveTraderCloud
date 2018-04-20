import * as _ from 'lodash'

import { CurrencyPair, CurrencyPairUpdate, CurrencyPairUpdates, UpdateType } from '../../types'

const referenceDataMapper = {
  mapCurrencyPairsFromDto(dto: any): CurrencyPairUpdates {
    const updates = referenceDataMapper.mapUpdatesFromDto(dto.Updates)
    return {
      isStateOfTheWorld: dto.IsStateOfTheWorld,
      isStale: dto.IsStale,
      currencyPairUpdates: updates,
    }
  },

  mapUpdatesFromDto(currencyPairUpdateDtos: any[]): CurrencyPairUpdate[] {
    return _.map(currencyPairUpdateDtos, (dto): CurrencyPairUpdate => {
      const updateType = referenceDataMapper.mapUpdateType(dto.UpdateType)
      const currencyPair = createCurrencyPair(
        dto.CurrencyPair.Symbol,
        dto.CurrencyPair.RatePrecision,
        dto.CurrencyPair.PipsPosition,
      )

      return {
        currencyPair,
        updateType,
      }
    })
  },

  mapUpdateType(updateTypeString: string): UpdateType {
    if (updateTypeString === UpdateType.Added) {
      return UpdateType.Added
    } else if (updateTypeString === UpdateType.Removed) {
      return UpdateType.Removed
    } else {
      throw new Error(`Unknown update type [${updateTypeString}]`)
    }
  }
}

export default referenceDataMapper

function createCurrencyPair(symbol, ratePrecision, pipsPosition): CurrencyPair {
  return {
    symbol,
    ratePrecision,
    pipsPosition,
    base: symbol.substr(0, 3),
    terms: symbol.substr(3, 3),
  }
}
