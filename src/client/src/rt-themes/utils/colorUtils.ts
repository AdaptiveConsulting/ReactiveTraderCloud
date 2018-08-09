import Color from 'tinycolor2'

const WHITE = '#FFFFFF'
const BLACK = '#000000'

const colorsToLuminance = (colors: string[]) => colors.map(color => ({ luminance: Color(color).getLuminance(), color }))

export const lighten = (color: string, amount: number) => Color.mix(color, WHITE, amount).toHexString()
export const darken = (color: string, amount: number) => Color.mix(color, BLACK, amount).toHexString()
export const lightest = (...colors: string[]) =>
  colorsToLuminance(colors).sort((a, b) => b.luminance - a.luminance)[0].color
export const darkest = (...colors: string[]) =>
  colorsToLuminance(colors).sort((a, b) => a.luminance - b.luminance)[0].color
