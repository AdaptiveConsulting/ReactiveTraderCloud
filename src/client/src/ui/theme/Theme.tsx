import React from 'react'

import { ThemeProvider } from 'rt-theme'
import { themes } from 'rt-theme'
import { darkTheme, lightTheme } from 'rt-themes'
import { Themes } from 'shell/theme/constants'
import 'ui/styles/css/index.css'

import createTransitions from './createTransitions'

createTransitions()

export interface Props {
  type: Themes
}

const Theme: React.SFC<Props> = ({ type, children }) => (
  <ThemeProvider
    theme={type === Themes.DARK_THEME ? { ...darkTheme(), ...themes.dark } : { ...lightTheme(), ...themes.light }}
    children={children}
  />
)

export default Theme
