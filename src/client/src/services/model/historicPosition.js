export default class HistoricPosition {
  _timestamp:Date;
  _usdPnl:Number;

  constructor(timestamp:Date, usdPnl:Number) {
    this._timestamp = timestamp;
    this._usdPnl = usdPnl;
  }

  get timestamp():Date {
    return this._timestamp;
  }

  get usdPnl():Number {
    return this._usdPnl;
  }
}
