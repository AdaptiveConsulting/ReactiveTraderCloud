import { ThemeProvider } from 'emotion-theming'
import React from 'react'

import { darkTheme, lightTheme } from 'rt-themes'
import { Themes } from 'shell/theme/constants'

export interface Props {
  type: Themes
}

const Theme: React.SFC<Props> = ({ type, children }) => (
  <ThemeProvider theme={type === Themes.DARK_THEME ? darkTheme() : lightTheme()}>{children}</ThemeProvider>
)

export default Theme
