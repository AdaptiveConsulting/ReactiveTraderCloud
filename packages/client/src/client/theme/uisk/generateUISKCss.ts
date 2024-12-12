import { resolveTheme, UISK_ThemeModes } from "./generatedTheme"
import { setFontSizeToPx, setToUnit } from "./setToUnit"

export const textStyleClassMap: Record<string, string> = {}
export const colorVariableMap: Record<string, string> = {}

export function generateUISKCSS(mode: UISK_ThemeModes["1. Color modes"]) {
  const theme = resolveTheme({ "1. Color modes": mode })

  const colorVars = createVariables(
    Object.fromEntries(
      Object.entries(theme.variables["1. Color modes"]).map(([key, value]) => {
        return [
          // remove the capitalized categories "Color/Background" and numbers "(900)""
          key.split("/").at(-1)?.split(" ")[0],
          value,
        ]
      }),
    ),
  )

  Object.keys(theme.variables["1. Color modes"]).forEach((key, index) => {
    colorVariableMap[key] = colorVars[index][0]
  })

  // css variables
  const vars = [
    ...createVariables(setToUnit(theme.variables["2. Radius"])),
    ...createVariables(setToUnit(theme.variables["3. Spacing"])),
    ...createVariables(setToUnit(theme.variables["4. Density"])),
    ...createVariables(setToUnit(theme.variables["5. Widths"])),
    ...createVariables(setToUnit(theme.variables["6. Containers"])),
    ...colorVars,
  ]

  vars.forEach(([key, value]) => {
    const root = document.documentElement
    root.style.setProperty(key, value)
  })

  // text style classes
  const style = document.createElement("style")

  style.textContent = createClasses(setFontSizeToPx(theme.textStyles))
  document.head.appendChild(style)
}

const createClasses = (styles: ReturnType<typeof setFontSizeToPx>) =>
  Object.entries(styles)
    .map(([key, style]) => {
      const className = toCSSClassName(key)
      // update map
      textStyleClassMap[key] = className

      return `.${className} {\n${styleObjectToCSS(style)}\n}`
    })
    .join("\n")

function toCSSClassName(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace one or more spaces with '-'
    .replace(/\//g, "-") // Replace '/' with '-'
}

function styleObjectToCSS(obj: {
  fontSize: string
  fontFamily: string
  fontStretch: string
  fontStyle: string
  fontWeight: number
  letterSpacing: number | string
  lineHeight: string
  marginBlockEnd: number
  marginInlineStart: number
  textDecoration: string
  textTransform: string
}) {
  // List of properties to remove
  const removeProps = ["marginBlockEnd", "marginInlineStart", "textDecoration"]

  const cssLines = Object.entries(obj)
    .filter(([key]) => !removeProps.includes(key))
    .map(([key, value]) => {
      // Convert camelCase or PascalCase keys to kebab-case
      const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase()
      return `${kebabKey}: ${value};`
    })

  return cssLines.join("\n")
}

const createVariables = (variables: Record<string, string>) =>
  Object.entries(variables).map(([key, value]) => ["--" + key, value])
