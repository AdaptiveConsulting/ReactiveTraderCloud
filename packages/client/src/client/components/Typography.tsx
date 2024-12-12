import styled from "styled-components"

import { Color } from "../theme/types"
import { UISK_TextStyleName } from "../theme/uisk/generatedTheme"

interface TypographyProps {
  variant?: UISK_TextStyleName
  color?: Color
  allowLineHeight?: boolean
}

export const Typography = styled.div.attrs({
  className: "typography ",
})<TypographyProps>`
  ${({ variant, theme }) =>
    variant ? theme.newTheme.textStyles[variant] : null}
  color: ${({ color, theme }) =>
    color ? theme.newTheme.color[color] : "inherit"};

  margin-block-end: 0;
  ${({ allowLineHeight }) => (allowLineHeight ? undefined : `line-height: 1`)};
`
