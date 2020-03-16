import { WsConnectionProxy } from 'rt-system'
import FakeUserRepository from '../fakeUserRepository'
import { createApplicationServices } from './applicationServices'
import configureStore from './configureStore'
import { ConnectionActions, SetupActions } from 'rt-actions'
import { createExcelApp, createLimitChecker, Platform } from 'rt-platforms'

export const createStore = async (platform: Platform) => {
  const store = configureStore(
    createApplicationServices({
      broker: new WsConnectionProxy(
        process.env.REACT_APP_BROKER_HOST || location.hostname,
        +(process.env.REACT_APP_BROKER_PORT || location.port),
      ),
      limitChecker: await createLimitChecker(platform.name),
      excelApp: await createExcelApp(platform.name),
      platform,
      user: FakeUserRepository.currentUser,
    }),
  )

  store.dispatch(SetupActions.setup())
  store.dispatch(ConnectionActions.connect())
  return store
}
