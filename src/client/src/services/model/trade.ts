import CurrencyPair from './currencyPair';

export default class Trade {
  constructor(tradeId: number,
              traderName: string,
              currencyPair: CurrencyPair,
              notional: number,
              dealtCurrency: string,
              direction: any,
              spotRate: number,
              tradeDate: Date,
              valueDate: Date,
              status: any) {
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
  }

  _tradeId: number;

  get tradeId(): number {
    return this._tradeId;
  }

  _traderName: string;

  get traderName(): string {
    return this._traderName;
  }

  _currencyPair: CurrencyPair;

  get currencyPair(): CurrencyPair {
    return this._currencyPair;
  }

  _notional: number;

  get notional(): number {
    return this._notional;
  }

  _dealtCurrency: string;

  get dealtCurrency(): string {
    return this._dealtCurrency;
  }

  _direction: string;

  get direction(): any {
    return this._direction;
  }

  _spotRate: number;

  get spotRate(): number {
    return this._spotRate;
  }

  _tradeDate: Date;

  get tradeDate(): Date {
    return this._tradeDate;
  }

  _valueDate: Date;

  get valueDate(): Date {
    return this._valueDate;
  }

  _status: any;

  get status(): any {
    return this._status;
  }
}
