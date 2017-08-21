export default class HistoricPosition {
  constructor(timestamp: Date, usdPnl: number) {
    this._timestamp = timestamp;
    this._usdPnl = usdPnl;
  }

  _timestamp: Date;

  get timestamp(): Date {
    return this._timestamp;
  }

  _usdPnl: number;

  get usdPnl(): number {
    return this._usdPnl;
  }
}
