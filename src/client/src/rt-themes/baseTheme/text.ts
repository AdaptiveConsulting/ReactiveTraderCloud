import { Palette } from 'rt-themes/palette'
import { darkest, lightest } from 'rt-themes/utils'

const textPrimary = '#444C5F'
const textSecondary = '#737987'
const textTertiary = '#D4DDE8'
const textMeta = 'rgba(68, 76, 95, .59)'

const text = (palette: Palette) => ({
  textMeta,
  textPrimary,
  textSecondary,
  textTertiary,
  primary: palette.secondary[3],
  secondary: palette.primary[0],
  dark: darkest(palette.secondary[3], palette.primary[0]),
  light: lightest(palette.secondary[3], palette.primary[0])
})

export default text
