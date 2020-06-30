import { combineReducers } from 'redux'
import { reducers } from 'apps/MainRoute/data'
import { layoutReducer } from 'apps/MainRoute/layouts'
import { spotTileDataReducer } from '../widgets/spotTile'

const rootReducer = combineReducers({
  ...reducers,
  layoutService: layoutReducer,
  spotTilesData: spotTileDataReducer,
})

export default rootReducer
