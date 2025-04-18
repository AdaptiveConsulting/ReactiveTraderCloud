import type * as CSS from "csstype"
import { CSSProperties } from "react"
import styled, { css } from "styled-components"

import { Color, Radius, Spacing } from "../theme/types"

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

const colorPropNames = ["color", "backgroundColor"] as const

interface CssProps {
  width?: CSSProperties["width"]
  height?: CSSProperties["height"]
  textAlign?: CSSProperties["textAlign"]
  display?: CSSProperties["display"]
  overflow?: CSSProperties["overflow"]
}

type MarginKeys = [...typeof marginPropNames, ...CustomMarginPropNames][number]
type PaddingKeys = [
  ...typeof paddingPropNames,
  ...CustomPaddingPropNames,
][number]
type ColorKeys = (typeof colorPropNames)[number]

type MarginProps = {
  [k in MarginKeys]?: Spacing | number | CSS.Properties["margin"]
}
type PaddingProps = {
  [k in PaddingKeys]?: Spacing | number | CSS.Properties["margin"]
}
type ColorProps = {
  [k in ColorKeys]?: Color | "black" | "white" | "inherit"
}
type RadiusProp = { borderRadius?: Radius | CSS.Properties["borderRadius"] }
export type BoxProps = MarginProps &
  PaddingProps &
  ColorProps &
  RadiusProp &
  CssProps

export const Box = styled.div<BoxProps>`
  ${({ theme, ...props }) => {
    const mapThemeCss = <T extends keyof typeof theme>(
      themeKey: T,
      prop?: keyof (typeof theme)[T] | number | string,
    ) => {
      if (!prop) return
      if (theme[themeKey][prop as keyof (typeof theme)[T]]) {
        return theme[themeKey][prop as keyof (typeof theme)[T]]
      }
      return prop
    }

    const filterProps = <T extends readonly string[] | string>(names: T) =>
      Object.entries(props).filter(([name]) =>
        names.includes(name as T[number]),
      )

    const { marginX, marginY, paddingX, paddingY } = props

    const customSpacingStyles = {
      ...(paddingX && {
        paddingLeft: mapThemeCss("spacing", paddingX),
        paddingRight: mapThemeCss("spacing", paddingX),
      }),
      ...(paddingY && {
        paddingTop: mapThemeCss("spacing", paddingY),
        paddingBottom: mapThemeCss("spacing", paddingY),
      }),
      ...(marginX && {
        marginLeft: mapThemeCss("spacing", marginX),
        marginRight: mapThemeCss("spacing", marginX),
      }),
      ...(marginY && {
        marginTop: mapThemeCss("spacing", marginY),
        marginBottom: mapThemeCss("spacing", marginY),
      }),
    }

    const marginProps = filterProps(marginPropNames)
    const marginStyles = Object.fromEntries(
      marginProps.map(([name, value]) => [name, mapThemeCss("spacing", value)]),
    )

    const paddingProps = filterProps(paddingPropNames)
    const paddingStyles = Object.fromEntries(
      paddingProps.map(([name, value]) => [
        name,
        mapThemeCss("spacing", value),
      ]),
    )

    const colorProps = filterProps(colorPropNames)
    const colorStyles = Object.fromEntries(
      colorProps.map(([name, value]) => [name, mapThemeCss("color", value)]),
    )

    const { width, height, textAlign, display, overflow } = props

    const borderRadius = mapThemeCss("radius", props.borderRadius)

    return css({
      ...customSpacingStyles,
      // the more specific styles should overwrite the more general custom styles
      ...marginStyles,
      ...paddingStyles,
      ...colorStyles,
      width,
      height,
      textAlign,
      borderRadius,
      display,
      overflow,
    })
  }}
`
