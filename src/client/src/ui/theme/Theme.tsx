import { ThemeProvider } from 'emotion-theming'
import * as React from 'react'

import { Themes } from './constants'
import { darkTheme, lightTheme } from './themes'

export interface Props {
  type: Themes
}

const Theme: React.SFC<Props> = ({ type, children }) => (
  <ThemeProvider theme={type === Themes.DARK_THEME ? darkTheme : lightTheme}>{children}</ThemeProvider>
)

export default Theme
