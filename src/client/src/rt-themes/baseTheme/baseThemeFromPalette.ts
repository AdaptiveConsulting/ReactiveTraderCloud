import { Palette } from 'rt-themes/palette'
import { background } from './background'
import { fontFamily } from './fontFamily'
import { fontSize } from './fontSize'
import { text } from './text'

const baseThemeFromPalette = (palette: Palette) => ({
  background: background(palette),
  fontFamily: fontFamily(),
  fontSize: fontSize(),
  palette,
  text: text(palette)
})

export type BaseTheme = ReturnType<typeof baseThemeFromPalette>

export default baseThemeFromPalette
