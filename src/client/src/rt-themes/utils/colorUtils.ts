import Color from 'tinycolor2'

const WHITE = '#FFFFFF'
const BLACK = '#000000'

export const lighten = (color: string, amount: number) => Color.mix(color, WHITE, amount).toHexString()
export const darken = (color: string, amount: number) => Color.mix(color, BLACK, amount).toHexString()
