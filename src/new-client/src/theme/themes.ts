import { darken } from "polished"
import { keyframes } from "styled-components"

import {
  colors,
  AccentPaletteMap,
  Color,
  CorePalette,
  CorePaletteMap,
  AccentName,
} from "./colors"

interface BaseTheme {
  white: Color
  black: Color
  transparent: Color

  primary: CorePalette
  secondary: CorePalette
  accents: AccentPaletteMap
  colors: typeof colors

  motion: Motion & {
    fast: Motion
    normal: Motion
    slow: Motion
  }

  overlay: ColorPair

  button: TouchableStyleSet

  // Known extensible properties
  backgroundColor: Color
  textColor: Color
}
/* eslint-disable-next-line */
type GeneratedTheme = ReturnType<typeof createTheme>
export type Theme = BaseTheme & GeneratedTheme

interface Touchable {
  backgroundColor: Color
  textColor: Color

  active: ColorPair
  disabled: ColorPair
}
export type TouchableIntentName = AccentName | "primary" | "secondary" | "mute"
type TouchableStyleSet = { [style in TouchableIntentName]: Touchable }

interface Motion {
  duration: number
  easing: string
}

interface ColorPair {
  backgroundColor: string
  textColor?: string
}

export type ThemeSelector = (theme: Theme) => Color | undefined

export interface ColorProps {
  bg?: ThemeSelector
  fg?: ThemeSelector
}

function isColor(value: string | ThemeSelector): value is Color {
  return typeof value === "string" && /^(#|rgb|hsl)/.test(value)
}
export const getThemeColor = (
  theme: Theme,
  color: Color | ThemeSelector,
  fallback?: Color,
) =>
  typeof color === "function"
    ? color(theme) || fallback
    : isColor(color)
    ? color
    : fallback

const createTheme = (
  name: string,
  { primary, secondary, core }: CorePaletteMap,
  accents: AccentPaletteMap,
) => ({
  name,
  core,
  white: colors.static.white,
  black: colors.static.black,
  transparent: colors.static.transparent,

  backgroundColor: core.darkBackground,
  textColor: core.textColor,

  primary,
  secondary,
  accents,
  colors,

  motion: {
    duration: 16 * 16,
    easing: "cubic-bezier(0.165, 0.84, 0.44, 1)",

    fast: {
      duration: 16 * 16,
      easing: "cubic-bezier(0.19, 1, 0.22, 1)",
    },

    normal: {
      duration: 16 * 16,
      easing: "cubic-bezier(0.165, 0.84, 0.44, 1)",
    },

    slow: {
      duration: 16 * 16,
      easing: "cubic-bezier(0.165, 0.84, 0.44, 1)",
    },
  },

  overlay: {
    backgroundColor: darken(0.1, primary[1]),
    textColor: secondary[2],
  },

  tile: {
    inputColor: secondary[4],
  },

  flash: keyframes`
    0% {
      background-color: ${primary.base};
    }
    50% {
      background-color: ${accents.primary.darker};
    }
    100% {
      background-color: ${primary.base};
    }
  `,

  button: {
    mute: {
      backgroundColor: primary.base,
      textColor: secondary.base,

      active: {
        backgroundColor: primary[4],
      },
      disabled: {
        backgroundColor: primary[3],
      },
    },

    secondary: {
      backgroundColor: primary[1],
      textColor: secondary.base,

      active: {
        backgroundColor: accents.primary.darker,
        textColor: colors.static.white,
      },
      disabled: {
        backgroundColor: primary[1],
      },
    },

    ...Object.fromEntries(
      Object.entries(accents).map(([key, { base, darker }]) => [
        key,
        {
          backgroundColor: base,
          textColor: colors.static.white,

          active: {
            backgroundColor: darker,
          },
          disabled: {
            backgroundColor: primary[1],
            textColor: secondary.base,
          },
        },
      ]),
    ),
  } as TouchableStyleSet,

  dropdown: {
    backgroundColor: primary.base,
    textColor: secondary.base,

    active: {
      backgroundColor: primary[2],
    },

    disabled: {
      backgroundColor: primary[1],
      textColor: primary[2],
    },
  },
})

const lightTheme: Theme = createTheme("light", colors.light, colors.accents)
const darkTheme: Theme = createTheme("dark", colors.dark, colors.accents)

export const themes = {
  light: lightTheme,
  dark: darkTheme,
}
