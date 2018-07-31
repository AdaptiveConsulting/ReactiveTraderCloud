import { darken, lighten } from './colorUtils'

import {
  ACCENT_BAD,
  ACCENT_GOOD,
  ACCENT_PRIMARY,
  ACCENT_WARNING,
  BLACK,
  BRAND_PRIMARY,
  BRAND_SECONDARY,
  WHITE
} from './baseColors'

const getLightPrimary = (color: string) => ({
  '0': lighten(color, 100),
  '1': lighten(color, 95),
  '2': lighten(color, 90),
  '3': lighten(color, 80)
})
const getLightSecondary = (color: string) => ({
  '0': color,
  '1': lighten(color, 10),
  '2': lighten(color, 25),
  '3': darken(color, 40)
})
const getAccent = (color: string) => ({
  normal: color,
  dark: darken(color, 10),
  light: lighten(color, 50)
})

const primary = getLightPrimary(BRAND_PRIMARY)
const secondary = getLightSecondary(BRAND_SECONDARY)
const accentPrimary = getAccent(ACCENT_PRIMARY)
const accentGood = getAccent(ACCENT_GOOD)
const accentWarning = getAccent(ACCENT_WARNING)
const accentBad = getAccent(ACCENT_BAD)

const palette = {
  brand: {
    primary: BRAND_PRIMARY,
    secondary: BRAND_SECONDARY
  },
  primary,
  secondary,
  accentPrimary,
  accentGood,
  accentWarning,
  accentBad,
  unique: {
    buy: ACCENT_GOOD,
    sell: ACCENT_BAD,
    black: BLACK,
    white: WHITE
  }
}

export type Palette = typeof palette

export default palette
