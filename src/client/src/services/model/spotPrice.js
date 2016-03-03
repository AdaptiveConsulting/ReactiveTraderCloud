import { PriceMovementType, Rate } from './';

export default class SpotPrice {
  _symbol:string;
  _bid:Rate;
  _ask:Rate;
  _mid:Rate;
  _valueDate:Date;
  _creationTimestamp:Number;
  _priceMovementType:PriceMovementType;

  constructor(
    symbol:Number,
    bid:Rate,
    ask:Rate,
    mid:Rate,
    valueDate:Date,
    creationTimestamp:Number,
    priceMovementType:PriceMovementType
  ) {
    this._symbol = symbol;
    this._bid = bid;
    this._ask = ask;
    this._mid = mid;
    this._valueDate = valueDate;
    this._creationTimestamp = creationTimestamp;
    this._priceMovementType = priceMovementType;
  }

  static get empty() : SpotPrice {
    var spotPrice = new SpotPrice();
    spotPrice._priceMovementType = PriceMovementType.None;
    return spotPrice
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
