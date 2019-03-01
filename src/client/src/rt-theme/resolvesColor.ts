import _ from 'lodash'
import { Theme } from './themes'

interface Props {
  theme: any
}
type Resolve = (props: Props) => string
type Selector = string | string[] | Resolve | any

const isColor = (value: string) => value[0] === '#' || _.startsWith(value, 'rgb') || _.startsWith(value, 'hsl')

export const getColor = (theme: Theme, color: string, fallback?: string) =>
  isColor(color)
    ? color
    : _.get(theme, color) || _.get(theme.colors, color) || _.get(theme.colors.spectrum, color) || fallback

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
