import CurrencyPairUpdate from './currencyPairUpdate';

export default class CurrencyPairUpdates {
  _isStateOfTheWorld:boolean;
  _isStale:boolean;
  _currencyPairUpdates:Array<CurrencyPairUpdate>;

  constructor(isStateOfTheWorld:boolean, isStale:boolean, currencyPairUpdates:Array<CurrencyPairUpdate>) {
      this._isStateOfTheWorld = isStateOfTheWorld;
      this._isStale = isStale;
      this._currencyPairUpdates = currencyPairUpdates;
  }

  get isStateOfTheWorld():boolean{
      return this._isStateOfTheWorld;
    }

  get isStale():boolean{
      return this._isStale;
    }

  get currencyPairUpdates():Array<CurrencyPairUpdate>{
      return this._currencyPairUpdates;
  }
}
