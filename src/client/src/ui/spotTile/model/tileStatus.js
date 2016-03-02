export default class TileStatus {

  static _listening = new TileStatus('listening');
  static _stale = new TileStatus('stale');
  static _executing = new TileStatus('executing');
  static _blocked = new TileStatus('blocked');

  name:string;

  static get Listening() {
    return this._listening;
  }

  static get Stale() {
    return this._stale;
  }

  static get Executing() {
    return this._executing;
  }

  static get Blocked() {
    return this._blocked;
  }

  constructor(name:string) {
    this.name = name;
  }
}

