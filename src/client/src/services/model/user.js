export default class User {
  _firstName:String;
  _lastName:String;
  _code:String;

  constructor(firstName:String, lastName:String, code:String) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._code = code;
  }

  get firstName():String {
    return this._firstName;
  }

  get lastName():String {
    return this._lastName;
  }

  get code():String {
    return this._code;
  }
}
