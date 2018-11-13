import React, { PureComponent } from 'react'

import { Platform, PlatformProvider } from 'rt-components'
import { ThemeName, ThemeStorage } from 'rt-theme'

import PlainOrderTicketRoute from './OrderTicketRoute'

const platform = new Platform()

export class OrderTicketRoute extends PureComponent {
  render() {
    return (
      <ThemeStorage.Provider storage={sessionStorage} default={ThemeName.Dark}>
        <PlatformProvider value={platform}>
          <PlainOrderTicketRoute />
        </PlatformProvider>
      </ThemeStorage.Provider>
    )
  }
}
