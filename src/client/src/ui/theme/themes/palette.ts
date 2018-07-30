import { darken, lighten } from './colorUtils'

import {
  accentBad,
  accentGood,
  accentPrimary,
  accentWarning,
  backgroundExtra,
  backgroundPrimary,
  backgroundSecondary,
  backgroundTertiary,
  brandPrimary,
  brandSecondary,
  textMeta,
  textPrimary,
  textSecondary,
  textTertiary
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

const palette = {
  backgroundPrimary,
  backgroundSecondary,
  backgroundTertiary,
  backgroundExtra,
  textPrimary,
  textSecondary,
  textTertiary,
  textMeta,
  brand: {
    primary: brandPrimary,
    secondary: brandSecondary
  },
  primary: getLightPrimary(brandPrimary),
  secondary: getLightSecondary(brandSecondary),
  accentPrimary: getAccent(accentPrimary),
  accentGood: getAccent(accentGood),
  accentWarning: getAccent(accentWarning),
  accentBad: getAccent(accentBad),
  trading: {
    sell: accentBad,
    buy: accentGood
  }
}

export default palette
