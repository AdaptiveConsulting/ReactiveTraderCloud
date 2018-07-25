import Color from 'tinycolor2'

export const white = '#FFFFFF'
export const black = '#000000'

export const lighten = (color: string, amount: number) => Color.mix(color, white, amount).toHexString()
export const darken = (color: string, amount: number) => Color.mix(color, black, amount).toHexString()
