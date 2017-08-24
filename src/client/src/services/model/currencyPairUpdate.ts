import CurrencyPair from './currencyPair';
import { UpdateType } from './index';

export default class CurrencyPairUpdate {
  constructor(updateType, currencyPair) {
    this._updateType = updateType;
    this._currencyPair = currencyPair;
  }

  _updateType: UpdateType;

  get updateType() {
    return this._updateType;
  }

  _currencyPair: CurrencyPair;

  get currencyPair() {
    return this._currencyPair;
  }
}
