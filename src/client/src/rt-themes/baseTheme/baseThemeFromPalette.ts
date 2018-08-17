import { Palette } from 'rt-themes/palette'
import animationSpeed from './animationSpeed'
import background from './background'
import fontFamily from './fontFamily'
import fontSize from './fontSize'
import shadow from './shadow'
import text from './text'

const baseThemeFromPalette = (palette: Palette) => ({
  animationSpeed: animationSpeed(),
  background: background(palette),
  fontFamily: fontFamily(),
  fontSize: fontSize(),
  palette,
  text: text(palette),
  shadow: shadow()
})

export type BaseTheme = ReturnType<typeof baseThemeFromPalette>

export default baseThemeFromPalette
