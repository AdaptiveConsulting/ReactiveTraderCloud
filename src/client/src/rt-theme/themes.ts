import colors from './colors'
import createTheme, { GeneratedTheme, ThemeModifier } from './createTheme'

export const themes = {
  light: createTheme(colors.light, colors.accents),
  dark: createTheme(colors.dark, colors.accents, ((theme: GeneratedTheme) => ({
    ...theme,
    button: {
      ...theme.button,
      secondary: {
        ...theme.button.secondary,
        textColor: theme.primary.base,
      },
    },
  })) as ThemeModifier),
}
