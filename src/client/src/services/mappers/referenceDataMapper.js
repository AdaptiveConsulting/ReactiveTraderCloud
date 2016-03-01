import _ from 'lodash';
import { CurrencyPairUpdates, CurrencyPairUpdate, CurrencyPair, UpdateType } from '../model';

export default class ReferenceDataMapper {
  mapCurrencyPairsFromDto(dto) : CurrencyPairUpdates {
    let updates = this._mapUpdatesFromDto(dto.Updates);
    return new CurrencyPairUpdates(
      dto.IsStateOfTheWorld,
      dto.IsStale,
      updates
    );
  }

  _mapUpdatesFromDto(currencyPairUpdateDtos:Array<Object>) : Array<CurrencyPairUpdate> {
      return _.map(currencyPairUpdateDtos, dto => {
          let updateType = this._mapUpdateType(dto.UpdateType);
          let currencyPair = this._mapFromCurrencyPairFromDto(dto.CurrencyPair);
          return new CurrencyPairUpdate(updateType, currencyPair);
        });
  }

  _mapFromCurrencyPairFromDto(currencyPairDto:Object) : CurrencyPairUpdate {
    return new CurrencyPair(
      currencyPairDto.Symbol,
      currencyPairDto.RatePrecision,
      currencyPairDto.PipsPosition
    );
  }

  _mapUpdateType(updateTypeString:Object) : UpdateType {
    if(updateTypeString === UpdateType.Added.name) {
      return UpdateType.Added;
    } else if(updateTypeString === UpdateType.Removed.name) {
      return UpdateType.Removed;
    } else {
      throw new Error(`Unknown update type [${updateTypeString}]`);
    }
  }
}
