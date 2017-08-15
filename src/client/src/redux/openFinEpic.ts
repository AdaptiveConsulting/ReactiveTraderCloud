import * as React from 'react'
import { Provider } from 'react-redux'
import {createAction} from 'redux-actions'

import {ACTION_TYPES as REGIONS_ACTIONS} from './regions/regionsOperations'
import {getPopoutService} from './../ui/common/popout'
import {BlotterContainer} from './../ui/blotter/'

const popoutOpened = createAction(REGIONS_ACTIONS.REGION_OPENED)
const generateView = (store) => {
  console.log('store:', store)
  return React.createElement(Provider, {store: store}, BlotterContainer)
}

export const openFinEpic = openFin => (action$, store) => {
  return action$.ofType(REGIONS_ACTIONS.REGION_REMOVE)
    .map(action => {
      const popoutService = getPopoutService(openFin)
      const popoutView = generateView(store)
      const {id, settings} = action.payload
      popoutService.openPopout(
        {
          id,
          url: '/#/popout',
          title: settings.title,
          onClosing: () => {
            console.log('close callback')
          },
          windowOptions: {
            width: settings.width,
            height: settings.height,
            resizable: false,
            scrollable: false,
            dockable: settings.dockable
          }
        }, popoutView
      )
      return popoutOpened()
    })
}

