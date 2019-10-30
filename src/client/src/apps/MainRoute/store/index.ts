import { AutobahnConnectionProxy } from 'rt-system'
import FakeUserRepository from '../fakeUserRepository'
import { createApplicationServices } from './applicationServices'
import configureStore from './configureStore'
import { ConnectionActions, SetupActions } from 'rt-actions'
import { createExcelApp, createLimitChecker, PlatformAdapter } from 'rt-platforms'

export const createStore = async (platform: PlatformAdapter) => {
  const store = configureStore(
    createApplicationServices({
      autobahn: new AutobahnConnectionProxy(
        process.env.REACT_APP_BROKER_HOST || location.hostname,
        'com.weareadaptive.reactivetrader',
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
