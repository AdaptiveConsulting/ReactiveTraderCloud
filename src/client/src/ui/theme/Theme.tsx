import { ThemeProvider } from 'emotion-theming'
import React from 'react'

import { Themes } from 'shell/theme/constants'
import { darkTheme, lightTheme } from './themes'

export interface Props {
  type: Themes
}

const Theme: React.SFC<Props> = ({ type, children }) =>
  console.log({ type }) || (
    <ThemeProvider theme={type === Themes.DARK_THEME ? darkTheme : lightTheme}>{children}</ThemeProvider>
  )

export default Theme
