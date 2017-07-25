// TODO this should be called Side
// TODO: this should be a Typescript enum
class Direction {

  name;

  constructor(name) {
    this.name = name;
  }

  static get Buy() {
    return this._buy;
  }

  static get Sell() {
    return this._sell;
  }
}

Direction._buy = new Direction('Buy');
Direction._sell = new Direction('Sell');

export default Direction;
