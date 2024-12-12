import { resolveTheme } from "./generatedTheme"

type Unit = "px"
type Theme = ReturnType<typeof resolveTheme>

export function setToUnit(
  object: { [key: string]: number | string },
  unit: Unit = "px",
) {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) =>
      typeof value === "number" ? [key, `${value}${unit}`] : [key, value],
    ),
  )
}

export function setFontSizeToPx(textStyles: Theme["textStyles"]) {
  return Object.fromEntries(
    Object.entries(textStyles).map(([key, style]) => [
      key,
      { ...style, fontSize: style.fontSize + "px" },
    ]),
  )
}
