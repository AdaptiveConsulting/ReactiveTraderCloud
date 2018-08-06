import { darkest, lightest } from 'rt-themes/utils'

import { Palette } from 'rt-themes/palette'

const backgroundPrimary = '#F4F6F9'
const backgroundSecondary = '#FFFFFF'
const backgroundTertiary = '#E9EDF3'
const backgroundExtra = '#D4DDE8'

const background = (palette: Palette) => ({
  backgroundExtra,
  backgroundPrimary,
  backgroundSecondary,
  backgroundTertiary,
  primary: palette.primary[0],
  secondary: palette.secondary[3],
  dark: darkest(palette.secondary[3], palette.primary[0]),
  light: lightest(palette.secondary[3], palette.primary[0])
})

export default background
