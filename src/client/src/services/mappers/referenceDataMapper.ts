import * as _ from 'lodash'

import { CurrencyPair, CurrencyPairUpdate, CurrencyPairUpdates, UpdateType } from '../../types'

export default class ReferenceDataMapper {
  mapCurrencyPairsFromDto(dto: any): CurrencyPairUpdates {
    const updates = this._mapUpdatesFromDto(dto.Updates)
    return {
      isStateOfTheWorld: dto.IsStateOfTheWorld,
      isStale: dto.IsStale,
      currencyPairUpdates: updates,
    }
  }

  _mapUpdatesFromDto(currencyPairUpdateDtos: Array<any>): Array<CurrencyPairUpdate> {
    return _.map(currencyPairUpdateDtos, (dto): CurrencyPairUpdate => {
      const updateType = this._mapUpdateType(dto.UpdateType)
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
  }

  _mapUpdateType(updateTypeString: string): UpdateType {
    if (updateTypeString === UpdateType.Added) {
      return UpdateType.Added
    } else if (updateTypeString === UpdateType.Removed) {
      return UpdateType.Removed
    } else {
      throw new Error(`Unknown update type [${updateTypeString}]`)
    }
  }
}

function createCurrencyPair(symbol, ratePrecision, pipsPosition): CurrencyPair {
  return {
    symbol,
    ratePrecision,
    pipsPosition,
    base: symbol.substr(0, 3),
    terms: symbol.substr(3, 3),
  }
}
