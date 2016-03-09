export default class User {
  _firstName:string;
  _lastName:string;
  _code:string;

  constructor(firstName:string, lastName:string, code:string) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._code = code;
  }

  get firstName():string {
    return this._firstName;
  }

  get lastName():string {
    return this._lastName;
  }

  get code():string {
    return this._code;
  }
}
