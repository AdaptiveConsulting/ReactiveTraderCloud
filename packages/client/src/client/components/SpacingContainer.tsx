import styled, { css } from "styled-components"

import { Spacing as ThemeSpacing } from "../theme/types"

// add custom css properties here
const customMarginPropNames = ["marginX", "marginY"] as const
const customPaddingPropNames = ["paddingX", "paddingY"] as const

// add existing css properties here
const marginPropNames = [
  "margin",
  "marginTop",
  "marginBottom",
  "marginLeft",
  "marginRight",
  ...customMarginPropNames,
] as const

const paddingPropNames = [
  "padding",
  "paddingTop",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  ...customPaddingPropNames,
] as const

type MarginKeys = (typeof marginPropNames)[number]
type PaddingKeys = (typeof paddingPropNames)[number]

type MarginProps = { [k in MarginKeys]?: ThemeSpacing | number }

type PaddingProps = { [k in PaddingKeys]?: ThemeSpacing | number }
export type SpacingProps = MarginProps & PaddingProps

export const SpacingContainer = styled.div<SpacingProps>`
  ${({ theme, ...props }) => {
    const mapSpacingCss = (prop?: ThemeSpacing | number) =>
      prop && (typeof prop === "number" ? prop : theme.newTheme.spacing[prop])

    const marginProps = Object.entries(props).filter(
      ([name]) =>
        marginPropNames.includes(name as (typeof marginPropNames)[number]) &&
        !customMarginPropNames.includes(
          name as (typeof customMarginPropNames)[number],
        ),
    )

    const paddingProps = Object.entries(props).filter(
      ([name]) =>
        paddingPropNames.includes(name as (typeof paddingPropNames)[number]) &&
        !customPaddingPropNames.includes(
          name as (typeof customPaddingPropNames)[number],
        ),
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
