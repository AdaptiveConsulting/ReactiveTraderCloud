import { mix } from 'polished'
import React, { PureComponent } from 'react'

import { createEnvironment, Environment } from 'rt-components'
import { ThemeName, ThemeProvider, ThemeStorage } from 'rt-theme'

import { OrderTicket } from './OrderTicket'

export class OrderTicketRoute extends PureComponent<{}, { instance: number }> {
  environment = createEnvironment()

  state = {
    instance: 0,
  }

  reset = () => this.setState(({ instance }) => ({ instance: instance + 1 }))

  render() {
    return (
      <ThemeStorage.Provider storage={sessionStorage} default={ThemeName.Dark}>
        <Environment.Provider value={this.environment}>
          <ThemeProvider
            theme={theme => ({
              muteColor: mix(0.5, theme.primary.base, theme.secondary[2]),
              ruleColor: theme.primary.base,
            })}
          >
            <OrderTicket key={'OrderTicket' + this.state.instance} reset={this.reset} />
          </ThemeProvider>
        </Environment.Provider>
      </ThemeStorage.Provider>
    )
  }
}
