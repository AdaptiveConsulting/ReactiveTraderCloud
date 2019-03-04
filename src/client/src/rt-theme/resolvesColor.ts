import _ from 'lodash'
import { Theme, ThemeSelector } from './themes'
import { Color } from './colors'

interface Props {
  theme: any
}
type Resolve = (props: Props) => string
type Selector = string | string[] | Resolve | any

function isColor(value: string | ThemeSelector): value is Color {
  return typeof value === 'string' && /^(#|rgb|hsl)/.test(value)
}
export const getColor = (theme: Theme, color: Color | ThemeSelector, fallback?: Color) =>
  typeof color === 'function' ? color(theme) || fallback : isColor(color) ? color : fallback

export const resolvesColor: (color: Selector, other?: Selector) => (_: any) => any = (
  color: Selector,
  other?: Selector,
) => {
  color = (!color ? null : _.isString(color) ? _.toPath(color) : color) as Selector
  other = (!other ? null : _.isString(other) ? _.toPath(other) : other) as Selector

  return (props: Props) => {
    let value =
      typeof color === 'function'
        ? color(props)
        : _.get(props.theme, color) || _.get(props.theme.colors, color) || _.get(props, color)

    if (value == null && other == null) {
      return color
    }

    if (value == null) {
      value = typeof other === 'function' ? other(props) : resolvesColor(other, null)(props)
    }

    if (isColor(value)) {
      return value
    }

    value = resolvesColor(value, null)(props) || (other ? resolvesColor(other, null)(props) : null)

    return value
  }
}
