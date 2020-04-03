import { AutobahnConnectionProxy } from 'rt-system'
import FakeUserRepository from '../fakeUserRepository'
import { createApplicationServices } from './applicationServices'
import configureStore from './configureStore'
import { ConnectionActions, SetupActions, UserActions } from 'rt-actions'
import { createExcelApp, createLimitChecker, Platform } from 'rt-platforms'

const selectedUser = FakeUserRepository.currentUser

export const createStore = async (platform: Platform) => {
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
      user: selectedUser,
    }),
  )

  store.dispatch(SetupActions.setup())
  store.dispatch(ConnectionActions.connect())
  store.dispatch(UserActions.selected(selectedUser))

  return store
}
