import { BaseTheme } from 'rt-themes/baseTheme'
import { Palette } from 'rt-themes/palette'
import { darken } from 'rt-themes/utils'

const COLOR_NUM = 10

const getColorRange = (palette: Palette, isConnected: boolean, colorNum: number) => {
  const output = []
  for (let i = 0; i < COLOR_NUM; i++) {
    output.push(darken(isConnected ? palette.accentGood.normal : palette.accentBad.normal, (i + 1) * 5))
  }
  return output
}

const footer = (baseTheme: BaseTheme) => ({
  text: {
    color: baseTheme.text.light,
    fontSize: baseTheme.fontSize.h4
  },
  bar: {
    height: '44px',
    colorConnected: baseTheme.palette.accentGood.normal,
    colorDisconnected: baseTheme.palette.accentBad.normal,
    sidePadding: '20px'
  },
  icon: {
    backgroundColorConnected: baseTheme.palette.accentGood.dark,
    backgroundColorDisonnected: baseTheme.palette.accentBad.dark,
    size: '24px'
  },
  serviceStatus: {
    connectedColors: getColorRange(baseTheme.palette, true, COLOR_NUM),
    disconnectedColors: getColorRange(baseTheme.palette, false, COLOR_NUM),
    fontSize: baseTheme.fontSize.h3,
    textColor: baseTheme.text.light
  }
})

export default footer
