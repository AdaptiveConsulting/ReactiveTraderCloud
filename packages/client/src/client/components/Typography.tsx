import styled, { css, CSSObject, CSSProperties } from "styled-components"

import { Color, TextStyles } from "../theme/types"
import { Box, BoxProps } from "./Box"

export interface TypographyProps extends BoxProps {
  variant?: TextStyles
  color?: Color | string
  allowLineHeight?: boolean
  fontSize?: number | string
  textTransform?: CSSProperties["textTransform"]
}

export const Typography = styled(Box)<TypographyProps>`
  ${({ variant, theme }) => (variant ? theme.textStyles[variant] : null)}
  ${({ theme, color, allowLineHeight, textTransform, fontSize }) => {
    const style: CSSObject = {}
    style.color = color ? theme.color[color] : "inherit"
    style.lineHeight = allowLineHeight ? undefined : "normal"
    style.textTransform = textTransform
    if (fontSize) {
      style.fontSize = fontSize
    }
    return css(style)
  }}}

`
