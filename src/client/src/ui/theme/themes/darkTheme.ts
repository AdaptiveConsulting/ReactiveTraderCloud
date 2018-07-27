import { BRAND_PRIMARY, BRAND_SECONDARY } from './baseColors'
import theme, { Theme } from './baseTheme'
import { darken, lighten } from './colorUtils'
import palette from './palette'

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

const primary = getDarkPrimary(BRAND_PRIMARY)
const secondary = getDarkSecondary(BRAND_SECONDARY)

const darkPalette = {
  ...palette,
  primary,
  secondary,
  background: {
    primary: primary[0],
    secondary: secondary[3]
  },
  text: {
    dark: primary[0],
    light: secondary[3],
    primary: secondary[3],
    secondary: primary[0]
  }
}

const darkTheme: Theme = {
  ...theme,
  palette: darkPalette
}

export default darkTheme
