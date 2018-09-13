import { get, startsWith } from 'lodash'

export const hasUnit = RegExp.prototype.test.bind(/\d+\w+/)

export const isColor = value => value[0] === '#' || startsWith(value, 'rgb') || startsWith(value, 'hsl')

export const getColor = (theme, color, fallback?) =>
  isColor(color)
    ? color
    : get(theme, color) || get(theme.colors, color) || get(theme.colors.spectrum, color) || fallback

export const mapProps = obj => {
  // return map
}
