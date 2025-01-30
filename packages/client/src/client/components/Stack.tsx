import styled, { css, CSSProperties } from "styled-components"

import { Spacing } from "../theme/types"
import { SpacingContainer, SpacingProps } from "./SpacingContainer"

interface StackProps extends SpacingProps {
  direction?: CSSProperties["flexDirection"]
  wrap?: CSSProperties["flexWrap"]
  flow?: CSSProperties["flexFlow"]
  justifyContent?: CSSProperties["justifyContent"]
  alignItems?: CSSProperties["alignItems"]
  alignContent?: CSSProperties["alignContent"]
  gap?: Spacing | number
}

export const Stack = styled(SpacingContainer)<StackProps>`
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
