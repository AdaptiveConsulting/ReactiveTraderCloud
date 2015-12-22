export default class SpotPrice {
  _symbol:string;
  _bid:Number;
  _ask:Number;
  _mid:Number;
  _valueDate:Date;
  _creationTimestamp:Number;

  constructor(symbol:Number, bid:Number, ask:Number, mid:Number, valueDate:Date, creationTimestamp:Number) {
    this._symbol = symbol;
    this._bid = bid;
    this._ask = ask;
    this._mid = mid;
    this._valueDate = valueDate;
    this._creationTimestamp = creationTimestamp;
  }

  get symbol() {
    return this._symbol;
  }

  get bid() {
    return this._bid;
  }

  get ask() {
    return this._ask;
  }

  get mid() {
    return this._mid;
  }

  get valueDate() {
    return this._valueDate;
  }

  get creationTimestamp() {
    return this._creationTimestamp;
  }
}
