import { PriceMovementType, Rate, Spread } from './';

export default class SpotPrice {
  _symbol:string;
  _bid:Rate;
  _ask:Rate;
  _mid:Rate;
  _valueDate:Date;
  _creationTimestamp:number;
  _priceMovementType:PriceMovementType;
  _spread:number;
  _isTradable:boolean;

  constructor(
    symbol:number,
    bid:Rate,
    ask:Rate,
    mid:Rate,
    valueDate:Date,
    creationTimestamp:number,
    priceMovementType:PriceMovementType,
    spread:Spread,
    isTradable:boolean
  ) {
    this._symbol = symbol;
    this._bid = bid;
    this._ask = ask;
    this._mid = mid;
    this._valueDate = valueDate;
    this._creationTimestamp = creationTimestamp;
    this._priceMovementType = priceMovementType;
    this._spread = spread;
    this._isTradable = isTradable;
  }

  // in the real world there'd be a price id on here somewhere!!

  get symbol() : string {
    return this._symbol;
  }

  get bid() : Rate {
    return this._bid;
  }

  get ask() : Rate {
    return this._ask;
  }

  get mid() : Rate {
    return this._mid;
  }

  get spread() : Spread {
    return this._spread;
  }

  get valueDate() : Date {
    return this._valueDate;
  }

  get creationTimestamp() : Date {
    return this._creationTimestamp;
  }

  get priceMovementType() : PriceMovementType {
    return this._priceMovementType;
  }

  get isTradable() : Boolean {
    return this._isTradable;
  }
}
