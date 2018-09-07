import { parse } from 'query-string'
import React from 'react'
import ReactDOM from 'react-dom'

import 'rt-theme'

import MainRoute from './MainRoute'
import NotificationRoute from './NotificationRoute'

ReactDOM.render(
  parse(location.search).notification ? <NotificationRoute /> : <MainRoute />,
  document.getElementById('root')
)
