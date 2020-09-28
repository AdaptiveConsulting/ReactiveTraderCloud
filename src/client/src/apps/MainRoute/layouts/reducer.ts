import { LAYOUT_ACTION_TYPES, LayoutAction } from 'rt-actions'
import { ContainerVisibility } from 'rt-actions/layoutActions'
import { externalWindowDefault, WindowPosition, TilesLayout } from 'rt-platforms'
import { ActionWithPayload } from 'rt-util/ActionHelper'

export interface LayoutState {
  blotter: WindowPosition
  analytics: WindowPosition
  spotTiles: TilesLayout
  liveRates: WindowPosition
}

const INITIAL_STATE: LayoutState = {
  blotter: {
    visible: true,
  },
  analytics: {
    visible: true,
  },
  spotTiles: {},
  liveRates: {
    visible: true,
  },
}

export const layoutReducer = (
  state: LayoutState = INITIAL_STATE,
  action: LayoutAction
): LayoutState => {
  switch (action.type) {
    case LAYOUT_ACTION_TYPES.CONTAINER_VISIBILITY_UPDATE: {
      switch (action.payload.name) {
        case externalWindowDefault.blotterRegion.config.name:
          return {
            ...state,
            blotter: getWindowPosition(action),
          }
        case externalWindowDefault.analyticsRegion.config.name:
          return {
            ...state,
            analytics: getWindowPosition(action),
          }
        case externalWindowDefault.liveRatesRegion.config.name:
          return {
            ...state,
            liveRates: getWindowPosition(action),
          }
        default:
          // this is a spot tile
          return {
            ...state,
            spotTiles: {
              ...state.spotTiles,
              [action.payload.name!]: getWindowPosition(action),
            },
          }
      }
    }
    default:
      return state
  }
}

const getWindowPosition = (
  action: ActionWithPayload<LAYOUT_ACTION_TYPES.CONTAINER_VISIBILITY_UPDATE, ContainerVisibility>
): WindowPosition => ({
  visible: !!action.payload.display,
  x: action.payload.x,
  y: action.payload.y,
})
