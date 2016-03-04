export default class TileStatus {

  static _idle = new TileStatus('idle');
  static _streaming = new TileStatus('streaming');
  static _executing = new TileStatus('executing');
  static _displayingNotification = new TileStatus('displayingNotification');

  name:string;

  /**
   * Waiting for dependencies to become available or the price stream to start streaming
   */
  static get Idle() {
    return this._idle;
  }

  /**
   * Streaming prices
   */
  static get Streaming() {
    return this._streaming;
  }

  /**
   * Trade request in flight
   */
  static get Executing() {
    return this._executing;
  }

  /**
   * Displaying a message to the user
   */
  static get DisplayingNotification() {
    return this._displayingNotification;
  }

  constructor(name:string) {
    this.name = name;
  }
}

