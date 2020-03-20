import { AnyAction, Dispatch, MiddlewareAPI } from 'redux'
import { timer } from 'rxjs'
import { ConnectionActions } from 'rt-actions'
import { clearNotionalsOnStorage } from 'rt-util'

const LOG_NAME = 'Application Service: '
export const APPLICATION_DISCONNECT_MINS = 60
const APPLICATION_DISCONNECT = APPLICATION_DISCONNECT_MINS * 60 * 1000

export const APPLICATION_CLEAR_STORAGE_MINS = 10
const APPLICATION_CLEAR_STORAGE = APPLICATION_CLEAR_STORAGE_MINS * 60 * 1000

export const disconnectAfterAWhile = ({ dispatch }: MiddlewareAPI) => (next: Dispatch) => {
  timer(APPLICATION_DISCONNECT).subscribe(() => {
    dispatch(ConnectionActions.disconnect())
    console.warn(
      LOG_NAME,
      `Application has reached disconnection time at ${APPLICATION_DISCONNECT}`,
    )
  })

  return (action: AnyAction) => next(action)
}

export const resetStoredStateAfterAWhile = ({ dispatch }: MiddlewareAPI) => (next: Dispatch) => {
  timer(APPLICATION_CLEAR_STORAGE).subscribe(() => {
    clearNotionalsOnStorage()
    console.warn(LOG_NAME, `Application has cleared storage ${APPLICATION_DISCONNECT}`)
  })

  return (action: AnyAction) => next(action)
}
