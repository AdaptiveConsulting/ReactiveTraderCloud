import styled, { css } from "styled-components"

import { Spacing as ThemeSpacing } from "../theme/types"

// add custom css properties here
type CustomMarginPropNames = ["marginX", "marginY"]
type CustomPaddingPropNames = ["paddingX", "paddingY"]

// add existing css properties here
const marginPropNames = [
  "margin",
  "marginTop",
  "marginBottom",
  "marginLeft",
  "marginRight",
] as const

const paddingPropNames = [
  "padding",
  "paddingTop",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
] as const

type MarginKeys = [...typeof marginPropNames, ...CustomMarginPropNames][number]
type PaddingKeys = [
  ...typeof paddingPropNames,
  ...CustomPaddingPropNames,
][number]
type MarginProps = { [k in MarginKeys]?: ThemeSpacing | number }
type PaddingProps = { [k in PaddingKeys]?: ThemeSpacing | number }
export type BoxProps = MarginProps & PaddingProps

export const Box = styled.div<BoxProps>`
  ${({ theme, ...props }) => {
    const mapSpacingCss = (prop?: ThemeSpacing | number) =>
      prop && (typeof prop === "number" ? prop : theme.newTheme.spacing[prop])

    const marginProps = Object.entries(props).filter(([name]) =>
      marginPropNames.includes(name as (typeof marginPropNames)[number]),
    )

    const paddingProps = Object.entries(props).filter(([name]) =>
      paddingPropNames.includes(name as (typeof paddingPropNames)[number]),
    )

    const { marginX, marginY, paddingX, paddingY } = props

    const customSpacingStyles = {
      ...(paddingX && {
        paddingLeft: mapSpacingCss(paddingX),
        paddingRight: mapSpacingCss(paddingX),
      }),
      ...(paddingY && {
        paddingTop: mapSpacingCss(paddingY),
        paddingBottom: mapSpacingCss(paddingY),
      }),
      ...(marginX && {
        marginLeft: mapSpacingCss(marginX),
        marginRight: mapSpacingCss(marginX),
      }),
      ...(marginY && {
        marginTop: mapSpacingCss(marginY),
        marginBottom: mapSpacingCss(marginY),
      }),
    }

    const marginStyles = Object.fromEntries(
      marginProps.map(([name, value]) => [name, mapSpacingCss(value)]),
    )

    const paddingStyles = Object.fromEntries(
      paddingProps.map(([name, value]) => [name, mapSpacingCss(value)]),
    )

    return css({
      ...customSpacingStyles,
      // the more specific styles should overwrite the more general custom styles
      ...marginStyles,
      ...paddingStyles,
    })
  }}
`
