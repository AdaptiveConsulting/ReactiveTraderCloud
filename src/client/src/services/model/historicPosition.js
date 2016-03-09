export default class HistoricPosition {
  _timestamp:Date;
  _usdPnl:number;

  constructor(timestamp:Date, usdPnl:number) {
    this._timestamp = timestamp;
    this._usdPnl = usdPnl;
  }

  get timestamp():Date {
    return this._timestamp;
  }

  get usdPnl():number {
    return this._usdPnl;
  }
}
