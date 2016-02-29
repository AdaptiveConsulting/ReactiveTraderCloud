import CurrencyPairUpdate from './currencyPairUpdate';

export default class CurrencyPairUpdates {
  _isStateOfTheWorld:Boolean;
  _isStale:Boolean;
  _currencyPairUpdateDto:Array<CurrencyPairUpdate>;

  constructor(isStateOfTheWorld:Boolean, isStale:Boolean, currencyPairUpdateDto:Array<CurrencyPairUpdate>) {
      this._isStateOfTheWorld = isStateOfTheWorld;
      this._isStale = isStale;
      this._currencyPairUpdateDto = currencyPairUpdateDto;
  }

  get isStateOfTheWorld():Boolean{
      return this._isStateOfTheWorld;
    }

  get isStale():Boolean{
      return this._isStale;
    }

  get currencyPairUpdate():Array<CurrencyPairUpdate>{
      return this._currencyPairUpdateDto;
  }
}
