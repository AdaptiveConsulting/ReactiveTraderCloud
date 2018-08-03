import { BaseTheme, baseThemeFromPalette } from 'rt-themes/baseTheme'
import { CoreColors, coreColors } from 'rt-themes/coreColors'
import { Palette, paletteFromCoreColors } from 'rt-themes/palette'

import footer from './footer'
import header from './header'

export const themeFromBaseTheme = (baseTheme: BaseTheme) => {
  return {
    ...baseTheme,
    footer: footer(baseTheme),
    header: header(baseTheme)
  }
}
export const themeFromPalette = (palette: Palette) => themeFromBaseTheme(baseThemeFromPalette(palette))
export const themeFromCoreColors = (colors: CoreColors) => themeFromPalette(paletteFromCoreColors(colors))
export const defaultTheme = () => themeFromCoreColors(coreColors())

export type Theme = ReturnType<typeof defaultTheme>
