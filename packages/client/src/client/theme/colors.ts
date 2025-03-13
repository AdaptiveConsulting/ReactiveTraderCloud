import { generateUISKTheme } from "./uisk/generateUISKTheme"

export type Color = string

export const colors = {
  newThemeLight: generateUISKTheme("Light mode").color,
  newThemeDark: generateUISKTheme("Dark mode").color,
}
