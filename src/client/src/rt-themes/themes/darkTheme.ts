import { themeFromBaseTheme } from 'rt-themes/appTheme'
import { baseThemeFromPalette } from 'rt-themes/baseTheme'
import { CoreColors, coreColors } from 'rt-themes/coreColors'
import { paletteFromCoreColors } from 'rt-themes/palette'
import { darken, lighten } from 'rt-themes/utils'

const darkTextPrimary = '#FFFFFF'
const darkTextSecondary = '#737987'
const darkTextTertiary = '#2f3542'
const darkTextMeta = 'rgba(255, 255, 255, .59)'

const darkBackgroundPrimary = '#282D39'
const darkBackgroundSecondary = '#2F3542'
const darkBackgroundTertiary = '#444C5F'
const darkBackgroundExtra = '#3D4455'

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
    backgroundPrimary: darkBackgroundPrimary,
    backgroundSecondary: darkBackgroundSecondary,
    backgroundTertiary: darkBackgroundTertiary,
    backgroundExtra: darkBackgroundExtra,
    primary,
    secondary
  }
  const baseTheme = baseThemeFromPalette(palette)

  return themeFromBaseTheme({
    ...baseTheme,
    text: {
      ...baseTheme.text,
      textPrimary: darkTextPrimary,
      textSecondary: darkTextSecondary,
      textTertiary: darkTextTertiary,
      textMeta: darkTextMeta,
      light: palette.secondary[0],
      dark: palette.primary[2]
    }
  })
}

export default darkTheme
