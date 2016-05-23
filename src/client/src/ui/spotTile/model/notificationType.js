class NotificationType {

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

NotificationType._trade = new NotificationType('Trade');
NotificationType._text = new NotificationType('Text');

export default NotificationType;
