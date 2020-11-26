import { CurrencyPairPosition } from './currencyPairPosition'
import { HistoricPosition } from './historicPosition'

export interface PositionUpdates {
  currentPositions: CurrencyPairPosition[]
  history: HistoricPosition[]
}
