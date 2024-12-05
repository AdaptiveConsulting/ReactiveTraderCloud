import { generateUISKTheme } from "./uisk/parseTheme"

export type Theme = ReturnType<typeof generateUISKTheme>
export type Density = keyof Theme["density"]
export type Spacing = keyof Theme["spacing"]
export type Width = keyof Theme["width"]
export type Radius = keyof Theme["radius"]
export type TextStyles = keyof Theme["textStyles"]
export type Color = keyof Theme["color"]
