import { darken } from './colorUtils'
import fontSize from './fontSize'
import { default as defaultPalette, Palette } from './palette'
import text from './text'

const COLOR_NUM = 10

const getColorRange = (palette: Palette, isConnected: boolean, colorNum: number) => {
  const output = []
  for (let i = 0; i < COLOR_NUM; i++) {
    output.push(darken(isConnected ? palette.accentGood.normal : palette.accentBad.normal, (i + 1) * 5))
  }
  return output
}

export const getFooter = (palette?: Palette) => {
  const footerPalette = palette || defaultPalette
  return {
    text: {
      color: text.light,
      fontSize: fontSize.h4
    },
    bar: {
      height: '44px',
      colorConnected: footerPalette.accentGood.normal,
      colorDisconnected: footerPalette.accentBad.normal,
      sidePadding: '20px'
    },
    icon: {
      backgroundColorConnected: footerPalette.accentGood.dark,
      backgroundColorDisonnected: footerPalette.accentBad.dark,
      size: '24px'
    },
    serviceStatus: {
      connectedColors: getColorRange(footerPalette, true, COLOR_NUM),
      disconnectedColors: getColorRange(footerPalette, false, COLOR_NUM),
      fontSize: fontSize.h3,
      textColor: text.light
    }
  }
}

export default getFooter()
