export default class User {
  constructor(firstName: string, lastName: string, code: string) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._code = code;
  }

  _firstName: string;

  get firstName(): string {
    return this._firstName;
  }

  _lastName: string;

  get lastName(): string {
    return this._lastName;
  }

  _code: string;

  get code(): string {
    return this._code;
  }
}
