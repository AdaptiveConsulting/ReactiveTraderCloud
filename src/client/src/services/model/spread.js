export default class Spread {
  _value:number;
  _formattedValue:string;

  constructor(value:number, formattedValue:string) {
    this._value = value;
    this._formattedValue = formattedValue;
  }

  get value():number {
    return this._value;
  }

  get formattedValue():string {
    return this._formattedValue;
  }
}
