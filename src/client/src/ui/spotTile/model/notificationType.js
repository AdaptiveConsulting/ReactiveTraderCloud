export default class NotificationType {

  static _trade = new NotificationType('Trade');
  static _text = new NotificationType('Text');

  name:string;

  static get Trade() {
    return this._trade;
  }

  static get Text() {
    return this._text;
  }

  constructor(name:string) {
    this.name = name;
  }
}

