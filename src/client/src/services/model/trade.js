export default class Trade {
  _tradeId:Number;
  _traderName:String;
  _currencyPair:String;
  _notional:Number;
  _dealtCurrency:String;
  _direction:String;
  _spotRate:Number;
  _tradeDate:Date;
  _formattedValueDate:Date;
  _status:String;

  constructor(tradeId:Number, traderName:String, currencyPair:String, notional:Number, dealtCurrency:String, direction:String, spotRate:Number, tradeDate:Date, formattedValueDate:String, status:String) {
    this._tradeId = tradeId;
    this._traderName = traderName;
    this._currencyPair = currencyPair;
    this._notional = notional;
    this._dealtCurrency = dealtCurrency;
    this._direction = direction;
    this._spotRate = spotRate;
    this._tradeDate = tradeDate;
    this._formattedValueDate = formattedValueDate;
    this._status = status;
  }

  get tradeId():Number {
    return this._tradeId;
  }

  get traderName():String {
    return this._traderName;
  }

  get currencyPair():String {
    return this._currencyPair;
  }

  get notional():Number {
    return this._notional;
  }

  get dealtCurrency():String {
    return this._dealtCurrency;
  }

  get direction():String {
    return this._direction;
  }

  get spotRate():Number {
    return this._spotRate;
  }

  get tradeDate():Date {
    return this._tradeDate;
  }

  get formattedValueDate():Date {
    return this._formattedValueDate;
  }

  get status():String {
    return this._status;
  }
}
