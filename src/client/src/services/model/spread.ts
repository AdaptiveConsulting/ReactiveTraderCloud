export default class Spread {
  constructor(value: number, formattedValue: string) {
    this._value = value;
    this._formattedValue = formattedValue;
  }

  _value: number;

  get value(): number {
    return this._value;
  }

  _formattedValue: string;

  get formattedValue(): string {
    return this._formattedValue;
  }
}
