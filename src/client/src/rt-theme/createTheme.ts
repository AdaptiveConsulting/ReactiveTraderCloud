import { darken } from 'polished'
import { mapValues } from 'lodash'
import template from './template'

import colors, { AccentPaletteMap, Color, ColorPaletteMaps, CorePalette, CorePaletteMap } from './colors'

export interface BaseTheme {
  white: Color
  black: Color
  transparent: Color

  primary: CorePalette
  secondary: CorePalette
  accents: AccentPaletteMap
  colors: ColorPaletteMaps

  motion: Motion & {
    fast: Motion
    normal: Motion
    slow: Motion
  }

  shell: ColorPair

  component: ColorPair & {
    hover: ColorPair
  }

  overlay: ColorPair

  button: TouchableIntents

  // Known extensible properties
  backgroundColor?: Color
  textColor?: Color
  shadowColor?: Color
  hover?: ColorPair

  // TODO (8/14/18) remove after theme migration
  [key: string]: any
}

export type ExtensibleThemeValue = Color | null
export type GeneratedTheme = ReturnType<typeof generateTheme>
export type Theme = BaseTheme & GeneratedTheme

export interface TouchableIntents {
  primary: Touchable
  secondary: Touchable
  accent: Touchable
  good: Touchable
  aware: Touchable
  bad: Touchable
}

export interface Touchable {
  backgroundColor: Color
  textColor: Color

  active: ColorPair
  disabled: ColorPair

  // Hover states don't transfer to mobile
  hover?: ColorPair
}

export interface Motion {
  duration: number
  easing: string
}

export interface ColorPair {
  backgroundColor: string
  textColor?: string
}

export type ThemeModifier = (original: GeneratedTheme) => GeneratedTheme

const generateTheme = ({ primary, secondary, core }: CorePaletteMap, accents: AccentPaletteMap) => ({
  template,
  core,
  white: colors.spectrum.white.base,
  black: colors.spectrum.black.base,
  transparent: colors.spectrum.transparent.base,

  backgroundColor: null as ExtensibleThemeValue,
  textColor: null as ExtensibleThemeValue,
  shadowColor: null as ExtensibleThemeValue,
  hover: null as ExtensibleThemeValue,

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
    inputColor: secondary['4'],
  },

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
      backgroundColor: accents.accent.base,
      textColor: colors.light.primary.base,

      active: {
        backgroundColor: accents.accent[1],
      },
      disabled: {
        backgroundColor: accents.accent[2],
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

    ...mapValues(accents, ({ base, [1]: active, [2]: disabled }) => ({
      backgroundColor: base,
      textColor: colors.light.primary.base,

      active: {
        backgroundColor: active,
      },
      disabled: {
        backgroundColor: disabled,
      },
    })),
  },
})

export const createTheme = (
  { primary, secondary, core }: CorePaletteMap,
  accents: AccentPaletteMap,
  modifier: ThemeModifier = theme => ({ ...theme }),
) => modifier(generateTheme({ primary, secondary, core }, accents))

export default createTheme
