import { mix } from 'polished'
import React, { PureComponent, FunctionComponent } from 'react'

import { Platform, PlatformProvider } from 'rt-components'
import { TestThemeProvider, Theme } from 'test-theme'

import { OrderTicket } from './OrderTicket'
import { ThemeProvider } from 'styled-components'
import { withTheme } from 'styled-components'

const platform = new Platform()

interface Props {
  theme: Theme
  reset: () => void
  instance: number
}

const BaseOrderTicket: FunctionComponent<Props> = ({ theme, reset, instance }) => (
  <ThemeProvider
    theme={{
      muteColor: mix(0.5, theme.primary.base, theme.secondary[2]),
      ruleColor: theme.primary.base,
    }}
  >
    <OrderTicket key={'OrderTicket' + instance} reset={reset} />
  </ThemeProvider>
)

const OrderTicketWithTheme = withTheme(BaseOrderTicket)

export default class OrderTicketRoute extends PureComponent<{}, { instance: number }> {
  state = {
    instance: 0,
  }

  reset = () => this.setState(({ instance }) => ({ instance: instance + 1 }))

  render() {
    return (
      <TestThemeProvider storage={sessionStorage}>
        <PlatformProvider value={platform}>
          <OrderTicketWithTheme instance={this.state.instance} reset={this.reset} />
        </PlatformProvider>
      </TestThemeProvider>
    )
  }
}
