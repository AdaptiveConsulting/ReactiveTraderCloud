import { assignWith, get, startsWith } from 'lodash'

import { FlattenInterpolation, CSSObject } from 'styled-components'

export * from 'styled-components'
export type CSS = string | CSSObject
export type MappedCSS = null | false | CSS | CSS[]

export type MappedProp<PropsType> = string | MappedPropFn<PropsType>
export type MappedPropFn<PropsType> = (props: PropsType & PassThroughProps) => FlattenInterpolation<PropsType>
export interface MappedPropMap<PropsType> {
  [key: string]: string | MappedProp<PropsType>
}

export interface PassThroughProps {
  [key: string]: any
}
export type PassThroughFunc = (...args: any[]) => any

export const hasUnit = RegExp.prototype.test.bind(/\d+\w+/)

export const isColor = (value: string) => value[0] === '#' || startsWith(value, 'rgb') || startsWith(value, 'hsl')

export const getColor = (theme: PassThroughProps, color: string, fallback?: string) =>
  isColor(color)
    ? color
    : get(theme, color) || get(theme.colors, color) || get(theme.colors.spectrum, color) || fallback

export function curryProps<R = CSS>(functor: (props: any) => R, curriedProps: any): (p: any) => R {
  return props => functor({ ...props, ...(typeof curriedProps === 'function' ? curriedProps(props) : curriedProps) })
}

export function extendProps<R = CSS>(...functors: Array<(props: any) => R>): (p: any) => R {
  const { length, [length - 1]: finalFunctor } = functors
  return props => {
    return finalFunctor(functors.slice(0, -1).map(fn => fn(props)))
  }
}

export function mergeProps<R = CSS>(
  functors: Array<(props: any) => R>,
  merge: (results: R[]) => R = results => assignWith({}, ...results, (next: any, prev: any) => next || prev),
): (p: any) => R {
  return props => {
    return merge(functors.map(fn => fn(props)))
  }
}

// TODO 10/3 remove, is this needed?
export type Selector = boolean | string | number | Array<string | number>
