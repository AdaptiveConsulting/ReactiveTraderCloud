import background from './background'
import fontFamily from './fontFamily'
import fontSize from './fontSize'
import footer from './footer'
import palette from './palette'
import text from './text'

const theme = {
  background,
  fontFamily,
  fontSize,
  footer,
  palette,
  text
}

export type Theme = typeof theme

export default theme
