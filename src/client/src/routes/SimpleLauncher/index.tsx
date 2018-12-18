import React from 'react'
import { TestThemeProvider } from 'test-theme'

import { Launcher } from './Launcher'

export class SimpleLauncher extends React.Component {
  render() {
    return (
      <TestThemeProvider>
        <Launcher {...this.props} />
      </TestThemeProvider>
    )
  }
}
