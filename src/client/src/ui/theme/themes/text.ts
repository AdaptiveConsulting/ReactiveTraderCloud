import { default as defaultPalette, Palette } from './palette'

export const getText = (palette?: Palette) => {
  const textPalette = palette || defaultPalette
  return {
    dark: textPalette.secondary[3],
    light: textPalette.primary[0],
    primary: textPalette.secondary[3],
    secondary: textPalette.primary[0]
  }
}

export default getText()
