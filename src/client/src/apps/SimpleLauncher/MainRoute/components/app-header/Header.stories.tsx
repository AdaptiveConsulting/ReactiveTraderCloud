import { storiesOf } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { Story } from 'rt-storybook'
import Header from './Header'
import FakeUserRepository from '../../fakeUserRepository'

const userStatusState = {
  selectingUser: false,
  user: FakeUserRepository.currentUser,
}

const stories = storiesOf('Header', module)
const store = createStore(() => ({ userStatus: userStatusState }))

stories.add('Header', () => (
  <Provider store={store}>
    <Story>
      <Header />
    </Story>
  </Provider>
))
