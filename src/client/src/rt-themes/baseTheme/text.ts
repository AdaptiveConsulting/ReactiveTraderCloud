import { Palette } from 'rt-themes/palette'
import { darkest, lightest } from 'rt-themes/utils'

const text = (palette: Palette) => ({
  primary: palette.secondary[3],
  secondary: palette.primary[0],
  dark: darkest(palette.secondary[3], palette.primary[0]),
  light: lightest(palette.secondary[3], palette.primary[0])
})

export default text
