import { mix } from 'polished'
import React, { PureComponent } from 'react'

import { Platform, PlatformProvider } from 'rt-components'
import { TestThemeProvider, the, Theme } from 'test-theme'

import { OrderTicket } from './OrderTicket'
import { ThemeProvider } from 'styled-components'
import { withTheme } from 'emotion-theming'

const platform = new Platform()

class OrderTicketRoute extends PureComponent<{ theme: Theme }, { instance: number }> {
  state = {
    instance: 0,
  }

  reset = () => this.setState(({ instance }) => ({ instance: instance + 1 }))

  render() {
    const { theme } = this.props
    return (
      <TestThemeProvider storage={sessionStorage}>
        <PlatformProvider value={platform}>
          <ThemeProvider
            theme={{
              muteColor: mix(0.5, theme.primary.base, theme.secondary[2]),
              ruleColor: theme.primary.base,
            }}
          >
            <OrderTicket key={'OrderTicket' + this.state.instance} reset={this.reset} />
          </ThemeProvider>
        </PlatformProvider>
      </TestThemeProvider>
    )
  }
}

export default withTheme(OrderTicketRoute)

//withtheme
