import type { Theme } from "./themes"

export type {
  AccentName,
  AccentPaletteMap,
  Color,
  ColorPalette,
  DarkShade,
  LightShade,
} from "./colors"
export { colors, dark } from "./colors"
export { default as GlobalStyle } from "./globals"
export { GlobalScrollbarStyle } from "./GlobalScrollbarStyle"
export { ThemeConsumer, ThemeProvider, useTheme } from "./ThemeContext"
export type {
  ColorProps,
  Theme,
  ThemeSelector,
  TouchableIntentName,
} from "./themes"
export { getThemeColor, ThemeName, themes } from "./themes"
export { default as ThemeStorageSwitch } from "./ThemeStorageSwitch"

// https://styled-components.com/docs/api#create-a-declarations-file
declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
