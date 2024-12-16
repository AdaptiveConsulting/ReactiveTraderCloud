import { cleanKeys } from "./cleanKeys"
import { resolveTheme, UISK_ThemeModes } from "./generatedTheme"

type Theme = ReturnType<typeof resolveTheme>

function parseTheme(theme: Theme) {
  return {
    color: theme.variables["1. Color modes"],
    radius: setToUnit(cleanKeys(theme.variables["2. Radius"], "radius")),
    spacing: setToUnit(cleanKeys(theme.variables["3. Spacing"], "spacing")),
    density: setToUnit(cleanKeys(theme.variables["4. Density"], "density")),
    width: setToUnit(cleanKeys(theme.variables["5. Widths"], "width")),
    container: setToUnit(
      cleanKeys(theme.variables["6. Containers"], "container"),
    ),
    typography: setToUnit(theme.variables["7. Typography"]),
    textStyles: convertFontSizeToPx(theme.textStyles),
  }
}

function convertFontSizeToPx(textStyles: Theme["textStyles"]) {
  return Object.fromEntries(
    Object.entries(textStyles).map(([key, style]) => [
      key,
      { ...style, fontSize: style.fontSize + "px" },
    ]),
  )
}

type Unit = "px"

function setToUnit(
  object: { [key: string]: number | string },
  unit: Unit = "px",
) {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) =>
      typeof value === "number" ? [key, `${value}${unit}`] : [key, value],
    ),
  )
}

export const generateUISKTheme = (mode: UISK_ThemeModes["1. Color modes"]) =>
  parseTheme(resolveTheme({ "1. Color modes": mode }))
