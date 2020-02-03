import { TradesUpdate as TradesUpdateType } from './blotterService'
import * as blotterTradesFilter from './blotterTradesFilter'

export { filterBlotterTrades, validateFilters } from './blotterTradesFilter'
export { default as BlotterContainer } from './BlotterContainer'
export { default as blotterReducer } from './reducer'
export { default as createBlotterEpic } from './epics'
export * from './blotterFields'
export { default as BlotterService } from './blotterService'

export type TradesUpdate = TradesUpdateType
export type BlotterFilters = blotterTradesFilter.BlotterFilters
