import _ from 'lodash'

import { Color, colors, Palette, PaletteMap } from './colors'

export interface Theme {
  primary: Palette
  secondary: Palette
  accents: PaletteMap

  motion: Motion & {
    fase: Motion
    normal: Motion
    slow: Motion
  }

  shell: ColorPair
  component: ColorPair

  button: TouchableIntents

  // Known extensible properties
  backgroundColor?: Color
  textColor?: Color

  // TODO: remove after theme migration
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

interface ColorPair {
  backgroundColor: string
  textColor?: string
}

export function createTheme(
  { primary, secondary }: PaletteMap,
  accents: PaletteMap,
  overrides
): Theme & { [key: string]: any } {
  const theme = {
    primary,
    secondary,
    accents,

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
        ease: 'ease-out'
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

      ..._.mapValues(accents, ({ base, [1]: active, [2]: disabled }) => ({
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

  return _.merge(theme, overrides)
}

export const themes = {
  light: createTheme(colors.light, colors.accents, {}),
  dark: createTheme(colors.dark, colors.accents, {
    button: {
      secondary: {
        textColor: colors.dark.primary.base
      }
    }
  })
}

export default themes
