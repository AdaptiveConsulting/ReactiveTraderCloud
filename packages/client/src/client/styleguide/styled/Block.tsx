import styled, { css } from "styled-components"

import { ColorProps, getThemeColor } from "@/client/theme"

import {
  mapMarginPaddingProps,
  MarginPaddingProps,
} from "./mapMarginPaddingProps"
import { mapTextProps, TextProps } from "./Text"

export interface BlockProps extends ColorProps, TextProps, MarginPaddingProps {}

export const Block = styled.div<BlockProps>`
  ${({ theme, bg, fg }) =>
    css({
      transition: bg ? "background-color ease-out 0.15s" : undefined,
      backgroundColor: bg
        ? getThemeColor(
            theme,
            bg,
            theme.newTheme.color["Colors/Background/bg-primary"],
          )
        : undefined,
      color: fg
        ? getThemeColor(
            theme,
            fg,
            theme.newTheme.color["Colors/Text/text-primary (900)"],
          )
        : undefined,
    })};

  ${mapTextProps};

  ${mapMarginPaddingProps};
`

export default Block
