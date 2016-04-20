export default class TradeStatus {

  static _pending = new TradeStatus('Pending');
  static _done = new TradeStatus('Done');
  static _rejected = new TradeStatus('Rejected');

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

  toString() {
    return this.name;
  }
}

