import fontFamily from './fontFamily'
import fontSize from './fontSize'
import palette, { darkPalette } from './palette'

const theme = {
  fontFamily,
  fontSize,
  palette
}

export const lightTheme = theme

export type Theme = typeof theme

export const darkTheme: Theme = {
  ...theme,
  palette: darkPalette
}
