import React, { PureComponent } from 'react'

import { ThemeName, ThemeStorage } from 'rt-theme'

import PlainOrderTicketRoute from './OrderTicketRoute'

export class OrderTicketRoute extends PureComponent {
  render() {
    return (
      <ThemeStorage.Provider storage={sessionStorage} default={ThemeName.Dark}>
        <PlainOrderTicketRoute />
      </ThemeStorage.Provider>
    )
  }
}
