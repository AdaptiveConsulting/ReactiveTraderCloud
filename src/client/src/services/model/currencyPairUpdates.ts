import CurrencyPairUpdate from './currencyPairUpdate';

export default class CurrencyPairUpdates {

  constructor(isStateOfTheWorld: boolean, isStale: boolean, currencyPairUpdates: Array<CurrencyPairUpdate>) {
    this._isStateOfTheWorld = isStateOfTheWorld;
    this._isStale = isStale;
    this._currencyPairUpdates = currencyPairUpdates;
  }

  _isStateOfTheWorld: boolean;

  get isStateOfTheWorld(): boolean {
    return this._isStateOfTheWorld;
  }

  _isStale: boolean;

  get isStale(): boolean {
    return this._isStale;
  }

  _currencyPairUpdates: Array<CurrencyPairUpdate>;

  get currencyPairUpdates(): Array<CurrencyPairUpdate> {
    return this._currencyPairUpdates;
  }
}
