import { timer } from 'rxjs'
import { ConnectionActions } from 'rt-actions'
import { AutobahnConnectionProxy } from 'rt-system'
import { platform, setupWorkspaces } from 'rt-components'
import FakeUserRepository from '../fakeUserRepository'
import { createApplicationServices } from './applicationServices'
import configureStore from './configureStore'

const LOG_NAME = 'Application Service: '

export const store = configureStore(
  createApplicationServices({
    autobahn: new AutobahnConnectionProxy(
      process.env.REACT_APP_BROKER_HOST || location.hostname,
      'com.weareadaptive.reactivetrader',
      +(process.env.REACT_APP_BROKER_PORT || location.port),
    ),
    limitChecker: platform.limitChecker,
    platform,
    user: FakeUserRepository.currentUser,
  }),
)

setupWorkspaces(store)
  .then(successVal => {
    console.info('setupWorkspaces success', successVal)
  })
  .catch(err => {
    console.error('setupWorkspaces error', err)
  })

store.dispatch(ConnectionActions.connect())

export const APPLICATION_DISCONNECT_MINS = 60
const APPLICATION_DISCONNECT = APPLICATION_DISCONNECT_MINS * 60 * 1000

timer(APPLICATION_DISCONNECT).subscribe(() => {
  store.dispatch(ConnectionActions.disconnect())
  console.warn(LOG_NAME, `Application has reached disconnection time at ${APPLICATION_DISCONNECT}`)
})
