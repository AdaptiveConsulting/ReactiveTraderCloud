// TODO this should be called Side
export default class Direction {

  static _buy = new Direction('Buy');
  static _sell = new Direction('Sell');

  name:string;

  static get Buy() {
    return this._buy;
  }

  static get Sell() {
    return this._sell;
  }

  constructor(name:string) {
    this.name = name;
  }
}
