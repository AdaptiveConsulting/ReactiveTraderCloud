import { LAYOUT_ACTION_TYPES, LayoutActions } from './layoutActions'
import { externalWindowDefault } from '../../rt-components'

interface TilesLayout {
  [key: string]: boolean
}

export interface LayoutState {
  displayBlotter: boolean
  displayAnalytics: boolean
  spotTiles: TilesLayout
}

const INITIAL_STATE: LayoutState = {
  displayBlotter: true,
  displayAnalytics: true,
  spotTiles: {},
}

export const layoutReducer = (
  state: LayoutState = INITIAL_STATE,
  action: LayoutActions,
): LayoutState => {
  switch (action.type) {
    case LAYOUT_ACTION_TYPES.CONTAINER_VISIBILITY_UPDATE: {
      switch (action.payload.name) {
        case externalWindowDefault.blotterRegion.config.name:
          return {
            ...state,
            displayBlotter: action.payload.display,
          }
        case externalWindowDefault.analyticsRegion.config.name:
          return {
            ...state,
            displayAnalytics: action.payload.display,
          }
        default:
          // this is a spot tile
          return {
            ...state,
            spotTiles: {
              ...state.spotTiles,
              [action.payload.name]: action.payload.display,
            },
          }
      }
    }
    default:
      return state
  }
}
