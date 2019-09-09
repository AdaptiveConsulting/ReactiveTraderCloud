import { combineReducers } from 'redux'
import { platform } from 'rt-platforms'
import { reducers } from 'apps/MainRoute/data'
import { analyticsReducer } from '../widgets/analytics/index'
import { blotterReducer } from '../widgets/blotter/index'
import { spotTileDataReducer } from '../widgets/spotTile/index'

const customReducers = platform.customReducers

const rootReducer = combineReducers({
  ...reducers,
  ...customReducers,
  blotterService: blotterReducer,
  analyticsService: analyticsReducer,
  spotTilesData: spotTileDataReducer,
})

export default rootReducer
