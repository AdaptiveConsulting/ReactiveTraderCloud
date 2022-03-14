import styled, { css } from 'styled-components'
import { ColorProps, getThemeColor } from '@/theme'
import { mapMarginPaddingProps, MarginPaddingProps } from './mapMarginPaddingProps'
import { mapTextProps, TextProps } from './Text'

export interface BlockProps extends ColorProps, TextProps, MarginPaddingProps {}

export const Block = styled.div<BlockProps>`
  ${({ theme, bg, fg }) =>
    css({
      transition: bg ? 'background-color ease-out 0.15s' : undefined,
      backgroundColor: bg && getThemeColor(theme, bg, theme.primary.base),
      color: fg && getThemeColor(theme, fg, theme.secondary.base),
    })};

  ${mapTextProps};

  ${mapMarginPaddingProps};
`

export default Block
