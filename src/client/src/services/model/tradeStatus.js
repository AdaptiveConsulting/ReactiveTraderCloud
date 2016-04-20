class TradeStatus {

  name:string;

  static get Pending() {
    return this._pending;
  }

  static get Done() {
    return this._done;
  }

  static get Rejected() {
    return this._rejected;
  }

  constructor(name:string) {
    this.name = name;
  }
}

TradeStatus._pending = new TradeStatus('Pending');
TradeStatus._done = new TradeStatus('Done');
TradeStatus._rejected = new TradeStatus('Rejected');

export default TradeStatus;
