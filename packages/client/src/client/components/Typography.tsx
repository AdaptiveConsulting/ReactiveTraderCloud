import styled from "styled-components"

import { theme } from "../theme/uisk"

type Variant = keyof typeof theme.textStyles
type Color = keyof typeof theme.color

interface TypographyProps {
  variant?: Variant
  color?: Color
}

export const Typography = styled.div<TypographyProps>`
  ${({ variant, theme }) =>
    variant ? theme.newTheme.textStyles[variant] : null}
  color: ${({ color, theme }) =>
    color
      ? theme.newTheme.color[color]
      : theme.newTheme.color["Colors/Text/text-primary (900)"]};

  margin-block-end: 0;
  line-height: 1;
`
