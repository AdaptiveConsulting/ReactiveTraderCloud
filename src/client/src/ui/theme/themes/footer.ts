import { darken } from './colorUtils'
import fontSize from './fontSize'
import palette from './palette'

const COLOR_NUM = 10

const getColorRange = (isConnected: boolean, colorNum: number) => {
  const output = []
  for (let i = 0; i < COLOR_NUM; i++) {
    output.push(darken(isConnected ? palette.accentGood.normal : palette.accentBad.normal, (i + 1) * 5))
  }
  return output
}

const footer = {
  text: {
    color: palette.text.light,
    fontSize: fontSize.h4
  },
  bar: {
    height: '44px',
    colorConnected: palette.accentGood.normal,
    colorDisconnected: palette.accentBad.normal,
    sidePadding: '20px'
  },
  icon: {
    backgroundColorConnected: palette.accentGood.dark,
    backgroundColorDisonnected: palette.accentBad.dark,
    size: '24px'
  },
  serviceStatus: {
    connectedColors: getColorRange(true, COLOR_NUM),
    disconnectedColors: getColorRange(false, COLOR_NUM),
    fontSize: fontSize.h3,
    textColor: palette.text.light
  }
}

export default footer
