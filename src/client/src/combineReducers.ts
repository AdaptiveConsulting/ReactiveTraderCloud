import { combineReducers } from 'redux'

import { reducers } from 'shell'
import { analyticsReducer } from './ui/analytics'
import { blotterReducer } from './ui/blotter'
import { spotTileDataReducer } from './ui/spotTile'

const rootReducer = combineReducers({
  ...reducers,
  blotterService: blotterReducer,
  analyticsService: analyticsReducer,
  spotTilesData: spotTileDataReducer
})

export default rootReducer
