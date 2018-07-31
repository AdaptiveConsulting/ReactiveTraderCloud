import { default as defaultPalette, Palette } from './palette'

export const getBackground = (palette?: Palette) => {
  const backgroundPalette = palette || defaultPalette
  return {
    primary: backgroundPalette.primary[0],
    secondary: backgroundPalette.secondary[3]
  }
}

export default getBackground()
