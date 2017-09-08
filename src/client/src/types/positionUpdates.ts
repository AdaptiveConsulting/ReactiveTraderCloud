import { CurrencyPairPosition, HistoricPosition } from '.'

export interface PositionUpdates {
  currentPositions: CurrencyPairPosition[]
  history: HistoricPosition[]
}
