import React from 'react'
import { ThemeStorage } from 'rt-theme'

import { Launcher } from './Launcher'

export class SimpleLauncher extends React.Component {
  render() {
    return (
      <ThemeStorage.Provider>
        <Launcher {...this.props} />
      </ThemeStorage.Provider>
    )
  }
}
