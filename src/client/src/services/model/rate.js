export default class Rate {
  _rawRate:number;
  _precision:number;
  _pipPrecision:number;
  _bigNumber:number;
  _smallNumber:number;
  _pips:number;
  _rateString:String;

  parsePrice(rawRate:number, precision, pipPrecision) {
    this._rawRate = rate;
    this._precision = precision;
    this._pipPrecision = pipPrecision;

    this._rateString = price.toFixed(precision);

    var priceParts = this._rateString.split('.');
    this._bigNumber = Number(priceParts[0]);
    let fractions = priceParts[1];
    this._smallNumber = fractions.substring(0, pipPrecision);
    this._pips = fractions.substring(pipPrecision, precision);
    this._bigNumber = Math.floor(rawRate) + '.' + fractions.substring(0, pipPrecision - 2);
  }

  get rawRate():number {
    return this._rawRate;
  }

  get precision():number {
    return this._precision;
  }

  get pipPrecision():number {
    return this._pipPrecision;
  }

  get bigNumber():number {
    return this._bigNumber;
  }

  get smallNumber():number {
    return this._smallNumber;
  }

  get pips():number {
    return this._pips;
  }

  get rateString():String {
    return this._rateString;
  }
}
