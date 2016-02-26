import { CurrencyPairPosition, HistoricPosition } from './';

export default class PositionUpdates {
  _currentPositions:CurrencyPairPosition;
  _history:HistoricPosition;

  constructor(currentPositions:CurrencyPairPosition, history:HistoricPosition) {
    this._currentPositions = currentPositions;
    this._history = history;
  }

  get currentPositions():CurrencyPairPosition {
    return this._currentPositions;
  }

  get history():HistoricPosition {
    return this._history;
  }
}
