import { ThemeProvider } from 'emotion-theming'
import * as React from 'react'

import { DARK_THEME, ThemeType } from './constants'
import { darkTheme, lightTheme } from './theme'

export interface Props {
  type: ThemeType
}

const Theme: React.SFC<Props> = ({ type, children }) => (
  <ThemeProvider theme={type === DARK_THEME ? darkTheme : lightTheme}>{children}</ThemeProvider>
)

export default Theme
