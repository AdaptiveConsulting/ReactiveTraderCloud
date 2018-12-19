import React from 'react'
import { ThemeProvider } from 'rt-theme'

import { Launcher } from './Launcher'

export class SimpleLauncher extends React.Component {
  render() {
    return (
      <ThemeProvider>
        <Launcher {...this.props} />
      </ThemeProvider>
    )
  }
}
