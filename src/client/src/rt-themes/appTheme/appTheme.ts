import { BaseTheme, baseThemeFromPalette } from 'rt-themes/baseTheme'
import { CoreColors, coreColors } from 'rt-themes/coreColors'
import { Palette, paletteFromCoreColors } from 'rt-themes/palette'

import header from './header'
import shell from './shell'

export const themeFromBaseTheme = (baseTheme: BaseTheme) => {
  return {
    ...baseTheme,
    header: header(baseTheme),
    shell: shell(baseTheme)
  }
}
export const themeFromPalette = (palette: Palette) => themeFromBaseTheme(baseThemeFromPalette(palette))
export const themeFromCoreColors = (colors: CoreColors) => themeFromPalette(paletteFromCoreColors(colors))
export const defaultTheme = () => themeFromCoreColors(coreColors())

export type Theme = ReturnType<typeof defaultTheme>
