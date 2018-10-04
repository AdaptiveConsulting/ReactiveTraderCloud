import { filter } from 'lodash'

import { css, styled } from 'rt-theme'

import { getColor, MappedCSS, MappedPropFn, MappedPropMap } from '../tools'
import { mapMarginPaddingProps, MarginPaddingProps } from './mapMarginPaddingProps'
import { mapTextProps, TextProps } from './Text'

import { ColorProps, mapColorProps } from './Color'

export interface BlockProps extends ColorProps, TextProps, MarginPaddingProps {}

export const mapBlockProps = (propStuff: BlockProps): MappedCSS =>
  [mapColorProps, mapTextProps, mapMarginPaddingProps].reduce(
    (acc: MappedCSS, functor: MappedPropFn<BlockProps>) => [].concat(acc, functor(propStuff)),
    [],
  )

export const Block = styled.div<BlockProps>`
  transition: background-color ease-out 0.15s;

  ${({ theme, backgroundColor, textColor, bg = backgroundColor, fg = textColor }) =>
    css({
      backgroundColor: bg && getColor(theme, bg),
      color: fg && getColor(theme, fg, theme.white),
    })};

  ${mapTextProps};

  ${mapMarginPaddingProps};
`

export default Block
