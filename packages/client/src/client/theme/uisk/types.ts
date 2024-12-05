import { resolveTheme } from "./generatedTheme"

export type GeneratedTheme = ReturnType<typeof resolveTheme>

export type GeneratedThemeVariables = GeneratedTheme["variables"]
