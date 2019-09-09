import { LAYOUT_ACTION_TYPES, LayoutActions, ContainerVisibility } from './layoutActions'
import { externalWindowDefault } from 'rt-components'
import { ActionWithPayload } from 'rt-util/ActionHelper'
import { WindowPosition } from 'rt-platforms/types'

interface TilesLayout {
  [key: string]: WindowPosition
}

export interface LayoutState {
  blotter: WindowPosition
  analytics: WindowPosition
  spotTiles: TilesLayout
}

const INITIAL_STATE: LayoutState = {
  blotter: {
    visible: true,
  },
  analytics: {
    visible: true,
  },
  spotTiles: {},
}

export const platformReducers = {
  layout: (state: LayoutState = INITIAL_STATE, action: LayoutActions): LayoutState => {
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
          default:
            // this is a spot tile
            return {
              ...state,
              spotTiles: {
                ...state.spotTiles,
                [action.payload.name]: getWindowPosition(action),
              },
            }
        }
      }
      default:
        return state
    }
  },
}

const getWindowPosition = (
  action: ActionWithPayload<LAYOUT_ACTION_TYPES.CONTAINER_VISIBILITY_UPDATE, ContainerVisibility>,
): WindowPosition => ({
  visible: action.payload.display,
  x: action.payload.x,
  y: action.payload.y,
})
