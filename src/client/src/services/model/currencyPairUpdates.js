import CurrencyPairUpdate from './currencyPairUpdate';

export default class CurrencyPairUpdates {
  _isStateOfTheWorld:Boolean;
  _isStale:Boolean;
  _currencyPairUpdates:Array<CurrencyPairUpdate>;

  constructor(isStateOfTheWorld:Boolean, isStale:Boolean, currencyPairUpdates:Array<CurrencyPairUpdate>) {
      this._isStateOfTheWorld = isStateOfTheWorld;
      this._isStale = isStale;
      this._currencyPairUpdates = currencyPairUpdates;
  }

  get isStateOfTheWorld():Boolean{
      return this._isStateOfTheWorld;
    }

  get isStale():Boolean{
      return this._isStale;
    }

  get currencyPairUpdates():Array<CurrencyPairUpdate>{
      return this._currencyPairUpdates;
  }
}
