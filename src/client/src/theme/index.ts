import type { Theme } from "./themes"
export { colors, dark } from "./colors"
export type {
  AccentName,
  AccentPaletteMap,
  Color,
  ColorPalette,
  DarkShade,
  LightShade,
} from "./colors"
export { default as GlobalStyle } from "./globals"
export { GlobalScrollbarStyle } from "./GlobalScrollbarStyle"
export { ThemeConsumer, ThemeProvider, useTheme } from "./ThemeContext"
export { getThemeColor, ThemeName, themes } from "./themes"
export type {
  ColorProps,
  Theme,
  ThemeSelector,
  TouchableIntentName,
} from "./themes"
export { default as ThemeStorageSwitch } from "./ThemeStorageSwitch"

// Make all styled-component functions (e.g. `styled`, `css`) typed with Theme
// See https://github.com/styled-components/styled-components-website/issues/447
declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
