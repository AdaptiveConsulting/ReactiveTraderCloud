import styled, { css, CSSProperties } from "styled-components"

import { Color, TextStyles } from "../theme/types"
import { SpacingContainer, SpacingProps } from "./SpacingContainer"

interface TypographyProps extends SpacingProps {
  variant?: TextStyles
  color?: Color
  allowLineHeight?: boolean
  textTransform?: CSSProperties["textTransform"]
}

export const Typography = styled(SpacingContainer)<TypographyProps>`
  ${({ variant, theme }) =>
    variant ? theme.newTheme.textStyles[variant] : null}
  color: ${({ color, theme }) =>
    color ? theme.newTheme.color[color] : "inherit"};
  ${({ allowLineHeight }) =>
    allowLineHeight ? undefined : `line-height: normal;`}
  ${({ textTransform }) => css({ textTransform })}
`
