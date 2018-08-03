import { themeFromBaseTheme } from 'rt-themes/appTheme'
import { baseThemeFromPalette } from 'rt-themes/baseTheme'
import { CoreColors, coreColors } from 'rt-themes/coreColors'
import { paletteFromCoreColors } from 'rt-themes/palette'
import { darken, lighten } from 'rt-themes/utils'

const getDarkPrimary = (color: string) => ({
  '0': darken(color, 30),
  '1': darken(color, 40),
  '2': color,
  '3': darken(color, 10)
})
const getDarkSecondary = (color: string) => ({
  '0': lighten(color, 100),
  '1': lighten(color, 95),
  '2': lighten(color, 90),
  '3': lighten(color, 80)
})

export const darkTheme = (baseColors?: CoreColors) => {
  const darkCoreColors = baseColors || coreColors()
  const primary = getDarkPrimary(darkCoreColors.brandPrimary)
  const secondary = getDarkSecondary(darkCoreColors.brandSecondary)

  const palette = {
    ...paletteFromCoreColors(darkCoreColors),
    primary,
    secondary
  }
  const baseTheme = baseThemeFromPalette(palette)

  return themeFromBaseTheme({
    ...baseTheme,
    text: {
      ...baseTheme.text,
      light: palette.secondary[0],
      dark: palette.primary[2]
    },
    background: {
      ...baseTheme.background,
      light: palette.secondary[0],
      dark: palette.primary[2]
    }
  })
}

export default darkTheme
