import { CurrencyPairPosition, HistoricPosition } from './';

export default class PositionUpdates {
  _currentPositions:Array<CurrencyPairPosition>;
  _history:Array<HistoricPosition>;

  constructor(currentPositions:Array<CurrencyPairPosition>, history:Array<HistoricPosition>) {
    this._currentPositions = currentPositions;
    this._history = history;
  }

  get currentPositions():Array<CurrencyPairPosition> {
    return this._currentPositions;
  }

  get history():Array<HistoricPosition> {
    return this._history;
  }
}
