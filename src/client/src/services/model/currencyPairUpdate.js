import UpdateType from './updateType';
import CurrencyPair from './currencyPair';

export default class CurrencyPairUpdate {
  _updateType:UpdateType;
  _currencyPair:CurrencyPair;

  constructor(updateType:UpdateType, currencyPair:CurrencyPair) {
    this._updateType = updateType;
    this._currencyPair = currencyPair;
  }

  get updateType():UpdateType {
    return this._updateType;
  }

  get currencyPair():CurrencyPair {
    return this._currencyPair;
  }
}
