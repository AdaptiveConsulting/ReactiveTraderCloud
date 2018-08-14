import React from 'react'

import { ThemeProvider, ThemeState } from 'rt-theme'
import { darkTheme, lightTheme } from 'rt-themes'
import { Themes } from 'shell/theme/constants'
import 'ui/styles/css/index.css'

import createTransitions from './createTransitions'

createTransitions()

export interface Props {
  type: Themes
}

const migrate = {
  dark: theme => ({ ...darkTheme(), ...theme }),
  light: theme => ({ ...lightTheme(), ...theme })
}

const Theme: React.SFC<Props> = ({ type, ...props }) => (
  <ThemeState.Consumer>
    {({ name }) => {
      return <ThemeProvider theme={migrate[name]} {...props} />
    }}
  </ThemeState.Consumer>
)

export default Theme
