import * as Color from 'tinycolor2'

const brandPrimary = '#28588D'
const brandSecondary = '#444C5F'

const accentPrimary = '#5F94F5'
const accentGood = '#28C988'
const accentWarning = '#F9BA4C'
const accentBad = '#F94C4C'

const white = '#FFFFFF'
const black = '#000000'

const lighten = (color: string, amount: number) => Color.mix(color, white, amount).toHexString()

const darken = (color: string, amount: number) => Color.mix(color, black, amount).toHexString()

const getLightPrimary = (color: string) => ({
  '0': lighten(color, 100),
  '1': lighten(color, 95),
  '2': lighten(color, 90),
  '3': lighten(color, 80)
})
const getDarkPrimary = (color: string) => ({
  '0': darken(color, 30),
  '1': darken(color, 40),
  '2': color,
  '3': darken(color, 10)
})
const getLightSecondary = (color: string) => ({
  '0': color,
  '1': lighten(color, 10),
  '2': lighten(color, 25),
  '3': darken(color, 40)
})
const getDarkSecondary = (color: string) => ({
  '0': lighten(color, 100),
  '1': lighten(color, 95),
  '2': lighten(color, 90),
  '3': darken(color, 80)
})
const getAccent = (color: string) => ({
  normal: color,
  dark: darken(color, 10),
  light: lighten(color, 50)
})

const palette = {
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

export const darkPalette = {
  ...palette,
  primary: getDarkPrimary(brandPrimary),
  secondary: getDarkSecondary(brandSecondary)
}

export default palette
