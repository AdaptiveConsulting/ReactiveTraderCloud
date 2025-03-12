import type { Theme } from "./themes"

export type { Color } from "./colors"
export { colors } from "./colors"
export { default as GlobalStyle } from "./globals"
export { ThemeConsumer, ThemeProvider, useTheme } from "./ThemeContext"
export type { ColorProps, Theme, ThemeSelector } from "./themes"
export { getThemeColor, ThemeName, themes } from "./themes"
export { default as ThemeStorageSwitch } from "./ThemeStorageSwitch"

// https://styled-components.com/docs/api#create-a-declarations-file
declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
