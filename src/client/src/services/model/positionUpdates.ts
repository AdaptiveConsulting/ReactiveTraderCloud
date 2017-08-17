import CurrencyPairPosition from './currencyPairPosition'
import HistoricPosition from './historicPosition'

export default class PositionUpdates {
  constructor(currentPositions: Array<CurrencyPairPosition>, history: Array<HistoricPosition>) {
    this._currentPositions = currentPositions
    this._history = history
  }

  _currentPositions: Array<CurrencyPairPosition>

  get currentPositions(): Array<CurrencyPairPosition> {
    return this._currentPositions
  }

  _history: Array<HistoricPosition>

  get history(): Array<HistoricPosition> {
    return this._history
  }
}
