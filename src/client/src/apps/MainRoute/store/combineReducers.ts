import { combineReducers } from 'redux'
import { reducers } from 'apps/MainRoute/data'
import { layoutReducer } from 'apps/MainRoute/layouts'
import { analyticsReducer } from '../widgets/analytics/index'
import { blotterReducer } from '../widgets/blotter/index'
import { spotTileDataReducer } from '../widgets/spotTile/index'

const rootReducer = combineReducers({
  ...reducers,
  layoutService: layoutReducer,
  blotterService: blotterReducer,
  analyticsService: analyticsReducer,
  spotTilesData: spotTileDataReducer,
})

export default rootReducer
