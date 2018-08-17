import React from 'react'

import { ThemeProvider, ThemeState } from 'rt-theme'
import { darkTheme, lightTheme } from 'rt-themes'

const migrate = {
  dark: theme => ({ ...darkTheme(), ...theme }),
  light: theme => ({ ...lightTheme(), ...theme })
}

const Theme: React.SFC = props => (
  <ThemeState.Consumer>
    {({ name }) => {
      return <ThemeProvider {...props} theme={migrate[name]} />
    }}
  </ThemeState.Consumer>
)

export default Theme
