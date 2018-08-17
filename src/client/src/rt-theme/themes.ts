import { mapValues } from 'lodash'

import colors, { AccentPaletteMap, Color, ColorPaletteMaps, CorePalette, CorePaletteMap } from './colors'

export interface Theme {
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
  component: ColorPair

  button: TouchableIntents

  // Known extensible properties
  backgroundColor?: Color
  textColor?: Color

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
  modify: (theme: Theme) => object = (theme: Theme) => theme
): Theme {
  const theme: Theme = {
    primary,
    secondary,
    accents,
    colors,

    motion: {
      duration: 200,
      easing: 'ease',

      fast: {
        duration: 150,
        easing: 'ease-in'
      },

      normal: {
        duration: 200,
        easing: 'ease'
      },

      slow: {
        duration: 250,
        easing: 'ease-out'
      }
    },

    shell: {
      backgroundColor: primary[1],
      textColor: secondary.base
    },

    component: {
      backgroundColor: primary.base,
      textColor: secondary.base
    },

    header: {
      backgroundColor: primary.base,
      textColor: secondary[2]
    },

    white: colors.spectrum.white.base,

    tile: {
      backgroundColor: primary.base,
      textColor: secondary.base,
      inputColor: secondary['4'],

      primary: {
        base: accents.accent.base,
        light: accents.accent['2']
      },

      bad: {
        base: accents.bad.base,
        light: accents.bad['3']
      },

      good: {
        base: accents.good.base,
        light: accents.good['3']
      },

      accent: {
        base: accents.accent.base
      },

      button: {
        backgroundColor: primary.base,
        textColor: colors.spectrum.white.base,
        hoverColor: primary['1']
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
    ...theme,
    ...modify(theme)
  }
}

export default themes
