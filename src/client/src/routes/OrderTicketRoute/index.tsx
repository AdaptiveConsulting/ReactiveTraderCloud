import { mix } from 'polished'
import React, { PureComponent } from 'react'

import { Platform, PlatformProvider } from 'rt-components'
import { ThemeName, ThemeProvider, ThemeStorage } from 'rt-theme'

import { OrderTicket } from './OrderTicket'

const platform = new Platform()

export class OrderTicketRoute extends PureComponent<{}, { instance: number }> {
  state = {
    instance: 0,
  }

  reset = () => this.setState(({ instance }) => ({ instance: instance + 1 }))

  render() {
    return (
      <ThemeStorage.Provider storage={sessionStorage} default={ThemeName.Dark}>
        <PlatformProvider value={platform}>
          <ThemeProvider
            theme={theme => ({
              muteColor: mix(0.5, theme.primary.base, theme.secondary[2]),
              ruleColor: theme.primary.base,
            })}
          >
            <OrderTicket key={'OrderTicket' + this.state.instance} reset={this.reset} />
          </ThemeProvider>
        </PlatformProvider>
      </ThemeStorage.Provider>
    )
  }
}
