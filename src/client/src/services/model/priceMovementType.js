class PriceMovementType {

  name:string;

  static get None() {
    return this._none;
  }

  static get Up() {
    return this._up;
  }

  static get Down() {
    return this._down;
  }

  constructor(name:string) {
    this.name = name;
  }
}

PriceMovementType._none = new PriceMovementType('None');
PriceMovementType._up = new PriceMovementType('Up');
PriceMovementType._down = new PriceMovementType('Down');

export default PriceMovementType;
