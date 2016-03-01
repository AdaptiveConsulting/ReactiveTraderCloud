export default class UpdateType {

  static _added = new UpdateType('Added');
  static _removed = new UpdateType('Removed');

  name:string;

  static get Added() {
    return this._added;
  }

  static get Removed() {
    return this._removed;
  }

  constructor(name:string) {
    this.name = name;
  }
}

