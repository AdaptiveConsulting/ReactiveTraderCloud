import { combineReducers } from 'redux'
import { reducers } from 'apps/MainRoute/data'
import { layoutReducer } from 'apps/MainRoute/layouts'
import { analyticsReducer } from '../widgets/analytics'
import { spotTileDataReducer } from '../widgets/spotTile'

const rootReducer = combineReducers({
  ...reducers,
  layoutService: layoutReducer,
  analyticsService: analyticsReducer,
  spotTilesData: spotTileDataReducer,
})

export default rootReducer
