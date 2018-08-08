import _ from 'lodash'

import { colors, palettes } from './colors'

export function createTheme({ primary, secondary }, accents, overrides) {
  const theme = {
    motion: {
      duration: 200
    },

    colors,
    palettes,

    primary,
    secondary,
    accents,

    backgroundColor: primary.base,
    textColor: secondary.base,

    button: {
      backgroundColor: primary.base,
      textColor: secondary.base,

      primary: {
        backgroundColor: accents.accent.base,
        textColor: palettes.light.primary.base,

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
        textColor: palettes.light.primary.base,

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
        textColor: palettes.light.primary.base
      },

      connected: {
        backgroundColor: accents.good.base,
        textColor: palettes.light.primary.base
      },

      disconnected: {
        backgroundColor: accents.bad.base,
        textColor: palettes.light.primary.base
      }
    }
  }

  return _.merge(theme, overrides)
}

export const themes = {
  light: createTheme(palettes.light, palettes.accents, {}),
  dark: createTheme(palettes.dark, palettes.accents, {
    button: {
      secondary: {
        textColor: palettes.dark.primary.base
      }
    }
  })
}

export default themes
