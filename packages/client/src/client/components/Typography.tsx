import styled from "styled-components"

import { Color, TextStyles } from "../theme/types"

interface TypographyProps {
  variant?: TextStyles
  color?: Color
  allowLineHeight?: boolean
}

export const Typography = styled.div<TypographyProps>`
  ${({ variant, theme }) =>
    variant ? theme.newTheme.textStyles[variant] : null}
  color: ${({ color, theme }) =>
    color ? theme.newTheme.color[color] : "inherit"};

  margin-block-end: 0;
  ${({ allowLineHeight }) =>
    allowLineHeight ? undefined : `line-height: normal`};
`
