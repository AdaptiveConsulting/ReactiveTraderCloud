import * as React from 'react'
import {createAction} from 'redux-actions'
import {Provider} from 'react-redux'
import {ACTION_TYPES as REGIONS_ACTIONS} from './regions/regionsOperations'
import {getPopoutService} from './../ui/common/popout'
import {createStore} from "redux";


const popoutWrapper = (component) => {
  // read from the localstorage
  /./
}


const popoutOpened = createAction(REGIONS_ACTIONS.REGION_OPENED)
const generateView = () => {

  const store = createStore(() => {})

  return (
    <Provider store={store}>
      <div>Hello Vasi</div>
    </Provider>
  )
}

export const openFinEpic = openFin => (action$, store) => {
  return action$.ofType(REGIONS_ACTIONS.REGION_REMOVE)
    .map(action => {
      const popoutService = getPopoutService(openFin)
      const popoutView = generateView()
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

