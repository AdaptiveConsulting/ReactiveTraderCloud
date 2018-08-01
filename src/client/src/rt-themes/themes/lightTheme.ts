import { themeFromPalette } from 'rt-themes/appTheme'
import { CoreColors, coreColors } from 'rt-themes/coreColors'
import { paletteFromCoreColors } from 'rt-themes/palette'

const lightTheme = (baseColors?: CoreColors) => {
  const lightCoreColors = baseColors || coreColors()
  const palette = paletteFromCoreColors(lightCoreColors)
  return themeFromPalette(palette)
}

export default lightTheme
