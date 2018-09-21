import React, { PureComponent } from 'react'

import { createEnvironment, Environment } from 'rt-components'
import { ThemeName, ThemeStorage } from 'rt-theme'

import PlainOrderTicketRoute from './OrderTicketRoute'

import { OpenFin } from '../../shell/openFin'

export class OrderTicketRoute extends PureComponent {
  environment = createEnvironment(new OpenFin())

  render() {
    return (
      <ThemeStorage.Provider storage={sessionStorage} default={ThemeName.Dark}>
        <Environment.Provider value={this.environment}>
          <PlainOrderTicketRoute />
        </Environment.Provider>
      </ThemeStorage.Provider>
    )
  }
}
