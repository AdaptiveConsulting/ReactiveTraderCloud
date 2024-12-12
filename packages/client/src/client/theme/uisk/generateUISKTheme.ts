import { cleanKeys } from "./cleanKeys"
import { resolveTheme, UISK_ThemeModes } from "./generatedTheme"
import { setFontSizeToPx, setToUnit } from "./setToUnit"

export function generateUISKTheme(mode: UISK_ThemeModes["1. Color modes"]) {
  const theme = resolveTheme({ "1. Color modes": mode })

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
    textStyles: setFontSizeToPx(theme.textStyles),
  }
}
