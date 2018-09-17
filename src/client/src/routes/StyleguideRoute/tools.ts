import { get, startsWith } from 'lodash'

import { css } from 'rt-theme'

export type CSS = string | StyledCSS | Array<string | StyledCSS>
export type MappedCSS = null | false | CSS | CSS[]
export type StyledCSS = ReturnType<typeof css>

export type Selector = boolean | string | number | Array<string | number>

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
