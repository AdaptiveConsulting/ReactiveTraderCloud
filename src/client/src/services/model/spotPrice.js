import { PriceMovementType, Rate } from './';

export default class SpotPrice {
  _symbol:string;
  _bid:Rate;
  _ask:Rate;
  _mid:Rate;
  _valueDate:Date;
  _creationTimestamp:Number;
  _priceMovementType:PriceMovementType;
  _spread:Number;

  constructor(
    symbol:Number,
    bid:Rate,
    ask:Rate,
    mid:Rate,
    valueDate:Date,
    creationTimestamp:Number,
    priceMovementType:PriceMovementType,
    spread:Number
  ) {
    this._symbol = symbol;
    this._bid = bid;
    this._ask = ask;
    this._mid = mid;
    this._valueDate = valueDate;
    this._creationTimestamp = creationTimestamp;
    this._priceMovementType = priceMovementType;
    this._spread = spread;
  }

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

  get spread() : Number {
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
}
