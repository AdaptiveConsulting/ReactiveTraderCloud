import styled, { css, CSSProperties } from "styled-components"

import { Spacing } from "../theme/types"
import { Box, BoxProps } from "./Box"

export interface StackProps extends BoxProps {
  direction?: CSSProperties["flexDirection"]
  wrap?: CSSProperties["flexWrap"]
  flow?: CSSProperties["flexFlow"]
  justifyContent?: CSSProperties["justifyContent"]
  alignItems?: CSSProperties["alignItems"]
  alignContent?: CSSProperties["alignContent"]
  gap?: Spacing | number
}

export const Stack = styled(Box)<StackProps>`
  display: flex;

  ${({
    theme,
    direction,
    wrap,
    flow,
    justifyContent,
    alignItems,
    alignContent,
    gap,
  }) =>
    css({
      flexDirection: direction,
      flexWrap: wrap,
      flexFlow: flow,
      justifyContent,
      alignItems,
      alignContent,
      ...(gap && {
        gap: typeof gap === "number" ? gap : theme.newTheme.spacing[gap],
      }),
    })}
`
