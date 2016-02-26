export default class UpdateType {

  static _added = new UpdateType('Added');
  static _removed = new UpdateType('Removed');

  name:string;

  static get Added() {
    return this._reset;
  }

  static get Removed() {
    return this._stateOfTheWorld;
  }

  constructor(name:string) {
    this.name = name;
  }
}

