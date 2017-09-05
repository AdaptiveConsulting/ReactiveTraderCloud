import * as _ from 'lodash'

import CurrencyPairUpdates from '../model/currencyPairUpdates'
import CurrencyPairUpdate from '../model/currencyPairUpdate'
import CurrencyPair from '../model/currencyPair'
import { UpdateType } from '../model/index'

export default class ReferenceDataMapper {
  mapCurrencyPairsFromDto(dto: any): CurrencyPairUpdates {
    const updates = this._mapUpdatesFromDto(dto.Updates)
    return new CurrencyPairUpdates(
      dto.IsStateOfTheWorld,
      dto.IsStale,
      updates,
    )
  }

  _mapUpdatesFromDto(currencyPairUpdateDtos: Array<any>): Array<CurrencyPairUpdate> {
    return _.map(currencyPairUpdateDtos, dto => {
      const updateType = this._mapUpdateType(dto.UpdateType)
      const currencyPair = this._mapFromCurrencyPairFromDto(dto.CurrencyPair)
      return new CurrencyPairUpdate(updateType, currencyPair)
    })
  }

  _mapFromCurrencyPairFromDto(currencyPairDto: any): any {
    return new CurrencyPair(
      currencyPairDto.Symbol,
      currencyPairDto.RatePrecision,
      currencyPairDto.PipsPosition,
    )
  }

  _mapUpdateType(updateTypeString: any): UpdateType {
    if (updateTypeString === UpdateType.Added.name) {
      return UpdateType.Added
    } else if (updateTypeString === UpdateType.Removed.name) {
      return UpdateType.Removed
    } else {
      throw new Error(`Unknown update type [${updateTypeString}]`)
    }
  }
}
