import { getBackground } from './background'
import { BRAND_PRIMARY, BRAND_SECONDARY } from './baseColors'
import { darken, lighten } from './colorUtils'
import theme, { Theme } from './defaultTheme'
import palette from './palette'
import { getText } from './text'

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
  secondary
}

const darkTheme: Theme = {
  ...theme,
  palette: darkPalette,
  background: getBackground(darkPalette),
  text: getText(darkPalette)
}

export default darkTheme
