import { styled, getColor, ColorProps } from 'rt-theme'

import { mapMarginPaddingProps, MarginPaddingProps } from './mapMarginPaddingProps'
import { mapTextProps, TextProps } from './Text'

import { css } from 'styled-components'

export interface BlockProps extends ColorProps, TextProps, MarginPaddingProps {}

export const Block = styled.div<BlockProps>`
  ${({ theme, bg, fg }) =>
    css({
      transition: bg ? 'background-color ease-out 0.15s' : null,
      backgroundColor: bg && getColor(theme, bg, theme.primary.base),
      color: fg && getColor(theme, fg, theme.secondary.base),
    })};

  ${mapTextProps};

  ${mapMarginPaddingProps};
`

export default Block
