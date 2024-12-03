import styled from "styled-components"

import { theme } from "../theme/uiskTheme"

type Variant = keyof typeof theme.textStyles
export type Color = keyof typeof theme.color

interface TypographyProps {
  variant?: Variant
  color?: Color
  allowLineHeight?: boolean
}

export const Typography = styled.div<TypographyProps>`
  ${({ variant, theme }) =>
    variant ? theme.newTheme.textStyles[variant] : null}
  color: ${({ color, theme }) =>
    color ? theme.newTheme.color[color] : "inherit"};

  margin-block-end: 0;
  ${({ allowLineHeight }) => (allowLineHeight ? undefined : `line-height: 1`)};
`
