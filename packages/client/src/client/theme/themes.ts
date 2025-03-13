import { Color } from "./colors"
import { Theme as UISKTheme } from "./types"
import { generateUISKTheme } from "./uisk/generateUISKTheme"

export enum ThemeName {
  Light = "light",
  Dark = "dark",
}
interface BaseTheme {
  motion: Motion & {
    fast: Motion
    normal: Motion
    slow: Motion
  }
}
type GeneratedTheme = ReturnType<typeof createTheme>
export type Theme = BaseTheme & GeneratedTheme

interface Motion {
  easing: string
}

export type ThemeSelector = (theme: Theme) => Color | undefined

export interface ColorProps {
  bg?: ThemeSelector
  fg?: ThemeSelector
}

function isColor(value: string | ThemeSelector): value is Color {
  return typeof value === "string" && /^(#|rgb|hsl)/.test(value)
}
export const getThemeColor = (
  theme: Theme,
  color: Color | ThemeSelector,
  fallback?: Color,
) =>
  typeof color === "function"
    ? color(theme) || fallback
    : isColor(color)
      ? color
      : fallback

const createTheme = (name: ThemeName, theme: UISKTheme) => ({
  name,

  motion: {
    duration: 16 * 16,
    easing: "cubic-bezier(0.165, 0.84, 0.44, 1)",

    fast: {
      duration: 16 * 16,
      easing: "cubic-bezier(0.19, 1, 0.22, 1)",
    },

    normal: {
      duration: 16 * 16,
      easing: "cubic-bezier(0.165, 0.84, 0.44, 1)",
    },

    slow: {
      duration: 16 * 16,
      easing: "cubic-bezier(0.165, 0.84, 0.44, 1)",
    },
  },
  ...theme,
})

const lightTheme: Theme = createTheme(
  ThemeName.Light,
  generateUISKTheme("Light mode") as unknown as UISKTheme,
)
const darkTheme: Theme = createTheme(
  ThemeName.Dark,
  generateUISKTheme("Dark mode") as unknown as UISKTheme,
)

export const themes: Record<ThemeName, Theme> = {
  light: lightTheme,
  dark: darkTheme,
}
