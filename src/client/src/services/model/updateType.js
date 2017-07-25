// TODO: this should be a Typescript enum

class UpdateType {

  name;

  constructor(name) {
    this.name = name;
  }

  static get Added() {
    return this._added;
  }

  static get Removed() {
    return this._removed;
  }
}

UpdateType._added = new UpdateType('Added');
UpdateType._removed = new UpdateType('Removed');

export default UpdateType;
