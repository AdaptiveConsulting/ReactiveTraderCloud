import { Palette } from 'rt-themes/palette'

const textPrimary = '#444C5F'
const textSecondary = '#737987'
const textTertiary = '#D4DDE8'
const textMeta = 'rgba(68, 76, 95, .59)'

const text = (palette: Palette) => ({
  textMeta,
  textPrimary,
  textSecondary,
  textTertiary,
  dark: palette.secondary[3],
  light: palette.primary[0],
  primary: palette.secondary[3],
  secondary: palette.primary[0]
})

export default text
