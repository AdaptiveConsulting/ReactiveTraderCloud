import styled, { css } from 'styled-components'
import { Theme, ThemeSelector } from '@/theme'

// Normalized font sizes are `rem` values corresponding to whole pixel values (i.e. rem*16 is integer)
type NormalizedFontSize =
  | 0.5
  | 0.625
  | 0.6875
  | 0.75
  | 0.8125
  | 0.875
  | 1
  | 1.125
  | 1.25
  | 1.3125
  | 1.5
  | 1.75
  | 2
  | 2.125
  | 2.25
  | 2.5
  | 3
  | 3.4375
  | 5
  | 7.5

type NormalizedLineHeight = 1 | 1.25 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 7.5

export interface TextProps {
  display?: 'inline' | 'block' | 'inline-block'
  /**
   * Expressed in `rem`
   */
  lineHeight?: NormalizedLineHeight
  /**
   * Expressed in `rem`
   */
  fontSize?: NormalizedFontSize
  fontWeight?: 'bold' | number
  fontStyle?: 'italic' | string
  fontFamily?: 'lato' | 'montserrat' | 'roboto' | string
  textAlign?: 'initial' | 'left' | 'center' | 'right'
  textTransform?: 'uppercase' | 'capitalize'
  whiteSpace?: 'initial' | 'nowrap' | 'pre-line' | 'pre-wrap'
  /**
   * Expressed in `px`
   */
  letterSpacing?: number
  /*
   When using standard attribute names like 'color', styled-components injects them 
   into the rendered html element (e.g <span color="">)! With literal attributes 
   this is no big deal, but since this is a Theme=>string selector React warns when
   trying to use a function as the value of an attribute.
   As a workaround we rename to `textColor`
   */
  textColor?: ThemeSelector
  opacity?: 0 | 0.25 | 0.5 | 0.75 | 1
}

type TextPropsToCssMapper = {
  [k in keyof TextProps]: (props: TextProps & { theme: Theme }) => ReturnType<typeof css>
}

const textPropsToCSS: TextPropsToCssMapper = {
  display: ({ display }) => css({ display }),
  lineHeight: ({ lineHeight }) => css({ lineHeight: `${lineHeight}rem` }),
  fontSize: ({ fontSize }) => css({ fontSize: `${fontSize}rem` }),
  fontWeight: ({ fontWeight }) => css({ fontWeight }),
  fontStyle: ({ fontStyle }) => css({ fontStyle }),
  fontFamily: ({ fontFamily }) => css({ fontFamily }),
  textAlign: ({ textAlign }) => css({ textAlign }),
  textTransform: ({ textTransform }) => css({ textTransform }),
  whiteSpace: ({ whiteSpace }) => css({ whiteSpace }),
  letterSpacing: ({ letterSpacing }) => css({ letterSpacing: `${letterSpacing}px` }),
  textColor: ({ textColor, theme }) => {
    if (typeof textColor === 'string') {
      return css({ color: textColor })
    }
    if (typeof textColor === 'function') {
      return css({ color: textColor(theme) })
    }
    return css({})
  },
  opacity: ({ opacity }) => css({ opacity }),
}

function isTextProp(propName: string): propName is keyof TextProps {
  // @ts-ignore
  return textPropsToCSS[propName] !== undefined
}

export function mapTextProps(props: TextProps & { theme: Theme }) {
  return Object.keys(props)
    .filter(isTextProp)
    .map(propName => {
      const textPropsToCSSValue = textPropsToCSS[propName]
      return textPropsToCSSValue && textPropsToCSSValue(props)
    })
    .filter(Boolean)
    .join(';')
}

export const Text = styled.span<TextProps>`
  max-width: 60em;

  ${mapTextProps};
`

export default Text
