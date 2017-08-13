import {ACTION_TYPES as BLOTTER_ACTIONS} from './blotter/blotterOperations'

export const openFinEpic = openFin => action$ => {
  return action$.ofType(BLOTTER_ACTIONS.BLOTTER_POPOUT)
        .map(x => {
          console.log('x:' , x)
          console.log('openFin:' , openFin)
        })
}

