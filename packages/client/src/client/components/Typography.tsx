import styled, { css, CSSObject, CSSProperties } from "styled-components"

import { Color, TextStyles } from "../theme/types"
import { Box, BoxProps } from "./Box"

export interface TypographyProps extends BoxProps {
  variant?: TextStyles
  allowLineHeight?: boolean
  fontSize?: number | string
  textTransform?: CSSProperties["textTransform"]
}

export const Typography = styled(Box)<TypographyProps>`
  ${({ variant, theme }) => (variant ? theme.textStyles[variant] : null)}
  ${({ theme, color, allowLineHeight, textTransform, fontSize }) => {
    const style: CSSObject = {}
    // color
    if (!color) {
      style.color = "inherit"
    } else if (theme.color[color as Color]) {
      style.color = theme.color[color as Color]
    } else {
      style.color = color
    }

    style.lineHeight = allowLineHeight ? undefined : "normal"
    style.textTransform = textTransform
    if (fontSize) {
      style.fontSize = fontSize
    }
    return css(style)
  }}}

`
