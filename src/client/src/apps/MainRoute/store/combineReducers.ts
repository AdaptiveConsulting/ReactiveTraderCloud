import { combineReducers } from 'redux'
import { platform } from 'rt-platforms'
import { reducers } from 'apps/MainRoute/data'
import { analyticsReducer } from '../widgets/analytics/index'
import { blotterReducer } from '../widgets/blotter/index'
import { spotTileDataReducer } from '../widgets/spotTile/index'

const platformReducers = platform.reducers

const rootReducer = combineReducers({
  ...reducers,
  ...platformReducers,
  blotterService: blotterReducer,
  analyticsService: analyticsReducer,
  spotTilesData: spotTileDataReducer,
})

export default rootReducer
