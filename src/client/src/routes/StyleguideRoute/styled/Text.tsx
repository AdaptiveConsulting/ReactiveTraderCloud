import { filter, get } from 'lodash'

import { css, styled, Styled } from 'rt-theme'

import { MappedCSS, PassThroughFunc, PassThroughProps } from '../tools'

export type MappedProp = string | MappedPropFn
export type MappedPropFn = (props: TextProps & PassThroughProps) => MappedCSS
export interface MappedPropMap {
  [key: string]: string | MappedProp
}

export interface TextProps {
  display?: 'inline' | 'block' | 'inline-block'
  lineHeight?: 1 | 1.25 | 1.5 | 2 | 2.5 | 3 | 4 | 5
  fontSize?: 0.625 | 0.75 | 0.875 | 1 | 1.25 | 1.5 | 1.75 | 2 | 2.25 | 2.5 | 3 | any
  fontWeight?: 'bold' | number
  fontStyle?: 'italic' | string
  fontFamily?: 'lato' | 'montserrat' | string
  textAlign?: 'initial' | 'left' | 'center' | 'right'
  textTransform?: 'uppercase'
  whiteSpace?: 'initial' | 'nowrap' | 'pre-line' | 'pre-wrap'
  letterSpacing?: any
  color?: any
  opacity?: 0 | 0.25 | 0.5 | 0.75 | 1
}

export const textProps: MappedPropMap = {
  display: ({ display }) => css({ display }),
  lineHeight: ({ lineHeight }) => css({ lineHeight: `${lineHeight}rem` }),
  fontSize: ({ fontSize }) => css({ fontSize: `${fontSize}rem` }),
  fontWeight: ({ fontWeight }) => css({ fontWeight }),
  fontStyle: ({ fontStyle }) => css({ fontStyle }),
  fontFamily: ({ fontFamily }) => css({ fontFamily }),
  textAlign: ({ textAlign }) => css({ textAlign }),
  textTransform: ({ textTransform }) => css({ textTransform }),
  whiteSpace: ({ whiteSpace }) => css({ whiteSpace }),
  letterSpacing: ({ letterSpacing }) => css({ letterSpacing }),
  color: ({ color, theme }) =>
    css({ color: (color === true && theme.textColor) || get(theme, color) || get(theme.spectrum, color) }),
  opacity: ({ opacity }) => css({ opacity }),
}

export function mapTextProps(props: TextProps): MappedCSS {
  return filter(textProps, (fn: PassThroughFunc, key) => props[key] && props[key] != null && fn(props)) as MappedCSS
}

export const Text: Styled<TextProps> = styled.span`
  max-width: 60em;

  ${mapTextProps};
`

export default Text
