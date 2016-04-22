// TODO this should be called Side
class Direction {

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

Direction._buy = new Direction('Buy');
Direction._sell = new Direction('Sell');

export default Direction;
