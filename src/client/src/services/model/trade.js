import { Direction, TradeStatus, CurrencyPair } from './';

export default class Trade {
  _tradeId:number;
  _traderName:string;
  _currencyPair:CurrencyPair;
  _notional:number;
  _dealtCurrency:string;
  _direction:string;
  _spotRate:number;
  _tradeDate:Date;
  _valueDate:Date;
  _status:TradeStatus;
  _isNew: boolean;
  constructor(
    tradeId:number,
    traderName:string,
    currencyPair:CurrencyPair,
    notional:number,
    dealtCurrency:string,
    direction:Direction,
    spotRate:number,
    tradeDate:Date,
    valueDate:string,
    status:TradeStatus,
    isNew:boolean
  ) {
    this._tradeId = tradeId;
    this._traderName = traderName;
    this._currencyPair = currencyPair;
    this._notional = notional;
    this._dealtCurrency = dealtCurrency;
    this._direction = direction;
    this._spotRate = spotRate;
    this._tradeDate = tradeDate;
    this._valueDate = valueDate;
    this._status = status;
    this._isNew = isNew;
  }

  get tradeId():number {
    return this._tradeId;
  }

  get traderName():string {
    return this._traderName;
  }

  get currencyPair():CurrencyPair {
    return this._currencyPair;
  }

  get notional():number {
    return this._notional;
  }

  get dealtCurrency():string {
    return this._dealtCurrency;
  }

  get direction():Direction {
    return this._direction;
  }

  get spotRate():number {
    return this._spotRate;
  }

  get tradeDate():Date {
    return this._tradeDate;
  }

  get valueDate():Date {
    return this._valueDate;
  }

  get status():TradeStatus {
    return this._status;
  }

  get isNew():boolean {
    return this._isNew;
  }

  set isNew(val: boolean) {
    this._isNew = val;
  }
}
