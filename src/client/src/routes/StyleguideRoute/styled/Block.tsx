import { styled, getColor } from 'rt-theme'

import { mapMarginPaddingProps, MarginPaddingProps } from './mapMarginPaddingProps'
import { mapTextProps, TextProps } from './Text'

import { ColorProps } from './Color'
import { css } from 'styled-components'

export interface BlockProps extends ColorProps, TextProps, MarginPaddingProps {}

export const Block = styled.div<BlockProps>`
  ${({ theme, bg, fg }) =>
    css({
      transition: bg ? 'background-color ease-out 0.15s' : null,
      backgroundColor: bg && getColor(theme, bg),
      color: fg && getColor(theme, fg, theme.primary.base),
    })};

  ${mapTextProps};

  ${mapMarginPaddingProps};
`

export default Block
