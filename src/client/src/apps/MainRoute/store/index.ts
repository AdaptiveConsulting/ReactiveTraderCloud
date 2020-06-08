import { ConnectionActions, SetupActions, UserActions } from 'rt-actions'
import { createLimitChecker, Platform } from 'rt-platforms'
import FakeUserRepository from '../fakeUserRepository'
import { createApplicationServices } from './applicationServices'
import configureStore from './configureStore'
import { broker, excelApp } from './singleServices'

const selectedUser = FakeUserRepository.currentUser

export const createStore = async (platform: Platform) => {
  const store = configureStore(
    createApplicationServices({
      broker,
      limitChecker: await createLimitChecker(platform.name),
      excelApp: await excelApp,
      platform,
      user: selectedUser,
    })
  )

  store.dispatch(SetupActions.setup())
  store.dispatch(ConnectionActions.connect())
  store.dispatch(UserActions.selected(selectedUser))

  return store
}
