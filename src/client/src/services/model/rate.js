export default class Rate {
  _rawRate:number;
  _bigFigure:number;
  _pips:number;
  _pipFraction:number;

  constructor(rawRate:number, ratePrecision:number, pipPrecision:number) {
    this._rawRate = rawRate;

    let rateString = rawRate.toFixed(ratePrecision);
    let priceParts = rateString.split('.');
    let wholeNumber = priceParts[0];
    let fractions = priceParts[1];
    this._bigFigure = Number(wholeNumber + '.' + fractions.substring(0, pipPrecision - 2));
    this._pips = Number(fractions.substring(pipPrecision - 2, pipPrecision));
    this._pipFraction = Number(fractions.substring(pipPrecision, pipPrecision + 1));
  }

  get rawRate():number {
    return this._rawRate;
  }

  get bigFigure():number {
    return this._bigFigure;
  }

  get pips():number {
    return this._pips;
  }

  get pipFraction():number {
    return this._pipFraction;
  }
}
