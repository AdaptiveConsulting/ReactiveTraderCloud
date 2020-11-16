import { createSelector } from 'reselect'
import { GlobalState } from 'StoreTypes'

const selectState = (state: GlobalState) => state.layoutService

const blotterSelector = createSelector([selectState], state => state.blotter)

const analyticsSelector = createSelector([selectState], state => state.analytics)

const liveRatesSelector = createSelector([selectState], state => state.liveRates)

export { blotterSelector, analyticsSelector, liveRatesSelector }
