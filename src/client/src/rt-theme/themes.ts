import { darken } from 'polished'
import { mapValues } from 'lodash'
import { keyframes } from 'styled-components'

import {
  colors,
  template,
  AccentPaletteMap,
  Color,
  CorePalette,
  CorePaletteMap,
  AccentName,
} from './colors'

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

  shell: ColorPair

  overlay: ColorPair

  button: TouchableStyleSet

  // Known extensible properties
  backgroundColor: Color
  textColor: Color

  // TODO (8/14/18) remove after theme migration
  [key: string]: any
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
export type TouchableIntentName = AccentName | 'primary' | 'secondary' | 'mute'
type TouchableStyleSet = { [style in TouchableIntentName]: Touchable }

interface Motion {
  duration: number
  easing: string
}

interface ColorPair {
  backgroundColor: string
  textColor?: string
}

export type ThemeSelector = (theme: Theme) => Color

export interface ColorProps {
  bg?: ThemeSelector
  fg?: ThemeSelector
}

function isColor(value: string | ThemeSelector): value is Color {
  return typeof value === 'string' && /^(#|rgb|hsl)/.test(value)
}
export const getThemeColor = (theme: Theme, color: Color | ThemeSelector, fallback?: Color) =>
  typeof color === 'function' ? color(theme) || fallback : isColor(color) ? color : fallback

const createTheme = ({ primary, secondary, core }: CorePaletteMap, accents: AccentPaletteMap) => ({
  template,
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
    easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',

    fast: {
      duration: 16 * 16,
      easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
    },

    normal: {
      duration: 16 * 16,
      easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    },

    slow: {
      duration: 16 * 16,
      easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
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
      background-color: ${accents.dominant.darker};
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

    primary: {
      backgroundColor: accents.dominant.base,
      textColor: colors.light.primary.base,

      active: {
        backgroundColor: accents.dominant.darker,
      },
      disabled: {
        backgroundColor: accents.dominant.lighter,
      },
    },

    secondary: {
      backgroundColor: secondary.base,
      textColor: primary.base,

      active: {
        backgroundColor: secondary[3],
      },
      disabled: {
        backgroundColor: secondary[4],
      },
    },

    ...mapValues(accents, ({ base, darker, lighter }) => ({
      backgroundColor: base,
      textColor: colors.light.primary.base,

      active: {
        backgroundColor: darker,
      },
      disabled: {
        backgroundColor: lighter,
      },
    })),
  } as TouchableStyleSet,
})

const lightTheme = createTheme(colors.light, colors.accents)
const darkTheme = createTheme(colors.dark, colors.accents)
// Manual overrides
darkTheme.button.secondary.textColor = darkTheme.primary.base

export const themes = {
  light: lightTheme,
  dark: darkTheme,
}
