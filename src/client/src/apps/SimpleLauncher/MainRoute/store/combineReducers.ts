import { combineReducers } from 'redux'
import { reducers } from 'apps/SimpleLauncher/MainRoute/data'
import { layoutReducer } from 'apps/SimpleLauncher/MainRoute/layouts'
import { analyticsReducer } from '../widgets/analytics'
import { blotterReducer } from '../widgets/blotter'
import { spotTileDataReducer } from '../widgets/spotTile'

const rootReducer = combineReducers({
  ...reducers,
  layoutService: layoutReducer,
  blotterService: blotterReducer,
  analyticsService: analyticsReducer,
  spotTilesData: spotTileDataReducer,
})

export default rootReducer
