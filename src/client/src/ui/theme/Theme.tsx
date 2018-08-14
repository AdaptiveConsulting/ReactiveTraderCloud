import React from 'react'

import { ThemeProvider, themes } from 'rt-theme'
import { darkTheme, lightTheme } from 'rt-themes'
import { Themes } from 'shell/theme/constants'
import 'ui/styles/css/index.css'

import createTransitions from './createTransitions'

createTransitions()

export interface Props {
  type: Themes
}

const Theme: React.SFC<Props> = ({ type, ...props }) => (
  <ThemeProvider
    theme={type === Themes.DARK_THEME ? { ...darkTheme(), ...themes.dark } : { ...lightTheme(), ...themes.light }}
    {...props}
  />
)

export default Theme
