import { reduce } from 'lodash'

import { CSSObject, getColor, MappedCSS, MappedPropFn, MappedPropMap } from '../tools'

export interface ColorProps {
  backgroundColor?: string
  textColor?: string
  bg?: string
  fg?: string
}

export const colorProps: MappedPropMap<ColorProps> = {
  backgroundColor: v => (colorProps.bg as MappedPropFn<ColorProps>)(v),
  textColor: v => (colorProps.fg as MappedPropFn<ColorProps>)(v),
  bg: ({ theme, backgroundColor, bg = backgroundColor }) => bg && { backgroundColor: getColor(theme, bg) },
  fg: ({ theme, backgroundColor, fg = backgroundColor }) => fg && { color: getColor(theme, fg) },
}

export function mapColorProps(props: ColorProps | any): CSSObject {
  return reduce(
    colorProps,
    (acc, fn: any, key) => (props[key] && props[key] != null ? { ...acc, ...fn(props) } : acc),
    {},
  )
}
