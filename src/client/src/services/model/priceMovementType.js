export default class PriceMovementType {

  static _none = new PriceMovementType('None');
  static _up = new PriceMovementType('Up');
  static _down = new PriceMovementType('Down');

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
