import { darken, lighten } from 'rt-themes/utils'

import { CoreColors } from 'rt-themes/coreColors'

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

const paletteFromCoreColors = (coreColors: CoreColors) => ({
  brand: {
    primary: coreColors.brandPrimary,
    secondary: coreColors.brandSecondary
  },
  primary: getLightPrimary(coreColors.brandPrimary),
  secondary: getLightSecondary(coreColors.brandSecondary),
  accentPrimary: getAccent(coreColors.accentPrimary),
  accentGood: getAccent(coreColors.accentGood),
  accentWarning: getAccent(coreColors.accentWarning),
  accentBad: getAccent(coreColors.accentBad)
})

export type Palette = ReturnType<typeof paletteFromCoreColors>

export default paletteFromCoreColors
