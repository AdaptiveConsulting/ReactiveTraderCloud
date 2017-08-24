export default class Rate {
  constructor(rawRate: number, ratePrecision: number, pipPrecision: number) {
    this._rawRate = rawRate;

    let rateString = rawRate.toFixed(ratePrecision);
    let priceParts = rateString.split('.');
    let wholeNumber = priceParts[0];
    let fractions = priceParts[1];
    this._bigFigure = Number(wholeNumber + '.' + fractions.substring(0, pipPrecision - 2));
    this._pips = Number(fractions.substring(pipPrecision - 2, pipPrecision));
    this._pipFraction = Number(fractions.substring(pipPrecision, pipPrecision + 1));
  }

  _rawRate: number;

  get rawRate(): number {
    return this._rawRate;
  }

  _bigFigure: number;

  get bigFigure(): number {
    return this._bigFigure;
  }

  _pips: number;

  get pips(): number {
    return this._pips;
  }

  _pipFraction: number;

  get pipFraction(): number {
    return this._pipFraction;
  }
}
