import _ from 'lodash'

import { colors, Palette, PaletteMap } from './colors'

type Theme = typeof defaultTheme &
  ColorPair & {
    primary: Palette
    secondary: Palette
    accents: PaletteMap
  }

interface ColorPair {
  backgroundColor: string
  textColor?: string
}

const defaultTheme = {
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

  colors
}

export function createTheme({ primary, secondary }: PaletteMap, accents: PaletteMap, overrides) {
  const theme: Theme & { [key: string]: any } = {
    ..._.cloneDeep(defaultTheme),

    primary,
    secondary,
    accents,

    backgroundColor: primary[1],
    textColor: secondary.base,

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
      backgroundColor: primary.base,
      textColor: secondary.base,

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
    },

    statusBar: {
      backgroundColor: secondary.base,
      textColor: primary.base,

      connecting: {
        backgroundColor: accents.aware.base,
        textColor: colors.light.primary.base
      },

      connected: {
        backgroundColor: accents.good.base,
        textColor: colors.light.primary.base
      },

      disconnected: {
        backgroundColor: accents.bad.base,
        textColor: colors.light.primary.base
      }
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
