class UpdateType {

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

UpdateType._added = new UpdateType('Added');
UpdateType._removed = new UpdateType('Removed');

export default UpdateType;
