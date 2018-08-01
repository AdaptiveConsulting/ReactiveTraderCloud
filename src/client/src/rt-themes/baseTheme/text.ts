import { Palette } from 'rt-themes/palette'

export const text = (palette: Palette) => ({
  dark: palette.secondary[3],
  light: palette.primary[0],
  primary: palette.secondary[3],
  secondary: palette.primary[0]
})
