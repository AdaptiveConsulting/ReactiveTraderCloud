import { mapValues } from 'lodash'

import colors, { AccentPaletteMap, Color, ColorPaletteMaps, CorePalette, CorePaletteMap } from './colors'

export interface Theme {
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

export const themes = {
  light: createTheme(colors.light, colors.accents),
  dark: createTheme(colors.dark, colors.accents, (theme: Theme) => ({
    button: {
      ...theme.button,
      secondary: {
        ...theme.button.secondary,
        textColor: theme.primary.base
      }
    }
  }))
}

export function createTheme(
  { primary, secondary }: CorePaletteMap,
  accents: AccentPaletteMap,
  modify: (originalTheme: Theme) => object = (theme: Theme) => theme
): Theme {
  const newTheme: Theme = {
    white: colors.spectrum.white.base,
    black: colors.spectrum.black.base,
    transparent: colors.spectrum.transparent.base,

    primary,
    secondary,
    accents,
    colors,

    motion: {
      duration: 16 * 16,
      easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',

      fast: {
        duration: 16 * 16,
        easing: 'cubic-bezier(0.19, 1, 0.22, 1)'
      },

      normal: {
        duration: 16 * 16,
        easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)'
      },

      slow: {
        duration: 16 * 16,
        easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)'
      }
    },

    shell: {
      backgroundColor: primary[1],
      textColor: secondary.base
    },

    component: {
      backgroundColor: primary.base,
      textColor: secondary[2],
      hover: {
        backgroundColor: primary[1]
      }
    },

    overlay: {
      backgroundColor: primary[1],
      textColor: secondary[2]
    },

    header: {
      backgroundColor: primary.base,
      textColor: secondary[2]
    },

    tile: {
      backgroundColor: primary.base,
      textColor: secondary.base,
      inputColor: secondary['4'],

      blue: {
        base: accents.accent.base,
        light: accents.accent['2']
      },

      red: {
        base: accents.bad.base,
        light: accents.bad['3']
      },

      green: {
        base: accents.good.base,
        light: accents.good['3']
      },

      priceButton: {
        backgroundColor: primary.base,
        textColor: colors.spectrum.white.base,
        hoverColor: primary['1']
      }
    },

    blotter: {
      backgroundColor: primary[1],
      alternateBackgroundColor: primary.base,
      foregroundColor: primary['3'],
      pending: primary['2'],

      textColor: secondary.base,

      blue: {
        base: accents.accent.base,
        light: accents.accent['2']
      },

      red: {
        base: accents.bad.base,
        light: accents.bad['3']
      },

      green: {
        base: accents.good.base,
        light: accents.good['3']
      }
    },

    button: {
      primary: {
        backgroundColor: accents.accent.base,
        textColor: colors.light.primary.base,

        active: {
          backgroundColor: accents.accent[1]
        },
        disabled: {
          backgroundColor: accents.accent[2]
        }
      },

      secondary: {
        backgroundColor: secondary.base,
        textColor: primary.base,

        active: {
          backgroundColor: secondary[3]
        },
        disabled: {
          backgroundColor: secondary[4]
        }
      },

      ...mapValues(accents, ({ base, [1]: active, [2]: disabled }) => ({
        backgroundColor: base,
        textColor: colors.light.primary.base,

        active: {
          backgroundColor: active
        },
        disabled: {
          backgroundColor: disabled
        }
      }))
    }
  }

  return {
    ...newTheme,
    ...modify(newTheme)
  }
}

export default themes
