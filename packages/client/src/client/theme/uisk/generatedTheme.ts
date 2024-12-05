// -----------------------------------------------------------------------------
//
// This is a generated file. Do not modify it, modify the generator instead.
//
// -----------------------------------------------------------------------------

export type UISK_Theme = {
  variables: UISK_Variables
  currentModes: UISK_ThemeModes
  textStyles: UISK_TextStyles
}
export type UISK_ThemeModes = {
  _Primitives: "Adaptive" | "Aeron"
  "2. Radius": "Default"
  "3. Spacing": "Default"
  "5. Widths": "Default"
  "6. Containers": "Default"
  "7. Typography": "Default"
  "1. Color modes": "Dark mode" | "Light mode"
  "4. Density": "Comfortable" | "Compact" | "Spacious"
}
export type UISK_TextStyleName =
  | "Display 2xl/Regular"
  | "Display 2xl/Medium"
  | "Display 2xl/Semibold"
  | "Display 2xl/Bold"
  | "Display xl/Regular"
  | "Display xl/Medium"
  | "Display xl/Semibold"
  | "Display xl/Bold"
  | "Display lg/Regular"
  | "Display lg/Medium"
  | "Display lg/Semibold"
  | "Display lg/Bold"
  | "Display md/Regular"
  | "Display md/Medium"
  | "Display md/Semibold"
  | "Display md/Bold"
  | "Display sm/Regular"
  | "Display sm/Medium"
  | "Display sm/Semibold"
  | "Display sm/Bold"
  | "Display xs/Regular"
  | "Display xs/Medium"
  | "Display xs/Semibold"
  | "Display xs/Bold"
  | "Text xl/Regular"
  | "Text xl/Medium"
  | "Text xl/Semibold"
  | "Text xl/Bold"
  | "Text xl/Regular italic"
  | "Text xl/Medium italic"
  | "Text xl/Semibold italic"
  | "Text xl/Bold italic"
  | "Text xl/Regular underlined"
  | "Text lg/Regular"
  | "Text lg/Medium"
  | "Text lg/Semibold"
  | "Text lg/Bold"
  | "Text lg/Regular italic"
  | "Text lg/Medium italic"
  | "Text lg/Semibold italic"
  | "Text lg/Bold italic"
  | "Text lg/Regular underlined"
  | "Text md/Regular"
  | "Text md/Medium"
  | "Text md/Semibold"
  | "Text md/Bold"
  | "Text md/Regular italic"
  | "Text md/Medium italic"
  | "Text md/Semibold italic"
  | "Text md/Bold italic"
  | "Text md/Regular underlined"
  | "Text sm/Regular"
  | "Text sm/Medium"
  | "Text sm/Semibold"
  | "Text sm/Bold"
  | "Text sm/Regular italic"
  | "Text sm/Regular underlined"
  | "Text sm/Medium italic"
  | "Text sm/Semibold italic"
  | "Text sm/Bold italic"
  | "Text xs/Regular"
  | "Text xs/Medium"
  | "Text xs/Semibold"
  | "Text xs/Bold"
  | "Text xs/Regular italic"
  | "Text xs/Regular underlined"
  | "Text xs/Medium italic"
  | "Text xs/Semibold italic"
  | "Text xs/Bold italic"
  | "Text xxs/Regular"
  | "Text xxs/Medium"
  | "Text xxs/Semibold"
  | "Text xxs/Bold"
  | "Text xxs/Regular italic"
  | "Text xxs/Regular underlined"
  | "Text xxs/Medium italic"
  | "Text xxs/Semibold italic"
  | "Text xxs/Bold italic"
export type UISK_ThemeOptions = Partial<UISK_ThemeModes>

export const modeNames = {
  _Primitives: ["Adaptive", "Aeron"],
  "2. Radius": ["Default"],
  "3. Spacing": ["Default"],
  "5. Widths": ["Default"],
  "6. Containers": ["Default"],
  "7. Typography": ["Default"],
  "1. Color modes": ["Dark mode", "Light mode"],
  "4. Density": ["Comfortable", "Compact", "Spacious"],
} as const

/** Resolves all variables and text styles for a theme based on a set of modes. */
export function resolveTheme(options?: UISK_ThemeOptions): UISK_Theme {
  const currentModes: UISK_ThemeModes = {
    _Primitives: options?.["_Primitives"] ?? "Adaptive",
    "2. Radius": options?.["2. Radius"] ?? "Default",
    "3. Spacing": options?.["3. Spacing"] ?? "Default",
    "5. Widths": options?.["5. Widths"] ?? "Default",
    "6. Containers": options?.["6. Containers"] ?? "Default",
    "7. Typography": options?.["7. Typography"] ?? "Default",
    "1. Color modes": options?.["1. Color modes"] ?? "Dark mode",
    "4. Density": options?.["4. Density"] ?? "Comfortable",
  }
  const variables: UISK_Variables = {
    _Primitives: collections["_Primitives"].modes[currentModes["_Primitives"]],
    "2. Radius": collections["2. Radius"].modes[currentModes["2. Radius"]],
    "3. Spacing": collections["3. Spacing"].modes[currentModes["3. Spacing"]],
    "5. Widths": collections["5. Widths"].modes[currentModes["5. Widths"]],
    "6. Containers":
      collections["6. Containers"].modes[currentModes["6. Containers"]],
    "7. Typography":
      collections["7. Typography"].modes[currentModes["7. Typography"]],
    "1. Color modes":
      collections["1. Color modes"].modes[currentModes["1. Color modes"]],
    "4. Density": collections["4. Density"].modes[currentModes["4. Density"]],
  }
  const textStyles: UISK_TextStyles = {
    "Display 2xl/Regular": resolveTextStyle(
      variables,
      internalTextStyles["Display 2xl/Regular"],
    ),
    "Display 2xl/Medium": resolveTextStyle(
      variables,
      internalTextStyles["Display 2xl/Medium"],
    ),
    "Display 2xl/Semibold": resolveTextStyle(
      variables,
      internalTextStyles["Display 2xl/Semibold"],
    ),
    "Display 2xl/Bold": resolveTextStyle(
      variables,
      internalTextStyles["Display 2xl/Bold"],
    ),
    "Display xl/Regular": resolveTextStyle(
      variables,
      internalTextStyles["Display xl/Regular"],
    ),
    "Display xl/Medium": resolveTextStyle(
      variables,
      internalTextStyles["Display xl/Medium"],
    ),
    "Display xl/Semibold": resolveTextStyle(
      variables,
      internalTextStyles["Display xl/Semibold"],
    ),
    "Display xl/Bold": resolveTextStyle(
      variables,
      internalTextStyles["Display xl/Bold"],
    ),
    "Display lg/Regular": resolveTextStyle(
      variables,
      internalTextStyles["Display lg/Regular"],
    ),
    "Display lg/Medium": resolveTextStyle(
      variables,
      internalTextStyles["Display lg/Medium"],
    ),
    "Display lg/Semibold": resolveTextStyle(
      variables,
      internalTextStyles["Display lg/Semibold"],
    ),
    "Display lg/Bold": resolveTextStyle(
      variables,
      internalTextStyles["Display lg/Bold"],
    ),
    "Display md/Regular": resolveTextStyle(
      variables,
      internalTextStyles["Display md/Regular"],
    ),
    "Display md/Medium": resolveTextStyle(
      variables,
      internalTextStyles["Display md/Medium"],
    ),
    "Display md/Semibold": resolveTextStyle(
      variables,
      internalTextStyles["Display md/Semibold"],
    ),
    "Display md/Bold": resolveTextStyle(
      variables,
      internalTextStyles["Display md/Bold"],
    ),
    "Display sm/Regular": resolveTextStyle(
      variables,
      internalTextStyles["Display sm/Regular"],
    ),
    "Display sm/Medium": resolveTextStyle(
      variables,
      internalTextStyles["Display sm/Medium"],
    ),
    "Display sm/Semibold": resolveTextStyle(
      variables,
      internalTextStyles["Display sm/Semibold"],
    ),
    "Display sm/Bold": resolveTextStyle(
      variables,
      internalTextStyles["Display sm/Bold"],
    ),
    "Display xs/Regular": resolveTextStyle(
      variables,
      internalTextStyles["Display xs/Regular"],
    ),
    "Display xs/Medium": resolveTextStyle(
      variables,
      internalTextStyles["Display xs/Medium"],
    ),
    "Display xs/Semibold": resolveTextStyle(
      variables,
      internalTextStyles["Display xs/Semibold"],
    ),
    "Display xs/Bold": resolveTextStyle(
      variables,
      internalTextStyles["Display xs/Bold"],
    ),
    "Text xl/Regular": resolveTextStyle(
      variables,
      internalTextStyles["Text xl/Regular"],
    ),
    "Text xl/Medium": resolveTextStyle(
      variables,
      internalTextStyles["Text xl/Medium"],
    ),
    "Text xl/Semibold": resolveTextStyle(
      variables,
      internalTextStyles["Text xl/Semibold"],
    ),
    "Text xl/Bold": resolveTextStyle(
      variables,
      internalTextStyles["Text xl/Bold"],
    ),
    "Text xl/Regular italic": resolveTextStyle(
      variables,
      internalTextStyles["Text xl/Regular italic"],
    ),
    "Text xl/Medium italic": resolveTextStyle(
      variables,
      internalTextStyles["Text xl/Medium italic"],
    ),
    "Text xl/Semibold italic": resolveTextStyle(
      variables,
      internalTextStyles["Text xl/Semibold italic"],
    ),
    "Text xl/Bold italic": resolveTextStyle(
      variables,
      internalTextStyles["Text xl/Bold italic"],
    ),
    "Text xl/Regular underlined": resolveTextStyle(
      variables,
      internalTextStyles["Text xl/Regular underlined"],
    ),
    "Text lg/Regular": resolveTextStyle(
      variables,
      internalTextStyles["Text lg/Regular"],
    ),
    "Text lg/Medium": resolveTextStyle(
      variables,
      internalTextStyles["Text lg/Medium"],
    ),
    "Text lg/Semibold": resolveTextStyle(
      variables,
      internalTextStyles["Text lg/Semibold"],
    ),
    "Text lg/Bold": resolveTextStyle(
      variables,
      internalTextStyles["Text lg/Bold"],
    ),
    "Text lg/Regular italic": resolveTextStyle(
      variables,
      internalTextStyles["Text lg/Regular italic"],
    ),
    "Text lg/Medium italic": resolveTextStyle(
      variables,
      internalTextStyles["Text lg/Medium italic"],
    ),
    "Text lg/Semibold italic": resolveTextStyle(
      variables,
      internalTextStyles["Text lg/Semibold italic"],
    ),
    "Text lg/Bold italic": resolveTextStyle(
      variables,
      internalTextStyles["Text lg/Bold italic"],
    ),
    "Text lg/Regular underlined": resolveTextStyle(
      variables,
      internalTextStyles["Text lg/Regular underlined"],
    ),
    "Text md/Regular": resolveTextStyle(
      variables,
      internalTextStyles["Text md/Regular"],
    ),
    "Text md/Medium": resolveTextStyle(
      variables,
      internalTextStyles["Text md/Medium"],
    ),
    "Text md/Semibold": resolveTextStyle(
      variables,
      internalTextStyles["Text md/Semibold"],
    ),
    "Text md/Bold": resolveTextStyle(
      variables,
      internalTextStyles["Text md/Bold"],
    ),
    "Text md/Regular italic": resolveTextStyle(
      variables,
      internalTextStyles["Text md/Regular italic"],
    ),
    "Text md/Medium italic": resolveTextStyle(
      variables,
      internalTextStyles["Text md/Medium italic"],
    ),
    "Text md/Semibold italic": resolveTextStyle(
      variables,
      internalTextStyles["Text md/Semibold italic"],
    ),
    "Text md/Bold italic": resolveTextStyle(
      variables,
      internalTextStyles["Text md/Bold italic"],
    ),
    "Text md/Regular underlined": resolveTextStyle(
      variables,
      internalTextStyles["Text md/Regular underlined"],
    ),
    "Text sm/Regular": resolveTextStyle(
      variables,
      internalTextStyles["Text sm/Regular"],
    ),
    "Text sm/Medium": resolveTextStyle(
      variables,
      internalTextStyles["Text sm/Medium"],
    ),
    "Text sm/Semibold": resolveTextStyle(
      variables,
      internalTextStyles["Text sm/Semibold"],
    ),
    "Text sm/Bold": resolveTextStyle(
      variables,
      internalTextStyles["Text sm/Bold"],
    ),
    "Text sm/Regular italic": resolveTextStyle(
      variables,
      internalTextStyles["Text sm/Regular italic"],
    ),
    "Text sm/Regular underlined": resolveTextStyle(
      variables,
      internalTextStyles["Text sm/Regular underlined"],
    ),
    "Text sm/Medium italic": resolveTextStyle(
      variables,
      internalTextStyles["Text sm/Medium italic"],
    ),
    "Text sm/Semibold italic": resolveTextStyle(
      variables,
      internalTextStyles["Text sm/Semibold italic"],
    ),
    "Text sm/Bold italic": resolveTextStyle(
      variables,
      internalTextStyles["Text sm/Bold italic"],
    ),
    "Text xs/Regular": resolveTextStyle(
      variables,
      internalTextStyles["Text xs/Regular"],
    ),
    "Text xs/Medium": resolveTextStyle(
      variables,
      internalTextStyles["Text xs/Medium"],
    ),
    "Text xs/Semibold": resolveTextStyle(
      variables,
      internalTextStyles["Text xs/Semibold"],
    ),
    "Text xs/Bold": resolveTextStyle(
      variables,
      internalTextStyles["Text xs/Bold"],
    ),
    "Text xs/Regular italic": resolveTextStyle(
      variables,
      internalTextStyles["Text xs/Regular italic"],
    ),
    "Text xs/Regular underlined": resolveTextStyle(
      variables,
      internalTextStyles["Text xs/Regular underlined"],
    ),
    "Text xs/Medium italic": resolveTextStyle(
      variables,
      internalTextStyles["Text xs/Medium italic"],
    ),
    "Text xs/Semibold italic": resolveTextStyle(
      variables,
      internalTextStyles["Text xs/Semibold italic"],
    ),
    "Text xs/Bold italic": resolveTextStyle(
      variables,
      internalTextStyles["Text xs/Bold italic"],
    ),
    "Text xxs/Regular": resolveTextStyle(
      variables,
      internalTextStyles["Text xxs/Regular"],
    ),
    "Text xxs/Medium": resolveTextStyle(
      variables,
      internalTextStyles["Text xxs/Medium"],
    ),
    "Text xxs/Semibold": resolveTextStyle(
      variables,
      internalTextStyles["Text xxs/Semibold"],
    ),
    "Text xxs/Bold": resolveTextStyle(
      variables,
      internalTextStyles["Text xxs/Bold"],
    ),
    "Text xxs/Regular italic": resolveTextStyle(
      variables,
      internalTextStyles["Text xxs/Regular italic"],
    ),
    "Text xxs/Regular underlined": resolveTextStyle(
      variables,
      internalTextStyles["Text xxs/Regular underlined"],
    ),
    "Text xxs/Medium italic": resolveTextStyle(
      variables,
      internalTextStyles["Text xxs/Medium italic"],
    ),
    "Text xxs/Semibold italic": resolveTextStyle(
      variables,
      internalTextStyles["Text xxs/Semibold italic"],
    ),
    "Text xxs/Bold italic": resolveTextStyle(
      variables,
      internalTextStyles["Text xxs/Bold italic"],
    ),
  }
  return {
    variables,
    currentModes,
    textStyles,
  }
}

type UISK_Collection<TName extends string, TMode extends string, TVariables> = {
  [name in TName]: {
    defaultModeName: TMode
    modeNames: TMode[]
    modes: {
      [mode in TMode]: TVariables
    }
  }
}
type UISK_Collections = UISK_Collection0 &
  UISK_Collection1 &
  UISK_Collection2 &
  UISK_Collection3 &
  UISK_Collection4 &
  UISK_Collection5 &
  UISK_Collection6 &
  UISK_Collection7
export type UISK_Variables = {
  ["_Primitives"]: UISK_Variables0
  ["2. Radius"]: UISK_Variables1
  ["3. Spacing"]: UISK_Variables2
  ["5. Widths"]: UISK_Variables3
  ["6. Containers"]: UISK_Variables4
  ["7. Typography"]: UISK_Variables5
  ["1. Color modes"]: UISK_Variables6
  ["4. Density"]: UISK_Variables7
}
type UISK_Collection0 = UISK_Collection<
  "_Primitives",
  "Adaptive" | "Aeron",
  UISK_Variables0
>
type UISK_Variables0 = {
  "Colors/Base/white": string
  "Colors/Base/black": string
  "Colors/Base/transparent": string
  "Colors/Light mode/25": string
  "Colors/Light mode/50": string
  "Colors/Light mode/100": string
  "Colors/Light mode/200": string
  "Colors/Light mode/300": string
  "Colors/Light mode/400": string
  "Colors/Light mode/500": string
  "Colors/Light mode/600": string
  "Colors/Light mode/700": string
  "Colors/Light mode/800": string
  "Colors/Light mode/900": string
  "Colors/Light mode/950": string
  "Colors/Dark mode/25": string
  "Colors/Dark mode/50": string
  "Colors/Dark mode/100": string
  "Colors/Dark mode/200": string
  "Colors/Dark mode/300": string
  "Colors/Dark mode/400": string
  "Colors/Dark mode/500": string
  "Colors/Dark mode/600": string
  "Colors/Dark mode/700": string
  "Colors/Dark mode/800": string
  "Colors/Dark mode/900": string
  "Colors/Dark mode/950": string
  "Colors/Brand Primary/25": string
  "Colors/Brand Primary/50": string
  "Colors/Brand Primary/100": string
  "Colors/Brand Primary/200": string
  "Colors/Brand Primary/300": string
  "Colors/Brand Primary/400": string
  "Colors/Brand Primary/500": string
  "Colors/Brand Primary/600": string
  "Colors/Brand Primary/700": string
  "Colors/Brand Primary/800": string
  "Colors/Brand Primary/900": string
  "Colors/Brand Primary/950": string
  "Colors/Brand Secondary/25": string
  "Colors/Brand Secondary/50": string
  "Colors/Brand Secondary/100": string
  "Colors/Brand Secondary/200": string
  "Colors/Brand Secondary/300": string
  "Colors/Brand Secondary/400": string
  "Colors/Brand Secondary/500": string
  "Colors/Brand Secondary/600": string
  "Colors/Brand Secondary/700": string
  "Colors/Brand Secondary/800": string
  "Colors/Brand Secondary/900": string
  "Colors/Brand Secondary/950": string
  "Colors/Error/25": string
  "Colors/Error/50": string
  "Colors/Error/100": string
  "Colors/Error/200": string
  "Colors/Error/300": string
  "Colors/Error/400": string
  "Colors/Error/500": string
  "Colors/Error/600": string
  "Colors/Error/700": string
  "Colors/Error/800": string
  "Colors/Error/900": string
  "Colors/Error/950": string
  "Colors/Warning/25": string
  "Colors/Warning/50": string
  "Colors/Warning/100": string
  "Colors/Warning/200": string
  "Colors/Warning/300": string
  "Colors/Warning/400": string
  "Colors/Warning/500": string
  "Colors/Warning/600": string
  "Colors/Warning/700": string
  "Colors/Warning/800": string
  "Colors/Warning/900": string
  "Colors/Warning/950": string
  "Colors/Success/25": string
  "Colors/Success/50": string
  "Colors/Success/100": string
  "Colors/Success/200": string
  "Colors/Success/300": string
  "Colors/Success/400": string
  "Colors/Success/500": string
  "Colors/Success/600": string
  "Colors/Success/700": string
  "Colors/Success/800": string
  "Colors/Success/900": string
  "Colors/Success/950": string
  "Colors/Data/Positive/25": string
  "Colors/Data/Positive/50": string
  "Colors/Data/Positive/100": string
  "Colors/Data/Positive/200": string
  "Colors/Data/Positive/300": string
  "Colors/Data/Positive/400": string
  "Colors/Data/Positive/500": string
  "Colors/Data/Positive/600": string
  "Colors/Data/Positive/700": string
  "Colors/Data/Positive/800": string
  "Colors/Data/Positive/900": string
  "Colors/Data/Positive/950": string
  "Colors/Data/Negative/25": string
  "Colors/Data/Negative/50": string
  "Colors/Data/Negative/100": string
  "Colors/Data/Negative/200": string
  "Colors/Data/Negative/300": string
  "Colors/Data/Negative/400": string
  "Colors/Data/Negative/500": string
  "Colors/Data/Negative/600": string
  "Colors/Data/Negative/700": string
  "Colors/Data/Negative/800": string
  "Colors/Data/Negative/900": string
  "Colors/Data/Negative/950": string
  "Colors/Data/Neutral/25": string
  "Colors/Data/Neutral/50": string
  "Colors/Data/Neutral/100": string
  "Colors/Data/Neutral/200": string
  "Colors/Data/Neutral/300": string
  "Colors/Data/Neutral/400": string
  "Colors/Data/Neutral/500": string
  "Colors/Data/Neutral/600": string
  "Colors/Data/Neutral/700": string
  "Colors/Data/Neutral/800": string
  "Colors/Data/Neutral/900": string
  "Colors/Data/Neutral/950": string
  "Colors/Palette Library/Gray blue/25": string
  "Colors/Palette Library/Gray blue/50": string
  "Colors/Palette Library/Gray blue/100": string
  "Colors/Palette Library/Gray blue/200": string
  "Colors/Palette Library/Gray blue/300": string
  "Colors/Palette Library/Gray blue/400": string
  "Colors/Palette Library/Gray blue/500": string
  "Colors/Palette Library/Gray blue/600": string
  "Colors/Palette Library/Gray blue/700": string
  "Colors/Palette Library/Gray blue/800": string
  "Colors/Palette Library/Gray blue/900": string
  "Colors/Palette Library/Gray blue/950": string
  "Colors/Palette Library/Gray cool/25": string
  "Colors/Palette Library/Gray cool/50": string
  "Colors/Palette Library/Gray cool/100": string
  "Colors/Palette Library/Gray cool/200": string
  "Colors/Palette Library/Gray cool/300": string
  "Colors/Palette Library/Gray cool/400": string
  "Colors/Palette Library/Gray cool/500": string
  "Colors/Palette Library/Gray cool/600": string
  "Colors/Palette Library/Gray cool/700": string
  "Colors/Palette Library/Gray cool/800": string
  "Colors/Palette Library/Gray cool/900": string
  "Colors/Palette Library/Gray cool/950": string
  "Colors/Palette Library/Gray modern/25": string
  "Colors/Palette Library/Gray modern/50": string
  "Colors/Palette Library/Gray modern/100": string
  "Colors/Palette Library/Gray modern/200": string
  "Colors/Palette Library/Gray modern/300": string
  "Colors/Palette Library/Gray modern/400": string
  "Colors/Palette Library/Gray modern/500": string
  "Colors/Palette Library/Gray modern/600": string
  "Colors/Palette Library/Gray modern/700": string
  "Colors/Palette Library/Gray modern/800": string
  "Colors/Palette Library/Gray modern/900": string
  "Colors/Palette Library/Gray modern/950": string
  "Colors/Palette Library/Gray neutral/25": string
  "Colors/Palette Library/Gray neutral/50": string
  "Colors/Palette Library/Gray neutral/100": string
  "Colors/Palette Library/Gray neutral/200": string
  "Colors/Palette Library/Gray neutral/300": string
  "Colors/Palette Library/Gray neutral/400": string
  "Colors/Palette Library/Gray neutral/500": string
  "Colors/Palette Library/Gray neutral/600": string
  "Colors/Palette Library/Gray neutral/700": string
  "Colors/Palette Library/Gray neutral/800": string
  "Colors/Palette Library/Gray neutral/900": string
  "Colors/Palette Library/Gray neutral/950": string
  "Colors/Palette Library/Green/25": string
  "Colors/Palette Library/Green/50": string
  "Colors/Palette Library/Green/100": string
  "Colors/Palette Library/Green/200": string
  "Colors/Palette Library/Green/300": string
  "Colors/Palette Library/Green/400": string
  "Colors/Palette Library/Green/500": string
  "Colors/Palette Library/Green/600": string
  "Colors/Palette Library/Green/700": string
  "Colors/Palette Library/Green/800": string
  "Colors/Palette Library/Green/900": string
  "Colors/Palette Library/Green/950": string
  "Colors/Palette Library/Gray iron/25": string
  "Colors/Palette Library/Gray iron/50": string
  "Colors/Palette Library/Gray iron/100": string
  "Colors/Palette Library/Gray iron/200": string
  "Colors/Palette Library/Gray iron/300": string
  "Colors/Palette Library/Gray iron/400": string
  "Colors/Palette Library/Gray iron/500": string
  "Colors/Palette Library/Gray iron/600": string
  "Colors/Palette Library/Gray iron/700": string
  "Colors/Palette Library/Gray iron/800": string
  "Colors/Palette Library/Gray iron/900": string
  "Colors/Palette Library/Gray iron/950": string
  "Colors/Palette Library/Gray true/25": string
  "Colors/Palette Library/Gray true/50": string
  "Colors/Palette Library/Gray true/100": string
  "Colors/Palette Library/Gray true/200": string
  "Colors/Palette Library/Gray true/300": string
  "Colors/Palette Library/Gray true/400": string
  "Colors/Palette Library/Gray true/500": string
  "Colors/Palette Library/Gray true/600": string
  "Colors/Palette Library/Gray true/700": string
  "Colors/Palette Library/Gray true/800": string
  "Colors/Palette Library/Gray true/900": string
  "Colors/Palette Library/Gray true/950": string
  "Colors/Palette Library/Gray warm/25": string
  "Colors/Palette Library/Gray warm/50": string
  "Colors/Palette Library/Gray warm/100": string
  "Colors/Palette Library/Gray warm/200": string
  "Colors/Palette Library/Gray warm/300": string
  "Colors/Palette Library/Gray warm/400": string
  "Colors/Palette Library/Gray warm/500": string
  "Colors/Palette Library/Gray warm/600": string
  "Colors/Palette Library/Gray warm/700": string
  "Colors/Palette Library/Gray warm/800": string
  "Colors/Palette Library/Gray warm/900": string
  "Colors/Palette Library/Gray warm/950": string
  "Colors/Palette Library/Moss/25": string
  "Colors/Palette Library/Moss/50": string
  "Colors/Palette Library/Moss/100": string
  "Colors/Palette Library/Moss/200": string
  "Colors/Palette Library/Moss/300": string
  "Colors/Palette Library/Moss/400": string
  "Colors/Palette Library/Moss/500": string
  "Colors/Palette Library/Moss/600": string
  "Colors/Palette Library/Moss/700": string
  "Colors/Palette Library/Moss/800": string
  "Colors/Palette Library/Moss/900": string
  "Colors/Palette Library/Moss/950": string
  "Colors/Palette Library/Green light/25": string
  "Colors/Palette Library/Green light/50": string
  "Colors/Palette Library/Green light/100": string
  "Colors/Palette Library/Green light/200": string
  "Colors/Palette Library/Green light/300": string
  "Colors/Palette Library/Green light/400": string
  "Colors/Palette Library/Green light/500": string
  "Colors/Palette Library/Green light/600": string
  "Colors/Palette Library/Green light/700": string
  "Colors/Palette Library/Green light/800": string
  "Colors/Palette Library/Green light/900": string
  "Colors/Palette Library/Green light/950": string
  "Colors/Palette Library/Teal/25": string
  "Colors/Palette Library/Teal/50": string
  "Colors/Palette Library/Teal/100": string
  "Colors/Palette Library/Teal/200": string
  "Colors/Palette Library/Teal/300": string
  "Colors/Palette Library/Teal/400": string
  "Colors/Palette Library/Teal/500": string
  "Colors/Palette Library/Teal/600": string
  "Colors/Palette Library/Teal/700": string
  "Colors/Palette Library/Teal/800": string
  "Colors/Palette Library/Teal/900": string
  "Colors/Palette Library/Teal/950": string
  "Colors/Palette Library/Cyan/25": string
  "Colors/Palette Library/Cyan/50": string
  "Colors/Palette Library/Cyan/100": string
  "Colors/Palette Library/Cyan/200": string
  "Colors/Palette Library/Cyan/300": string
  "Colors/Palette Library/Cyan/400": string
  "Colors/Palette Library/Cyan/500": string
  "Colors/Palette Library/Cyan/600": string
  "Colors/Palette Library/Cyan/700": string
  "Colors/Palette Library/Cyan/800": string
  "Colors/Palette Library/Cyan/900": string
  "Colors/Palette Library/Cyan/950": string
  "Colors/Palette Library/Blue light/25": string
  "Colors/Palette Library/Blue light/50": string
  "Colors/Palette Library/Blue light/100": string
  "Colors/Palette Library/Blue light/200": string
  "Colors/Palette Library/Blue light/300": string
  "Colors/Palette Library/Blue light/400": string
  "Colors/Palette Library/Blue light/500": string
  "Colors/Palette Library/Blue light/600": string
  "Colors/Palette Library/Blue light/700": string
  "Colors/Palette Library/Blue light/800": string
  "Colors/Palette Library/Blue light/900": string
  "Colors/Palette Library/Blue light/950": string
  "Colors/Palette Library/Blue/25": string
  "Colors/Palette Library/Blue/50": string
  "Colors/Palette Library/Blue/100": string
  "Colors/Palette Library/Blue/200": string
  "Colors/Palette Library/Blue/300": string
  "Colors/Palette Library/Blue/400": string
  "Colors/Palette Library/Blue/500": string
  "Colors/Palette Library/Blue/600": string
  "Colors/Palette Library/Blue/700": string
  "Colors/Palette Library/Blue/800": string
  "Colors/Palette Library/Blue/900": string
  "Colors/Palette Library/Blue/950": string
  "Colors/Palette Library/Blue dark/25": string
  "Colors/Palette Library/Blue dark/50": string
  "Colors/Palette Library/Blue dark/100": string
  "Colors/Palette Library/Blue dark/200": string
  "Colors/Palette Library/Blue dark/300": string
  "Colors/Palette Library/Blue dark/400": string
  "Colors/Palette Library/Blue dark/500": string
  "Colors/Palette Library/Blue dark/600": string
  "Colors/Palette Library/Blue dark/700": string
  "Colors/Palette Library/Blue dark/800": string
  "Colors/Palette Library/Blue dark/900": string
  "Colors/Palette Library/Blue dark/950": string
  "Colors/Palette Library/Indigo/25": string
  "Colors/Palette Library/Indigo/50": string
  "Colors/Palette Library/Indigo/100": string
  "Colors/Palette Library/Indigo/200": string
  "Colors/Palette Library/Indigo/300": string
  "Colors/Palette Library/Indigo/400": string
  "Colors/Palette Library/Indigo/500": string
  "Colors/Palette Library/Indigo/600": string
  "Colors/Palette Library/Indigo/700": string
  "Colors/Palette Library/Indigo/800": string
  "Colors/Palette Library/Indigo/900": string
  "Colors/Palette Library/Indigo/950": string
  "Colors/Palette Library/Violet/25": string
  "Colors/Palette Library/Violet/50": string
  "Colors/Palette Library/Violet/100": string
  "Colors/Palette Library/Violet/200": string
  "Colors/Palette Library/Violet/300": string
  "Colors/Palette Library/Violet/400": string
  "Colors/Palette Library/Violet/500": string
  "Colors/Palette Library/Violet/600": string
  "Colors/Palette Library/Violet/700": string
  "Colors/Palette Library/Violet/800": string
  "Colors/Palette Library/Violet/900": string
  "Colors/Palette Library/Violet/950": string
  "Colors/Palette Library/Purple/25": string
  "Colors/Palette Library/Purple/50": string
  "Colors/Palette Library/Purple/100": string
  "Colors/Palette Library/Purple/200": string
  "Colors/Palette Library/Purple/300": string
  "Colors/Palette Library/Purple/400": string
  "Colors/Palette Library/Purple/500": string
  "Colors/Palette Library/Purple/600": string
  "Colors/Palette Library/Purple/700": string
  "Colors/Palette Library/Purple/800": string
  "Colors/Palette Library/Purple/900": string
  "Colors/Palette Library/Purple/950": string
  "Colors/Palette Library/Fuchsia/25": string
  "Colors/Palette Library/Fuchsia/50": string
  "Colors/Palette Library/Fuchsia/100": string
  "Colors/Palette Library/Fuchsia/200": string
  "Colors/Palette Library/Fuchsia/300": string
  "Colors/Palette Library/Fuchsia/400": string
  "Colors/Palette Library/Fuchsia/500": string
  "Colors/Palette Library/Fuchsia/600": string
  "Colors/Palette Library/Fuchsia/700": string
  "Colors/Palette Library/Fuchsia/800": string
  "Colors/Palette Library/Fuchsia/900": string
  "Colors/Palette Library/Fuchsia/950": string
  "Colors/Palette Library/Pink/25": string
  "Colors/Palette Library/Pink/50": string
  "Colors/Palette Library/Pink/100": string
  "Colors/Palette Library/Pink/200": string
  "Colors/Palette Library/Pink/300": string
  "Colors/Palette Library/Pink/400": string
  "Colors/Palette Library/Pink/500": string
  "Colors/Palette Library/Pink/600": string
  "Colors/Palette Library/Pink/700": string
  "Colors/Palette Library/Pink/800": string
  "Colors/Palette Library/Pink/900": string
  "Colors/Palette Library/Pink/950": string
  "Colors/Palette Library/Rosé/25": string
  "Colors/Palette Library/Rosé/50": string
  "Colors/Palette Library/Rosé/100": string
  "Colors/Palette Library/Rosé/200": string
  "Colors/Palette Library/Rosé/300": string
  "Colors/Palette Library/Rosé/400": string
  "Colors/Palette Library/Rosé/500": string
  "Colors/Palette Library/Rosé/600": string
  "Colors/Palette Library/Rosé/700": string
  "Colors/Palette Library/Rosé/800": string
  "Colors/Palette Library/Rosé/900": string
  "Colors/Palette Library/Rosé/950": string
  "Colors/Palette Library/Orange dark/25": string
  "Colors/Palette Library/Orange dark/50": string
  "Colors/Palette Library/Orange dark/100": string
  "Colors/Palette Library/Orange dark/200": string
  "Colors/Palette Library/Orange dark/300": string
  "Colors/Palette Library/Orange dark/400": string
  "Colors/Palette Library/Orange dark/500": string
  "Colors/Palette Library/Orange dark/600": string
  "Colors/Palette Library/Orange dark/700": string
  "Colors/Palette Library/Orange dark/800": string
  "Colors/Palette Library/Orange dark/900": string
  "Colors/Palette Library/Orange dark/950": string
  "Colors/Palette Library/Orange/25": string
  "Colors/Palette Library/Orange/50": string
  "Colors/Palette Library/Orange/100": string
  "Colors/Palette Library/Orange/200": string
  "Colors/Palette Library/Orange/300": string
  "Colors/Palette Library/Orange/400": string
  "Colors/Palette Library/Orange/500": string
  "Colors/Palette Library/Orange/600": string
  "Colors/Palette Library/Orange/700": string
  "Colors/Palette Library/Orange/800": string
  "Colors/Palette Library/Orange/900": string
  "Colors/Palette Library/Orange/950": string
  "Colors/Palette Library/Yellow/25": string
  "Colors/Palette Library/Yellow/50": string
  "Colors/Palette Library/Yellow/100": string
  "Colors/Palette Library/Yellow/200": string
  "Colors/Palette Library/Yellow/300": string
  "Colors/Palette Library/Yellow/400": string
  "Colors/Palette Library/Yellow/500": string
  "Colors/Palette Library/Yellow/600": string
  "Colors/Palette Library/Yellow/700": string
  "Colors/Palette Library/Yellow/800": string
  "Colors/Palette Library/Yellow/900": string
  "Colors/Palette Library/Yellow/950": string
  "Spacing/0": number
  "Spacing/1": number
  "Spacing/2": number
  "Spacing/3": number
  "Spacing/4": number
  "Spacing/5": number
  "Spacing/6": number
  "Spacing/8": number
  "Spacing/10": number
  "Spacing/12": number
  "Spacing/16": number
  "Spacing/20": number
  "Spacing/24": number
  "Spacing/32": number
  "Spacing/40": number
  "Spacing/48": number
  "Spacing/56": number
  "Spacing/64": number
  "Spacing/80": number
  "Spacing/96": number
  "Spacing/120": number
  "Spacing/140": number
  "Spacing/160": number
  "Spacing/180": number
  "Spacing/192": number
  "Spacing/256": number
  "Spacing/320": number
  "Spacing/360": number
  "Spacing/400": number
  "Spacing/480": number
  "Spacing/0-5": number
  "Spacing/1-5": number
  "Colors/Palette Library/Gray true/850": string
  "Colors/Dark mode/850": string
  "Colors/Palette Library/Pewter/500": string
  "Colors/Palette Library/Pewter/50": string
  "Colors/Palette Library/Pewter/100": string
  "Colors/Palette Library/Pewter/300": string
  "Colors/Palette Library/Pewter/200": string
  "Colors/Palette Library/Pewter/400": string
  "Colors/Palette Library/Pewter/600": string
  "Colors/Palette Library/Pewter/700": string
  "Colors/Palette Library/Pewter/800": string
  "Colors/Palette Library/Pewter/900": string
  "Colors/Palette Library/Pewter/950": string
  "Colors/Palette Library/Carbon/500": string
  "Colors/Palette Library/Carbon/50": string
  "Colors/Palette Library/Carbon/100": string
  "Colors/Palette Library/Carbon/200": string
  "Colors/Palette Library/Carbon/300": string
  "Colors/Palette Library/Carbon/400": string
  "Colors/Palette Library/Carbon/600": string
  "Colors/Palette Library/Carbon/700": string
  "Colors/Palette Library/Carbon/800": string
  "Colors/Palette Library/Carbon/900": string
  "Colors/Palette Library/Carbon/950": string
  "Colors/Palette Library/Granite/500": string
  "Colors/Palette Library/Granite/50": string
  "Colors/Palette Library/Granite/100": string
  "Colors/Palette Library/Granite/200": string
  "Colors/Palette Library/Granite/300": string
  "Colors/Palette Library/Granite/400": string
  "Colors/Palette Library/Granite/600": string
  "Colors/Palette Library/Granite/700": string
  "Colors/Palette Library/Granite/800": string
  "Colors/Palette Library/Granite/900": string
  "Colors/Palette Library/Granite/950": string
  "Colors/Palette Library/Titanium/500": string
  "Colors/Palette Library/Titanium/50": string
  "Colors/Palette Library/Titanium/100": string
  "Colors/Palette Library/Titanium/200": string
  "Colors/Palette Library/Titanium/300": string
  "Colors/Palette Library/Titanium/400": string
  "Colors/Palette Library/Titanium/600": string
  "Colors/Palette Library/Titanium/700": string
  "Colors/Palette Library/Titanium/800": string
  "Colors/Palette Library/Titanium/900": string
  "Colors/Palette Library/Titanium/950": string
  "Colors/Palette Library/Steel/500": string
  "Colors/Palette Library/Steel/50": string
  "Colors/Palette Library/Steel/100": string
  "Colors/Palette Library/Steel/200": string
  "Colors/Palette Library/Steel/300": string
  "Colors/Palette Library/Steel/400": string
  "Colors/Palette Library/Steel/600": string
  "Colors/Palette Library/Steel/700": string
  "Colors/Palette Library/Steel/800": string
  "Colors/Palette Library/Steel/900": string
  "Colors/Palette Library/Steel/950": string
  "Colors/Palette Library/Off White/500": string
  "Colors/Palette Library/Off White/50": string
  "Colors/Palette Library/Off White/100": string
  "Colors/Palette Library/Off White/200": string
  "Colors/Palette Library/Off White/300": string
  "Colors/Palette Library/Off White/400": string
  "Colors/Palette Library/Off White/600": string
  "Colors/Palette Library/Off White/700": string
  "Colors/Palette Library/Off White/800": string
  "Colors/Palette Library/Off White/900": string
  "Colors/Palette Library/Off White/950": string
}

const collection0: UISK_Collection0 = {
  _Primitives: {
    defaultModeName: "Adaptive",
    modeNames: ["Adaptive", "Aeron"],
    modes: {
      Adaptive: {
        "Colors/Base/white": "#ffffff",
        "Colors/Base/black": "#000000",
        "Colors/Base/transparent": "#ffffff00",
        "Colors/Light mode/25": "#fcfcfc",
        "Colors/Light mode/50": "#f7f7f7",
        "Colors/Light mode/100": "#f5f5f5",
        "Colors/Light mode/200": "#e5e5e5",
        "Colors/Light mode/300": "#d6d6d6",
        "Colors/Light mode/400": "#a3a3a3",
        "Colors/Light mode/500": "#737373",
        "Colors/Light mode/600": "#525252",
        "Colors/Light mode/700": "#424242",
        "Colors/Light mode/800": "#292929",
        "Colors/Light mode/900": "#141414",
        "Colors/Light mode/950": "#0f0f0f",
        "Colors/Dark mode/25": "#fcfcfc",
        "Colors/Dark mode/50": "#f7f7f7",
        "Colors/Dark mode/100": "#f5f5f5",
        "Colors/Dark mode/200": "#e5e5e5",
        "Colors/Dark mode/300": "#d6d6d6",
        "Colors/Dark mode/400": "#a3a3a3",
        "Colors/Dark mode/500": "#737373",
        "Colors/Dark mode/600": "#525252",
        "Colors/Dark mode/700": "#424242",
        "Colors/Dark mode/800": "#292929",
        "Colors/Dark mode/900": "#141414",
        "Colors/Dark mode/950": "#0f0f0f",
        "Colors/Brand Primary/25": "#f2f3fe",
        "Colors/Brand Primary/50": "#e6e6fe",
        "Colors/Brand Primary/100": "#d9dafd",
        "Colors/Brand Primary/200": "#c0c2fc",
        "Colors/Brand Primary/300": "#a7a9fa",
        "Colors/Brand Primary/400": "#8e90f9",
        "Colors/Brand Primary/500": "#8184f8",
        "Colors/Brand Primary/600": "#676ac6",
        "Colors/Brand Primary/700": "#4d4f95",
        "Colors/Brand Primary/800": "#41427c",
        "Colors/Brand Primary/900": "#27284a",
        "Colors/Brand Primary/950": "#0d0d19",
        "Colors/Brand Secondary/25": "#f2f3fe",
        "Colors/Brand Secondary/50": "#e6e6fe",
        "Colors/Brand Secondary/100": "#d9dafd",
        "Colors/Brand Secondary/200": "#c0c2fc",
        "Colors/Brand Secondary/300": "#a7a9fa",
        "Colors/Brand Secondary/400": "#8e90f9",
        "Colors/Brand Secondary/500": "#8184f8",
        "Colors/Brand Secondary/600": "#4d4f95",
        "Colors/Brand Secondary/700": "#41427c",
        "Colors/Brand Secondary/800": "#27284a",
        "Colors/Brand Secondary/900": "#0d0d19",
        "Colors/Brand Secondary/950": "#28040a",
        "Colors/Error/25": "#fcf3f4",
        "Colors/Error/50": "#f9e7ea",
        "Colors/Error/100": "#f3d0d6",
        "Colors/Error/200": "#e28897",
        "Colors/Error/300": "#d14159",
        "Colors/Error/400": "#c41230",
        "Colors/Error/500": "#a50e28",
        "Colors/Error/600": "#890c21",
        "Colors/Error/700": "#6d091a",
        "Colors/Error/800": "#500713",
        "Colors/Error/900": "#34040d",
        "Colors/Error/950": "#34040d",
        "Colors/Warning/25": "#fffcf5",
        "Colors/Warning/50": "#fffaeb",
        "Colors/Warning/100": "#fef0c7",
        "Colors/Warning/200": "#fedf89",
        "Colors/Warning/300": "#fec84b",
        "Colors/Warning/400": "#fdb022",
        "Colors/Warning/500": "#f79009",
        "Colors/Warning/600": "#dc6803",
        "Colors/Warning/700": "#b54708",
        "Colors/Warning/800": "#93370d",
        "Colors/Warning/900": "#7a2e0e",
        "Colors/Warning/950": "#4e1d09",
        "Colors/Success/25": "#f6fef9",
        "Colors/Success/50": "#ecfdf3",
        "Colors/Success/100": "#dcfae6",
        "Colors/Success/200": "#abefc6",
        "Colors/Success/300": "#75e0a7",
        "Colors/Success/400": "#47cd89",
        "Colors/Success/500": "#17b26a",
        "Colors/Success/600": "#079455",
        "Colors/Success/700": "#067647",
        "Colors/Success/800": "#085d3a",
        "Colors/Success/900": "#074d31",
        "Colors/Success/950": "#053321",
        "Colors/Data/Positive/25": "#d9ebd9",
        "Colors/Data/Positive/50": "#cce4cc",
        "Colors/Data/Positive/100": "#7fbb7f",
        "Colors/Data/Positive/200": "#339233",
        "Colors/Data/Positive/300": "#007700",
        "Colors/Data/Positive/400": "#005a00",
        "Colors/Data/Positive/500": "#004b00",
        "Colors/Data/Positive/600": "#003b00",
        "Colors/Data/Positive/700": "#002c00",
        "Colors/Data/Positive/800": "#001d00",
        "Colors/Data/Positive/900": "#000e00",
        "Colors/Data/Positive/950": "#000600",
        "Colors/Data/Negative/25": "#f5e0e0",
        "Colors/Data/Negative/50": "#f0d1d1",
        "Colors/Data/Negative/100": "#d98b8b",
        "Colors/Data/Negative/200": "#c34646",
        "Colors/Data/Negative/300": "#b41818",
        "Colors/Data/Negative/400": "#9c0000",
        "Colors/Data/Negative/500": "#880000",
        "Colors/Data/Negative/600": "#730000",
        "Colors/Data/Negative/700": "#5f0000",
        "Colors/Data/Negative/800": "#4a0000",
        "Colors/Data/Negative/900": "#360000",
        "Colors/Data/Negative/950": "#2c0000",
        "Colors/Data/Neutral/25": "#e7e8e9",
        "Colors/Data/Neutral/50": "#dcdedf",
        "Colors/Data/Neutral/100": "#a7abaf",
        "Colors/Data/Neutral/200": "#73797f",
        "Colors/Data/Neutral/300": "#50585f",
        "Colors/Data/Neutral/400": "#3e454c",
        "Colors/Data/Neutral/500": "#353b41",
        "Colors/Data/Neutral/600": "#2c3136",
        "Colors/Data/Neutral/700": "#23262a",
        "Colors/Data/Neutral/800": "#191c1f",
        "Colors/Data/Neutral/900": "#101214",
        "Colors/Data/Neutral/950": "#0c0d0e",
        "Colors/Palette Library/Gray blue/25": "#fcfcfd",
        "Colors/Palette Library/Gray blue/50": "#f8f9fc",
        "Colors/Palette Library/Gray blue/100": "#eaecf5",
        "Colors/Palette Library/Gray blue/200": "#d5d9eb",
        "Colors/Palette Library/Gray blue/300": "#b3b8db",
        "Colors/Palette Library/Gray blue/400": "#717bbc",
        "Colors/Palette Library/Gray blue/500": "#4e5ba6",
        "Colors/Palette Library/Gray blue/600": "#3e4784",
        "Colors/Palette Library/Gray blue/700": "#363f72",
        "Colors/Palette Library/Gray blue/800": "#293056",
        "Colors/Palette Library/Gray blue/900": "#101323",
        "Colors/Palette Library/Gray blue/950": "#0d0f1c",
        "Colors/Palette Library/Gray cool/25": "#fcfcfd",
        "Colors/Palette Library/Gray cool/50": "#f9f9fb",
        "Colors/Palette Library/Gray cool/100": "#eff1f5",
        "Colors/Palette Library/Gray cool/200": "#dcdfea",
        "Colors/Palette Library/Gray cool/300": "#b9c0d4",
        "Colors/Palette Library/Gray cool/400": "#7d89b0",
        "Colors/Palette Library/Gray cool/500": "#5d6b98",
        "Colors/Palette Library/Gray cool/600": "#4a5578",
        "Colors/Palette Library/Gray cool/700": "#404968",
        "Colors/Palette Library/Gray cool/800": "#30374f",
        "Colors/Palette Library/Gray cool/900": "#111322",
        "Colors/Palette Library/Gray cool/950": "#0e101b",
        "Colors/Palette Library/Gray modern/25": "#fcfcfd",
        "Colors/Palette Library/Gray modern/50": "#f8fafc",
        "Colors/Palette Library/Gray modern/100": "#eef2f6",
        "Colors/Palette Library/Gray modern/200": "#e3e8ef",
        "Colors/Palette Library/Gray modern/300": "#cdd5df",
        "Colors/Palette Library/Gray modern/400": "#9aa4b2",
        "Colors/Palette Library/Gray modern/500": "#697586",
        "Colors/Palette Library/Gray modern/600": "#4b5565",
        "Colors/Palette Library/Gray modern/700": "#364152",
        "Colors/Palette Library/Gray modern/800": "#202939",
        "Colors/Palette Library/Gray modern/900": "#121926",
        "Colors/Palette Library/Gray modern/950": "#0d121c",
        "Colors/Palette Library/Gray neutral/25": "#fcfcfd",
        "Colors/Palette Library/Gray neutral/50": "#f9fafb",
        "Colors/Palette Library/Gray neutral/100": "#f3f4f6",
        "Colors/Palette Library/Gray neutral/200": "#e5e7eb",
        "Colors/Palette Library/Gray neutral/300": "#d2d6db",
        "Colors/Palette Library/Gray neutral/400": "#9da4ae",
        "Colors/Palette Library/Gray neutral/500": "#6c737f",
        "Colors/Palette Library/Gray neutral/600": "#4d5761",
        "Colors/Palette Library/Gray neutral/700": "#384250",
        "Colors/Palette Library/Gray neutral/800": "#1f2a37",
        "Colors/Palette Library/Gray neutral/900": "#111927",
        "Colors/Palette Library/Gray neutral/950": "#0d121c",
        "Colors/Palette Library/Green/25": "#f6fef9",
        "Colors/Palette Library/Green/50": "#edfcf2",
        "Colors/Palette Library/Green/100": "#d3f8df",
        "Colors/Palette Library/Green/200": "#aaf0c4",
        "Colors/Palette Library/Green/300": "#73e2a3",
        "Colors/Palette Library/Green/400": "#3ccb7f",
        "Colors/Palette Library/Green/500": "#16b364",
        "Colors/Palette Library/Green/600": "#099250",
        "Colors/Palette Library/Green/700": "#087443",
        "Colors/Palette Library/Green/800": "#095c37",
        "Colors/Palette Library/Green/900": "#084c2e",
        "Colors/Palette Library/Green/950": "#052e1c",
        "Colors/Palette Library/Gray iron/25": "#fcfcfc",
        "Colors/Palette Library/Gray iron/50": "#fafafa",
        "Colors/Palette Library/Gray iron/100": "#f4f4f5",
        "Colors/Palette Library/Gray iron/200": "#e4e4e7",
        "Colors/Palette Library/Gray iron/300": "#d1d1d6",
        "Colors/Palette Library/Gray iron/400": "#a0a0ab",
        "Colors/Palette Library/Gray iron/500": "#70707b",
        "Colors/Palette Library/Gray iron/600": "#51525c",
        "Colors/Palette Library/Gray iron/700": "#3f3f46",
        "Colors/Palette Library/Gray iron/800": "#26272b",
        "Colors/Palette Library/Gray iron/900": "#1a1a1e",
        "Colors/Palette Library/Gray iron/950": "#131316",
        "Colors/Palette Library/Gray true/25": "#fcfcfc",
        "Colors/Palette Library/Gray true/50": "#f7f7f7",
        "Colors/Palette Library/Gray true/100": "#f5f5f5",
        "Colors/Palette Library/Gray true/200": "#e5e5e5",
        "Colors/Palette Library/Gray true/300": "#d6d6d6",
        "Colors/Palette Library/Gray true/400": "#a3a3a3",
        "Colors/Palette Library/Gray true/500": "#737373",
        "Colors/Palette Library/Gray true/600": "#525252",
        "Colors/Palette Library/Gray true/700": "#424242",
        "Colors/Palette Library/Gray true/800": "#292929",
        "Colors/Palette Library/Gray true/900": "#141414",
        "Colors/Palette Library/Gray true/950": "#0f0f0f",
        "Colors/Palette Library/Gray warm/25": "#fdfdfc",
        "Colors/Palette Library/Gray warm/50": "#fafaf9",
        "Colors/Palette Library/Gray warm/100": "#f5f5f4",
        "Colors/Palette Library/Gray warm/200": "#e7e5e4",
        "Colors/Palette Library/Gray warm/300": "#d7d3d0",
        "Colors/Palette Library/Gray warm/400": "#a9a29d",
        "Colors/Palette Library/Gray warm/500": "#79716b",
        "Colors/Palette Library/Gray warm/600": "#57534e",
        "Colors/Palette Library/Gray warm/700": "#44403c",
        "Colors/Palette Library/Gray warm/800": "#292524",
        "Colors/Palette Library/Gray warm/900": "#1c1917",
        "Colors/Palette Library/Gray warm/950": "#171412",
        "Colors/Palette Library/Moss/25": "#fafdf7",
        "Colors/Palette Library/Moss/50": "#f5fbee",
        "Colors/Palette Library/Moss/100": "#e6f4d7",
        "Colors/Palette Library/Moss/200": "#ceeab0",
        "Colors/Palette Library/Moss/300": "#acdc79",
        "Colors/Palette Library/Moss/400": "#86cb3c",
        "Colors/Palette Library/Moss/500": "#669f2a",
        "Colors/Palette Library/Moss/600": "#4f7a21",
        "Colors/Palette Library/Moss/700": "#3f621a",
        "Colors/Palette Library/Moss/800": "#335015",
        "Colors/Palette Library/Moss/900": "#2b4212",
        "Colors/Palette Library/Moss/950": "#1a280b",
        "Colors/Palette Library/Green light/25": "#fafef5",
        "Colors/Palette Library/Green light/50": "#f3fee7",
        "Colors/Palette Library/Green light/100": "#e3fbcc",
        "Colors/Palette Library/Green light/200": "#d0f8ab",
        "Colors/Palette Library/Green light/300": "#a6ef67",
        "Colors/Palette Library/Green light/400": "#85e13a",
        "Colors/Palette Library/Green light/500": "#66c61c",
        "Colors/Palette Library/Green light/600": "#4ca30d",
        "Colors/Palette Library/Green light/700": "#3b7c0f",
        "Colors/Palette Library/Green light/800": "#326212",
        "Colors/Palette Library/Green light/900": "#2b5314",
        "Colors/Palette Library/Green light/950": "#15290a",
        "Colors/Palette Library/Teal/25": "#f6fefc",
        "Colors/Palette Library/Teal/50": "#f0fdf9",
        "Colors/Palette Library/Teal/100": "#ccfbef",
        "Colors/Palette Library/Teal/200": "#99f6e0",
        "Colors/Palette Library/Teal/300": "#5fe9d0",
        "Colors/Palette Library/Teal/400": "#2ed3b7",
        "Colors/Palette Library/Teal/500": "#15b79e",
        "Colors/Palette Library/Teal/600": "#0e9384",
        "Colors/Palette Library/Teal/700": "#107569",
        "Colors/Palette Library/Teal/800": "#125d56",
        "Colors/Palette Library/Teal/900": "#134e48",
        "Colors/Palette Library/Teal/950": "#0a2926",
        "Colors/Palette Library/Cyan/25": "#f5feff",
        "Colors/Palette Library/Cyan/50": "#ecfdff",
        "Colors/Palette Library/Cyan/100": "#cff9fe",
        "Colors/Palette Library/Cyan/200": "#a5f0fc",
        "Colors/Palette Library/Cyan/300": "#67e3f9",
        "Colors/Palette Library/Cyan/400": "#22ccee",
        "Colors/Palette Library/Cyan/500": "#06aed4",
        "Colors/Palette Library/Cyan/600": "#088ab2",
        "Colors/Palette Library/Cyan/700": "#0e7090",
        "Colors/Palette Library/Cyan/800": "#155b75",
        "Colors/Palette Library/Cyan/900": "#164c63",
        "Colors/Palette Library/Cyan/950": "#0d2d3a",
        "Colors/Palette Library/Blue light/25": "#f5fbff",
        "Colors/Palette Library/Blue light/50": "#f0f9ff",
        "Colors/Palette Library/Blue light/100": "#e0f2fe",
        "Colors/Palette Library/Blue light/200": "#b9e6fe",
        "Colors/Palette Library/Blue light/300": "#7cd4fd",
        "Colors/Palette Library/Blue light/400": "#36bffa",
        "Colors/Palette Library/Blue light/500": "#0ba5ec",
        "Colors/Palette Library/Blue light/600": "#0086c9",
        "Colors/Palette Library/Blue light/700": "#026aa2",
        "Colors/Palette Library/Blue light/800": "#065986",
        "Colors/Palette Library/Blue light/900": "#0b4a6f",
        "Colors/Palette Library/Blue light/950": "#062c41",
        "Colors/Palette Library/Blue/25": "#f5faff",
        "Colors/Palette Library/Blue/50": "#eff8ff",
        "Colors/Palette Library/Blue/100": "#d1e9ff",
        "Colors/Palette Library/Blue/200": "#b2ddff",
        "Colors/Palette Library/Blue/300": "#84caff",
        "Colors/Palette Library/Blue/400": "#53b1fd",
        "Colors/Palette Library/Blue/500": "#2e90fa",
        "Colors/Palette Library/Blue/600": "#1570ef",
        "Colors/Palette Library/Blue/700": "#175cd3",
        "Colors/Palette Library/Blue/800": "#1849a9",
        "Colors/Palette Library/Blue/900": "#194185",
        "Colors/Palette Library/Blue/950": "#102a56",
        "Colors/Palette Library/Blue dark/25": "#f5f8ff",
        "Colors/Palette Library/Blue dark/50": "#eff4ff",
        "Colors/Palette Library/Blue dark/100": "#d1e0ff",
        "Colors/Palette Library/Blue dark/200": "#b2ccff",
        "Colors/Palette Library/Blue dark/300": "#84adff",
        "Colors/Palette Library/Blue dark/400": "#528bff",
        "Colors/Palette Library/Blue dark/500": "#2970ff",
        "Colors/Palette Library/Blue dark/600": "#155eef",
        "Colors/Palette Library/Blue dark/700": "#004eeb",
        "Colors/Palette Library/Blue dark/800": "#0040c1",
        "Colors/Palette Library/Blue dark/900": "#00359e",
        "Colors/Palette Library/Blue dark/950": "#002266",
        "Colors/Palette Library/Indigo/25": "#f5f8ff",
        "Colors/Palette Library/Indigo/50": "#eef4ff",
        "Colors/Palette Library/Indigo/100": "#e0eaff",
        "Colors/Palette Library/Indigo/200": "#c7d7fe",
        "Colors/Palette Library/Indigo/300": "#a4bcfd",
        "Colors/Palette Library/Indigo/400": "#8098f9",
        "Colors/Palette Library/Indigo/500": "#6172f3",
        "Colors/Palette Library/Indigo/600": "#444ce7",
        "Colors/Palette Library/Indigo/700": "#3538cd",
        "Colors/Palette Library/Indigo/800": "#2d31a6",
        "Colors/Palette Library/Indigo/900": "#2d3282",
        "Colors/Palette Library/Indigo/950": "#1f235b",
        "Colors/Palette Library/Violet/25": "#fbfaff",
        "Colors/Palette Library/Violet/50": "#f5f3ff",
        "Colors/Palette Library/Violet/100": "#ece9fe",
        "Colors/Palette Library/Violet/200": "#ddd6fe",
        "Colors/Palette Library/Violet/300": "#c3b5fd",
        "Colors/Palette Library/Violet/400": "#a48afb",
        "Colors/Palette Library/Violet/500": "#875bf7",
        "Colors/Palette Library/Violet/600": "#7839ee",
        "Colors/Palette Library/Violet/700": "#6927da",
        "Colors/Palette Library/Violet/800": "#5720b7",
        "Colors/Palette Library/Violet/900": "#491c96",
        "Colors/Palette Library/Violet/950": "#2e125e",
        "Colors/Palette Library/Purple/25": "#fafaff",
        "Colors/Palette Library/Purple/50": "#f4f3ff",
        "Colors/Palette Library/Purple/100": "#ebe9fe",
        "Colors/Palette Library/Purple/200": "#d9d6fe",
        "Colors/Palette Library/Purple/300": "#bdb4fe",
        "Colors/Palette Library/Purple/400": "#9b8afb",
        "Colors/Palette Library/Purple/500": "#7a5af8",
        "Colors/Palette Library/Purple/600": "#6938ef",
        "Colors/Palette Library/Purple/700": "#5925dc",
        "Colors/Palette Library/Purple/800": "#4a1fb8",
        "Colors/Palette Library/Purple/900": "#3e1c96",
        "Colors/Palette Library/Purple/950": "#27115f",
        "Colors/Palette Library/Fuchsia/25": "#fefaff",
        "Colors/Palette Library/Fuchsia/50": "#fdf4ff",
        "Colors/Palette Library/Fuchsia/100": "#fbe8ff",
        "Colors/Palette Library/Fuchsia/200": "#f6d0fe",
        "Colors/Palette Library/Fuchsia/300": "#eeaafd",
        "Colors/Palette Library/Fuchsia/400": "#e478fa",
        "Colors/Palette Library/Fuchsia/500": "#d444f1",
        "Colors/Palette Library/Fuchsia/600": "#ba24d5",
        "Colors/Palette Library/Fuchsia/700": "#9f1ab1",
        "Colors/Palette Library/Fuchsia/800": "#821890",
        "Colors/Palette Library/Fuchsia/900": "#6f1877",
        "Colors/Palette Library/Fuchsia/950": "#47104c",
        "Colors/Palette Library/Pink/25": "#fef6fb",
        "Colors/Palette Library/Pink/50": "#fdf2fa",
        "Colors/Palette Library/Pink/100": "#fce7f6",
        "Colors/Palette Library/Pink/200": "#fcceee",
        "Colors/Palette Library/Pink/300": "#faa7e0",
        "Colors/Palette Library/Pink/400": "#f670c7",
        "Colors/Palette Library/Pink/500": "#ee46bc",
        "Colors/Palette Library/Pink/600": "#dd2590",
        "Colors/Palette Library/Pink/700": "#c11574",
        "Colors/Palette Library/Pink/800": "#9e165f",
        "Colors/Palette Library/Pink/900": "#851651",
        "Colors/Palette Library/Pink/950": "#4e0d30",
        "Colors/Palette Library/Rosé/25": "#fff5f6",
        "Colors/Palette Library/Rosé/50": "#fff1f3",
        "Colors/Palette Library/Rosé/100": "#ffe4e8",
        "Colors/Palette Library/Rosé/200": "#fecdd6",
        "Colors/Palette Library/Rosé/300": "#fea3b4",
        "Colors/Palette Library/Rosé/400": "#fd6f8e",
        "Colors/Palette Library/Rosé/500": "#f63d68",
        "Colors/Palette Library/Rosé/600": "#e31b54",
        "Colors/Palette Library/Rosé/700": "#c01048",
        "Colors/Palette Library/Rosé/800": "#a11043",
        "Colors/Palette Library/Rosé/900": "#89123e",
        "Colors/Palette Library/Rosé/950": "#510b24",
        "Colors/Palette Library/Orange dark/25": "#fff9f5",
        "Colors/Palette Library/Orange dark/50": "#fff4ed",
        "Colors/Palette Library/Orange dark/100": "#ffe6d5",
        "Colors/Palette Library/Orange dark/200": "#ffd6ae",
        "Colors/Palette Library/Orange dark/300": "#ff9c66",
        "Colors/Palette Library/Orange dark/400": "#ff692e",
        "Colors/Palette Library/Orange dark/500": "#ff4405",
        "Colors/Palette Library/Orange dark/600": "#e62e05",
        "Colors/Palette Library/Orange dark/700": "#bc1b06",
        "Colors/Palette Library/Orange dark/800": "#97180c",
        "Colors/Palette Library/Orange dark/900": "#771a0d",
        "Colors/Palette Library/Orange dark/950": "#57130a",
        "Colors/Palette Library/Orange/25": "#fefaf5",
        "Colors/Palette Library/Orange/50": "#fef6ee",
        "Colors/Palette Library/Orange/100": "#fdead7",
        "Colors/Palette Library/Orange/200": "#f9dbaf",
        "Colors/Palette Library/Orange/300": "#f7b27a",
        "Colors/Palette Library/Orange/400": "#f38744",
        "Colors/Palette Library/Orange/500": "#ef6820",
        "Colors/Palette Library/Orange/600": "#e04f16",
        "Colors/Palette Library/Orange/700": "#b93815",
        "Colors/Palette Library/Orange/800": "#932f19",
        "Colors/Palette Library/Orange/900": "#772917",
        "Colors/Palette Library/Orange/950": "#511c10",
        "Colors/Palette Library/Yellow/25": "#fefdf0",
        "Colors/Palette Library/Yellow/50": "#fefbe8",
        "Colors/Palette Library/Yellow/100": "#fef7c3",
        "Colors/Palette Library/Yellow/200": "#feee95",
        "Colors/Palette Library/Yellow/300": "#fde272",
        "Colors/Palette Library/Yellow/400": "#fac515",
        "Colors/Palette Library/Yellow/500": "#eaaa08",
        "Colors/Palette Library/Yellow/600": "#ca8504",
        "Colors/Palette Library/Yellow/700": "#a15c07",
        "Colors/Palette Library/Yellow/800": "#854a0e",
        "Colors/Palette Library/Yellow/900": "#713b12",
        "Colors/Palette Library/Yellow/950": "#542c0d",
        "Spacing/0": 0,
        "Spacing/1": 4,
        "Spacing/2": 8,
        "Spacing/3": 12,
        "Spacing/4": 16,
        "Spacing/5": 20,
        "Spacing/6": 24,
        "Spacing/8": 32,
        "Spacing/10": 40,
        "Spacing/12": 48,
        "Spacing/16": 64,
        "Spacing/20": 80,
        "Spacing/24": 96,
        "Spacing/32": 128,
        "Spacing/40": 160,
        "Spacing/48": 192,
        "Spacing/56": 224,
        "Spacing/64": 256,
        "Spacing/80": 320,
        "Spacing/96": 384,
        "Spacing/120": 480,
        "Spacing/140": 560,
        "Spacing/160": 640,
        "Spacing/180": 720,
        "Spacing/192": 768,
        "Spacing/256": 1024,
        "Spacing/320": 1280,
        "Spacing/360": 1440,
        "Spacing/400": 1600,
        "Spacing/480": 1920,
        "Spacing/0-5": 2,
        "Spacing/1-5": 6,
        "Colors/Palette Library/Gray true/850": "#1f1f1f",
        "Colors/Dark mode/850": "#1f1f1f",
        "Colors/Palette Library/Pewter/500": "#969b99",
        "Colors/Palette Library/Pewter/50": "#f5f5f5",
        "Colors/Palette Library/Pewter/100": "#eaebeb",
        "Colors/Palette Library/Pewter/300": "#c0c3c2",
        "Colors/Palette Library/Pewter/200": "#d5d7d6",
        "Colors/Palette Library/Pewter/400": "#abafae",
        "Colors/Palette Library/Pewter/600": "#777d7b",
        "Colors/Palette Library/Pewter/700": "#5a5e5c",
        "Colors/Palette Library/Pewter/800": "#3c3f3d",
        "Colors/Palette Library/Pewter/900": "#1e1f1f",
        "Colors/Palette Library/Pewter/950": "#0f100f",
        "Colors/Palette Library/Carbon/500": "#222222",
        "Colors/Palette Library/Carbon/50": "#e8e8e8",
        "Colors/Palette Library/Carbon/100": "#d4d4d4",
        "Colors/Palette Library/Carbon/200": "#a6a6a6",
        "Colors/Palette Library/Carbon/300": "#7a7a7a",
        "Colors/Palette Library/Carbon/400": "#4f4f4f",
        "Colors/Palette Library/Carbon/600": "#1c1c1c",
        "Colors/Palette Library/Carbon/700": "#141414",
        "Colors/Palette Library/Carbon/800": "#0d0d0d",
        "Colors/Palette Library/Carbon/900": "#080808",
        "Colors/Palette Library/Carbon/950": "#030303",
        "Colors/Palette Library/Granite/500": "#333333",
        "Colors/Palette Library/Granite/50": "#ebebeb",
        "Colors/Palette Library/Granite/100": "#d6d6d6",
        "Colors/Palette Library/Granite/200": "#adadad",
        "Colors/Palette Library/Granite/300": "#858585",
        "Colors/Palette Library/Granite/400": "#5c5c5c",
        "Colors/Palette Library/Granite/600": "#292929",
        "Colors/Palette Library/Granite/700": "#1f1f1f",
        "Colors/Palette Library/Granite/800": "#141414",
        "Colors/Palette Library/Granite/900": "#0a0a0a",
        "Colors/Palette Library/Granite/950": "#050505",
        "Colors/Palette Library/Titanium/500": "#505050",
        "Colors/Palette Library/Titanium/50": "#ededed",
        "Colors/Palette Library/Titanium/100": "#dbdbdb",
        "Colors/Palette Library/Titanium/200": "#bababa",
        "Colors/Palette Library/Titanium/300": "#969696",
        "Colors/Palette Library/Titanium/400": "#737373",
        "Colors/Palette Library/Titanium/600": "#404040",
        "Colors/Palette Library/Titanium/700": "#303030",
        "Colors/Palette Library/Titanium/800": "#212121",
        "Colors/Palette Library/Titanium/900": "#0f0f0f",
        "Colors/Palette Library/Titanium/950": "#080808",
        "Colors/Palette Library/Steel/500": "#e1e1e1",
        "Colors/Palette Library/Steel/50": "#fcfcfc",
        "Colors/Palette Library/Steel/100": "#fafafa",
        "Colors/Palette Library/Steel/200": "#f2f2f2",
        "Colors/Palette Library/Steel/300": "#ededed",
        "Colors/Palette Library/Steel/400": "#e8e8e8",
        "Colors/Palette Library/Steel/600": "#b5b5b5",
        "Colors/Palette Library/Steel/700": "#878787",
        "Colors/Palette Library/Steel/800": "#595959",
        "Colors/Palette Library/Steel/900": "#2e2e2e",
        "Colors/Palette Library/Steel/950": "#171717",
        "Colors/Palette Library/Off White/500": "#f4f4f4",
        "Colors/Palette Library/Off White/50": "#ffffff",
        "Colors/Palette Library/Off White/100": "#fcfcfc",
        "Colors/Palette Library/Off White/200": "#fafafa",
        "Colors/Palette Library/Off White/300": "#f7f7f7",
        "Colors/Palette Library/Off White/400": "#f7f7f7",
        "Colors/Palette Library/Off White/600": "#c4c4c4",
        "Colors/Palette Library/Off White/700": "#919191",
        "Colors/Palette Library/Off White/800": "#616161",
        "Colors/Palette Library/Off White/900": "#303030",
        "Colors/Palette Library/Off White/950": "#1a1a1a",
      },
      Aeron: {
        "Colors/Base/white": "#ffffff",
        "Colors/Base/black": "#000000",
        "Colors/Base/transparent": "#ffffff00",
        "Colors/Light mode/25": "#fcfcfc",
        "Colors/Light mode/50": "#f7f7f7",
        "Colors/Light mode/100": "#f5f5f5",
        "Colors/Light mode/200": "#e5e5e5",
        "Colors/Light mode/300": "#d6d6d6",
        "Colors/Light mode/400": "#a3a3a3",
        "Colors/Light mode/500": "#737373",
        "Colors/Light mode/600": "#525252",
        "Colors/Light mode/700": "#424242",
        "Colors/Light mode/800": "#292929",
        "Colors/Light mode/900": "#141414",
        "Colors/Light mode/950": "#0f0f0f",
        "Colors/Dark mode/25": "#fcfcfc",
        "Colors/Dark mode/50": "#f7f7f7",
        "Colors/Dark mode/100": "#f5f5f5",
        "Colors/Dark mode/200": "#e5e5e5",
        "Colors/Dark mode/300": "#d6d6d6",
        "Colors/Dark mode/400": "#a3a3a3",
        "Colors/Dark mode/500": "#737373",
        "Colors/Dark mode/600": "#525252",
        "Colors/Dark mode/700": "#424242",
        "Colors/Dark mode/800": "#292929",
        "Colors/Dark mode/900": "#141414",
        "Colors/Dark mode/950": "#0f0f0f",
        "Colors/Brand Primary/25": "#f2fdf8",
        "Colors/Brand Primary/50": "#e9fbf3",
        "Colors/Brand Primary/100": "#d3f8e7",
        "Colors/Brand Primary/200": "#a3f0cd",
        "Colors/Brand Primary/300": "#77e9b6",
        "Colors/Brand Primary/400": "#47e19c",
        "Colors/Brand Primary/500": "#22d081",
        "Colors/Brand Primary/600": "#1ba768",
        "Colors/Brand Primary/700": "#157f4f",
        "Colors/Brand Primary/800": "#0e5334",
        "Colors/Brand Primary/900": "#072c1b",
        "Colors/Brand Primary/950": "#04160e",
        "Colors/Brand Secondary/25": "#f2f3fe",
        "Colors/Brand Secondary/50": "#e6e6fe",
        "Colors/Brand Secondary/100": "#d9dafd",
        "Colors/Brand Secondary/200": "#c0c2fc",
        "Colors/Brand Secondary/300": "#a7a9fa",
        "Colors/Brand Secondary/400": "#8e90f9",
        "Colors/Brand Secondary/500": "#8184f8",
        "Colors/Brand Secondary/600": "#4d4f95",
        "Colors/Brand Secondary/700": "#41427c",
        "Colors/Brand Secondary/800": "#27284a",
        "Colors/Brand Secondary/900": "#0d0d19",
        "Colors/Brand Secondary/950": "#28040a",
        "Colors/Error/25": "#fcf3f4",
        "Colors/Error/50": "#f9e7ea",
        "Colors/Error/100": "#f3d0d6",
        "Colors/Error/200": "#e28897",
        "Colors/Error/300": "#d14159",
        "Colors/Error/400": "#c41230",
        "Colors/Error/500": "#a50e28",
        "Colors/Error/600": "#890c21",
        "Colors/Error/700": "#6d091a",
        "Colors/Error/800": "#500713",
        "Colors/Error/900": "#34040d",
        "Colors/Error/950": "#34040d",
        "Colors/Warning/25": "#fffcf5",
        "Colors/Warning/50": "#fffaeb",
        "Colors/Warning/100": "#fef0c7",
        "Colors/Warning/200": "#fedf89",
        "Colors/Warning/300": "#fec84b",
        "Colors/Warning/400": "#fdb022",
        "Colors/Warning/500": "#f79009",
        "Colors/Warning/600": "#dc6803",
        "Colors/Warning/700": "#b54708",
        "Colors/Warning/800": "#93370d",
        "Colors/Warning/900": "#7a2e0e",
        "Colors/Warning/950": "#4e1d09",
        "Colors/Success/25": "#f6fef9",
        "Colors/Success/50": "#ecfdf3",
        "Colors/Success/100": "#dcfae6",
        "Colors/Success/200": "#abefc6",
        "Colors/Success/300": "#75e0a7",
        "Colors/Success/400": "#47cd89",
        "Colors/Success/500": "#17b26a",
        "Colors/Success/600": "#079455",
        "Colors/Success/700": "#067647",
        "Colors/Success/800": "#085d3a",
        "Colors/Success/900": "#074d31",
        "Colors/Success/950": "#053321",
        "Colors/Data/Positive/25": "#d9ebd9",
        "Colors/Data/Positive/50": "#cce4cc",
        "Colors/Data/Positive/100": "#7fbb7f",
        "Colors/Data/Positive/200": "#339233",
        "Colors/Data/Positive/300": "#007700",
        "Colors/Data/Positive/400": "#005a00",
        "Colors/Data/Positive/500": "#004b00",
        "Colors/Data/Positive/600": "#003b00",
        "Colors/Data/Positive/700": "#002c00",
        "Colors/Data/Positive/800": "#001d00",
        "Colors/Data/Positive/900": "#000e00",
        "Colors/Data/Positive/950": "#000600",
        "Colors/Data/Negative/25": "#f5e0e0",
        "Colors/Data/Negative/50": "#f0d1d1",
        "Colors/Data/Negative/100": "#d98b8b",
        "Colors/Data/Negative/200": "#c34646",
        "Colors/Data/Negative/300": "#b41818",
        "Colors/Data/Negative/400": "#9c0000",
        "Colors/Data/Negative/500": "#880000",
        "Colors/Data/Negative/600": "#730000",
        "Colors/Data/Negative/700": "#5f0000",
        "Colors/Data/Negative/800": "#4a0000",
        "Colors/Data/Negative/900": "#360000",
        "Colors/Data/Negative/950": "#2c0000",
        "Colors/Data/Neutral/25": "#e7e8e9",
        "Colors/Data/Neutral/50": "#dcdedf",
        "Colors/Data/Neutral/100": "#a7abaf",
        "Colors/Data/Neutral/200": "#73797f",
        "Colors/Data/Neutral/300": "#50585f",
        "Colors/Data/Neutral/400": "#3e454c",
        "Colors/Data/Neutral/500": "#353b41",
        "Colors/Data/Neutral/600": "#2c3136",
        "Colors/Data/Neutral/700": "#23262a",
        "Colors/Data/Neutral/800": "#191c1f",
        "Colors/Data/Neutral/900": "#101214",
        "Colors/Data/Neutral/950": "#0c0d0e",
        "Colors/Palette Library/Gray blue/25": "#fcfcfd",
        "Colors/Palette Library/Gray blue/50": "#f8f9fc",
        "Colors/Palette Library/Gray blue/100": "#eaecf5",
        "Colors/Palette Library/Gray blue/200": "#d5d9eb",
        "Colors/Palette Library/Gray blue/300": "#b3b8db",
        "Colors/Palette Library/Gray blue/400": "#717bbc",
        "Colors/Palette Library/Gray blue/500": "#4e5ba6",
        "Colors/Palette Library/Gray blue/600": "#3e4784",
        "Colors/Palette Library/Gray blue/700": "#363f72",
        "Colors/Palette Library/Gray blue/800": "#293056",
        "Colors/Palette Library/Gray blue/900": "#101323",
        "Colors/Palette Library/Gray blue/950": "#0d0f1c",
        "Colors/Palette Library/Gray cool/25": "#fcfcfd",
        "Colors/Palette Library/Gray cool/50": "#f9f9fb",
        "Colors/Palette Library/Gray cool/100": "#eff1f5",
        "Colors/Palette Library/Gray cool/200": "#dcdfea",
        "Colors/Palette Library/Gray cool/300": "#b9c0d4",
        "Colors/Palette Library/Gray cool/400": "#7d89b0",
        "Colors/Palette Library/Gray cool/500": "#5d6b98",
        "Colors/Palette Library/Gray cool/600": "#4a5578",
        "Colors/Palette Library/Gray cool/700": "#404968",
        "Colors/Palette Library/Gray cool/800": "#30374f",
        "Colors/Palette Library/Gray cool/900": "#111322",
        "Colors/Palette Library/Gray cool/950": "#0e101b",
        "Colors/Palette Library/Gray modern/25": "#fcfcfd",
        "Colors/Palette Library/Gray modern/50": "#f8fafc",
        "Colors/Palette Library/Gray modern/100": "#eef2f6",
        "Colors/Palette Library/Gray modern/200": "#e3e8ef",
        "Colors/Palette Library/Gray modern/300": "#cdd5df",
        "Colors/Palette Library/Gray modern/400": "#9aa4b2",
        "Colors/Palette Library/Gray modern/500": "#697586",
        "Colors/Palette Library/Gray modern/600": "#4b5565",
        "Colors/Palette Library/Gray modern/700": "#364152",
        "Colors/Palette Library/Gray modern/800": "#202939",
        "Colors/Palette Library/Gray modern/900": "#121926",
        "Colors/Palette Library/Gray modern/950": "#0d121c",
        "Colors/Palette Library/Gray neutral/25": "#fcfcfd",
        "Colors/Palette Library/Gray neutral/50": "#f9fafb",
        "Colors/Palette Library/Gray neutral/100": "#f3f4f6",
        "Colors/Palette Library/Gray neutral/200": "#e5e7eb",
        "Colors/Palette Library/Gray neutral/300": "#d2d6db",
        "Colors/Palette Library/Gray neutral/400": "#9da4ae",
        "Colors/Palette Library/Gray neutral/500": "#6c737f",
        "Colors/Palette Library/Gray neutral/600": "#4d5761",
        "Colors/Palette Library/Gray neutral/700": "#384250",
        "Colors/Palette Library/Gray neutral/800": "#1f2a37",
        "Colors/Palette Library/Gray neutral/900": "#111927",
        "Colors/Palette Library/Gray neutral/950": "#0d121c",
        "Colors/Palette Library/Green/25": "#f6fef9",
        "Colors/Palette Library/Green/50": "#edfcf2",
        "Colors/Palette Library/Green/100": "#d3f8df",
        "Colors/Palette Library/Green/200": "#aaf0c4",
        "Colors/Palette Library/Green/300": "#73e2a3",
        "Colors/Palette Library/Green/400": "#3ccb7f",
        "Colors/Palette Library/Green/500": "#16b364",
        "Colors/Palette Library/Green/600": "#099250",
        "Colors/Palette Library/Green/700": "#087443",
        "Colors/Palette Library/Green/800": "#095c37",
        "Colors/Palette Library/Green/900": "#084c2e",
        "Colors/Palette Library/Green/950": "#052e1c",
        "Colors/Palette Library/Gray iron/25": "#fcfcfc",
        "Colors/Palette Library/Gray iron/50": "#fafafa",
        "Colors/Palette Library/Gray iron/100": "#f4f4f5",
        "Colors/Palette Library/Gray iron/200": "#e4e4e7",
        "Colors/Palette Library/Gray iron/300": "#d1d1d6",
        "Colors/Palette Library/Gray iron/400": "#a0a0ab",
        "Colors/Palette Library/Gray iron/500": "#70707b",
        "Colors/Palette Library/Gray iron/600": "#51525c",
        "Colors/Palette Library/Gray iron/700": "#3f3f46",
        "Colors/Palette Library/Gray iron/800": "#26272b",
        "Colors/Palette Library/Gray iron/900": "#1a1a1e",
        "Colors/Palette Library/Gray iron/950": "#131316",
        "Colors/Palette Library/Gray true/25": "#fcfcfc",
        "Colors/Palette Library/Gray true/50": "#f7f7f7",
        "Colors/Palette Library/Gray true/100": "#f5f5f5",
        "Colors/Palette Library/Gray true/200": "#e5e5e5",
        "Colors/Palette Library/Gray true/300": "#d6d6d6",
        "Colors/Palette Library/Gray true/400": "#a3a3a3",
        "Colors/Palette Library/Gray true/500": "#737373",
        "Colors/Palette Library/Gray true/600": "#525252",
        "Colors/Palette Library/Gray true/700": "#424242",
        "Colors/Palette Library/Gray true/800": "#292929",
        "Colors/Palette Library/Gray true/900": "#141414",
        "Colors/Palette Library/Gray true/950": "#0f0f0f",
        "Colors/Palette Library/Gray warm/25": "#fdfdfc",
        "Colors/Palette Library/Gray warm/50": "#fafaf9",
        "Colors/Palette Library/Gray warm/100": "#f5f5f4",
        "Colors/Palette Library/Gray warm/200": "#e7e5e4",
        "Colors/Palette Library/Gray warm/300": "#d7d3d0",
        "Colors/Palette Library/Gray warm/400": "#a9a29d",
        "Colors/Palette Library/Gray warm/500": "#79716b",
        "Colors/Palette Library/Gray warm/600": "#57534e",
        "Colors/Palette Library/Gray warm/700": "#44403c",
        "Colors/Palette Library/Gray warm/800": "#292524",
        "Colors/Palette Library/Gray warm/900": "#1c1917",
        "Colors/Palette Library/Gray warm/950": "#171412",
        "Colors/Palette Library/Moss/25": "#fafdf7",
        "Colors/Palette Library/Moss/50": "#f5fbee",
        "Colors/Palette Library/Moss/100": "#e6f4d7",
        "Colors/Palette Library/Moss/200": "#ceeab0",
        "Colors/Palette Library/Moss/300": "#acdc79",
        "Colors/Palette Library/Moss/400": "#86cb3c",
        "Colors/Palette Library/Moss/500": "#669f2a",
        "Colors/Palette Library/Moss/600": "#4f7a21",
        "Colors/Palette Library/Moss/700": "#3f621a",
        "Colors/Palette Library/Moss/800": "#335015",
        "Colors/Palette Library/Moss/900": "#2b4212",
        "Colors/Palette Library/Moss/950": "#1a280b",
        "Colors/Palette Library/Green light/25": "#fafef5",
        "Colors/Palette Library/Green light/50": "#f3fee7",
        "Colors/Palette Library/Green light/100": "#e3fbcc",
        "Colors/Palette Library/Green light/200": "#d0f8ab",
        "Colors/Palette Library/Green light/300": "#a6ef67",
        "Colors/Palette Library/Green light/400": "#85e13a",
        "Colors/Palette Library/Green light/500": "#66c61c",
        "Colors/Palette Library/Green light/600": "#4ca30d",
        "Colors/Palette Library/Green light/700": "#3b7c0f",
        "Colors/Palette Library/Green light/800": "#326212",
        "Colors/Palette Library/Green light/900": "#2b5314",
        "Colors/Palette Library/Green light/950": "#15290a",
        "Colors/Palette Library/Teal/25": "#f6fefc",
        "Colors/Palette Library/Teal/50": "#f0fdf9",
        "Colors/Palette Library/Teal/100": "#ccfbef",
        "Colors/Palette Library/Teal/200": "#99f6e0",
        "Colors/Palette Library/Teal/300": "#5fe9d0",
        "Colors/Palette Library/Teal/400": "#2ed3b7",
        "Colors/Palette Library/Teal/500": "#15b79e",
        "Colors/Palette Library/Teal/600": "#0e9384",
        "Colors/Palette Library/Teal/700": "#107569",
        "Colors/Palette Library/Teal/800": "#125d56",
        "Colors/Palette Library/Teal/900": "#134e48",
        "Colors/Palette Library/Teal/950": "#0a2926",
        "Colors/Palette Library/Cyan/25": "#f5feff",
        "Colors/Palette Library/Cyan/50": "#ecfdff",
        "Colors/Palette Library/Cyan/100": "#cff9fe",
        "Colors/Palette Library/Cyan/200": "#a5f0fc",
        "Colors/Palette Library/Cyan/300": "#67e3f9",
        "Colors/Palette Library/Cyan/400": "#22ccee",
        "Colors/Palette Library/Cyan/500": "#06aed4",
        "Colors/Palette Library/Cyan/600": "#088ab2",
        "Colors/Palette Library/Cyan/700": "#0e7090",
        "Colors/Palette Library/Cyan/800": "#155b75",
        "Colors/Palette Library/Cyan/900": "#164c63",
        "Colors/Palette Library/Cyan/950": "#0d2d3a",
        "Colors/Palette Library/Blue light/25": "#f5fbff",
        "Colors/Palette Library/Blue light/50": "#f0f9ff",
        "Colors/Palette Library/Blue light/100": "#e0f2fe",
        "Colors/Palette Library/Blue light/200": "#b9e6fe",
        "Colors/Palette Library/Blue light/300": "#7cd4fd",
        "Colors/Palette Library/Blue light/400": "#36bffa",
        "Colors/Palette Library/Blue light/500": "#0ba5ec",
        "Colors/Palette Library/Blue light/600": "#0086c9",
        "Colors/Palette Library/Blue light/700": "#026aa2",
        "Colors/Palette Library/Blue light/800": "#065986",
        "Colors/Palette Library/Blue light/900": "#0b4a6f",
        "Colors/Palette Library/Blue light/950": "#062c41",
        "Colors/Palette Library/Blue/25": "#f5faff",
        "Colors/Palette Library/Blue/50": "#eff8ff",
        "Colors/Palette Library/Blue/100": "#d1e9ff",
        "Colors/Palette Library/Blue/200": "#b2ddff",
        "Colors/Palette Library/Blue/300": "#84caff",
        "Colors/Palette Library/Blue/400": "#53b1fd",
        "Colors/Palette Library/Blue/500": "#2e90fa",
        "Colors/Palette Library/Blue/600": "#1570ef",
        "Colors/Palette Library/Blue/700": "#175cd3",
        "Colors/Palette Library/Blue/800": "#1849a9",
        "Colors/Palette Library/Blue/900": "#194185",
        "Colors/Palette Library/Blue/950": "#102a56",
        "Colors/Palette Library/Blue dark/25": "#f5f8ff",
        "Colors/Palette Library/Blue dark/50": "#eff4ff",
        "Colors/Palette Library/Blue dark/100": "#d1e0ff",
        "Colors/Palette Library/Blue dark/200": "#b2ccff",
        "Colors/Palette Library/Blue dark/300": "#84adff",
        "Colors/Palette Library/Blue dark/400": "#528bff",
        "Colors/Palette Library/Blue dark/500": "#2970ff",
        "Colors/Palette Library/Blue dark/600": "#155eef",
        "Colors/Palette Library/Blue dark/700": "#004eeb",
        "Colors/Palette Library/Blue dark/800": "#0040c1",
        "Colors/Palette Library/Blue dark/900": "#00359e",
        "Colors/Palette Library/Blue dark/950": "#002266",
        "Colors/Palette Library/Indigo/25": "#f5f8ff",
        "Colors/Palette Library/Indigo/50": "#eef4ff",
        "Colors/Palette Library/Indigo/100": "#e0eaff",
        "Colors/Palette Library/Indigo/200": "#c7d7fe",
        "Colors/Palette Library/Indigo/300": "#a4bcfd",
        "Colors/Palette Library/Indigo/400": "#8098f9",
        "Colors/Palette Library/Indigo/500": "#6172f3",
        "Colors/Palette Library/Indigo/600": "#444ce7",
        "Colors/Palette Library/Indigo/700": "#3538cd",
        "Colors/Palette Library/Indigo/800": "#2d31a6",
        "Colors/Palette Library/Indigo/900": "#2d3282",
        "Colors/Palette Library/Indigo/950": "#1f235b",
        "Colors/Palette Library/Violet/25": "#fbfaff",
        "Colors/Palette Library/Violet/50": "#f5f3ff",
        "Colors/Palette Library/Violet/100": "#ece9fe",
        "Colors/Palette Library/Violet/200": "#ddd6fe",
        "Colors/Palette Library/Violet/300": "#c3b5fd",
        "Colors/Palette Library/Violet/400": "#a48afb",
        "Colors/Palette Library/Violet/500": "#875bf7",
        "Colors/Palette Library/Violet/600": "#7839ee",
        "Colors/Palette Library/Violet/700": "#6927da",
        "Colors/Palette Library/Violet/800": "#5720b7",
        "Colors/Palette Library/Violet/900": "#491c96",
        "Colors/Palette Library/Violet/950": "#2e125e",
        "Colors/Palette Library/Purple/25": "#fafaff",
        "Colors/Palette Library/Purple/50": "#f4f3ff",
        "Colors/Palette Library/Purple/100": "#ebe9fe",
        "Colors/Palette Library/Purple/200": "#d9d6fe",
        "Colors/Palette Library/Purple/300": "#bdb4fe",
        "Colors/Palette Library/Purple/400": "#9b8afb",
        "Colors/Palette Library/Purple/500": "#7a5af8",
        "Colors/Palette Library/Purple/600": "#6938ef",
        "Colors/Palette Library/Purple/700": "#5925dc",
        "Colors/Palette Library/Purple/800": "#4a1fb8",
        "Colors/Palette Library/Purple/900": "#3e1c96",
        "Colors/Palette Library/Purple/950": "#27115f",
        "Colors/Palette Library/Fuchsia/25": "#fefaff",
        "Colors/Palette Library/Fuchsia/50": "#fdf4ff",
        "Colors/Palette Library/Fuchsia/100": "#fbe8ff",
        "Colors/Palette Library/Fuchsia/200": "#f6d0fe",
        "Colors/Palette Library/Fuchsia/300": "#eeaafd",
        "Colors/Palette Library/Fuchsia/400": "#e478fa",
        "Colors/Palette Library/Fuchsia/500": "#d444f1",
        "Colors/Palette Library/Fuchsia/600": "#ba24d5",
        "Colors/Palette Library/Fuchsia/700": "#9f1ab1",
        "Colors/Palette Library/Fuchsia/800": "#821890",
        "Colors/Palette Library/Fuchsia/900": "#6f1877",
        "Colors/Palette Library/Fuchsia/950": "#47104c",
        "Colors/Palette Library/Pink/25": "#fef6fb",
        "Colors/Palette Library/Pink/50": "#fdf2fa",
        "Colors/Palette Library/Pink/100": "#fce7f6",
        "Colors/Palette Library/Pink/200": "#fcceee",
        "Colors/Palette Library/Pink/300": "#faa7e0",
        "Colors/Palette Library/Pink/400": "#f670c7",
        "Colors/Palette Library/Pink/500": "#ee46bc",
        "Colors/Palette Library/Pink/600": "#dd2590",
        "Colors/Palette Library/Pink/700": "#c11574",
        "Colors/Palette Library/Pink/800": "#9e165f",
        "Colors/Palette Library/Pink/900": "#851651",
        "Colors/Palette Library/Pink/950": "#4e0d30",
        "Colors/Palette Library/Rosé/25": "#fff5f6",
        "Colors/Palette Library/Rosé/50": "#fff1f3",
        "Colors/Palette Library/Rosé/100": "#ffe4e8",
        "Colors/Palette Library/Rosé/200": "#fecdd6",
        "Colors/Palette Library/Rosé/300": "#fea3b4",
        "Colors/Palette Library/Rosé/400": "#fd6f8e",
        "Colors/Palette Library/Rosé/500": "#f63d68",
        "Colors/Palette Library/Rosé/600": "#e31b54",
        "Colors/Palette Library/Rosé/700": "#c01048",
        "Colors/Palette Library/Rosé/800": "#a11043",
        "Colors/Palette Library/Rosé/900": "#89123e",
        "Colors/Palette Library/Rosé/950": "#510b24",
        "Colors/Palette Library/Orange dark/25": "#fff9f5",
        "Colors/Palette Library/Orange dark/50": "#fff4ed",
        "Colors/Palette Library/Orange dark/100": "#ffe6d5",
        "Colors/Palette Library/Orange dark/200": "#ffd6ae",
        "Colors/Palette Library/Orange dark/300": "#ff9c66",
        "Colors/Palette Library/Orange dark/400": "#ff692e",
        "Colors/Palette Library/Orange dark/500": "#ff4405",
        "Colors/Palette Library/Orange dark/600": "#e62e05",
        "Colors/Palette Library/Orange dark/700": "#bc1b06",
        "Colors/Palette Library/Orange dark/800": "#97180c",
        "Colors/Palette Library/Orange dark/900": "#771a0d",
        "Colors/Palette Library/Orange dark/950": "#57130a",
        "Colors/Palette Library/Orange/25": "#fefaf5",
        "Colors/Palette Library/Orange/50": "#fef6ee",
        "Colors/Palette Library/Orange/100": "#fdead7",
        "Colors/Palette Library/Orange/200": "#f9dbaf",
        "Colors/Palette Library/Orange/300": "#f7b27a",
        "Colors/Palette Library/Orange/400": "#f38744",
        "Colors/Palette Library/Orange/500": "#ef6820",
        "Colors/Palette Library/Orange/600": "#e04f16",
        "Colors/Palette Library/Orange/700": "#b93815",
        "Colors/Palette Library/Orange/800": "#932f19",
        "Colors/Palette Library/Orange/900": "#772917",
        "Colors/Palette Library/Orange/950": "#511c10",
        "Colors/Palette Library/Yellow/25": "#fefdf0",
        "Colors/Palette Library/Yellow/50": "#fefbe8",
        "Colors/Palette Library/Yellow/100": "#fef7c3",
        "Colors/Palette Library/Yellow/200": "#feee95",
        "Colors/Palette Library/Yellow/300": "#fde272",
        "Colors/Palette Library/Yellow/400": "#fac515",
        "Colors/Palette Library/Yellow/500": "#eaaa08",
        "Colors/Palette Library/Yellow/600": "#ca8504",
        "Colors/Palette Library/Yellow/700": "#a15c07",
        "Colors/Palette Library/Yellow/800": "#854a0e",
        "Colors/Palette Library/Yellow/900": "#713b12",
        "Colors/Palette Library/Yellow/950": "#542c0d",
        "Spacing/0": 0,
        "Spacing/1": 4,
        "Spacing/2": 8,
        "Spacing/3": 12,
        "Spacing/4": 16,
        "Spacing/5": 20,
        "Spacing/6": 24,
        "Spacing/8": 32,
        "Spacing/10": 40,
        "Spacing/12": 48,
        "Spacing/16": 64,
        "Spacing/20": 80,
        "Spacing/24": 96,
        "Spacing/32": 128,
        "Spacing/40": 160,
        "Spacing/48": 192,
        "Spacing/56": 224,
        "Spacing/64": 256,
        "Spacing/80": 320,
        "Spacing/96": 384,
        "Spacing/120": 480,
        "Spacing/140": 560,
        "Spacing/160": 640,
        "Spacing/180": 720,
        "Spacing/192": 768,
        "Spacing/256": 1024,
        "Spacing/320": 1280,
        "Spacing/360": 1440,
        "Spacing/400": 1600,
        "Spacing/480": 1920,
        "Spacing/0-5": 2,
        "Spacing/1-5": 6,
        "Colors/Palette Library/Gray true/850": "#1f1f1f",
        "Colors/Dark mode/850": "#1f1f1f",
        "Colors/Palette Library/Pewter/500": "#969b99",
        "Colors/Palette Library/Pewter/50": "#f5f5f5",
        "Colors/Palette Library/Pewter/100": "#eaebeb",
        "Colors/Palette Library/Pewter/300": "#c0c3c2",
        "Colors/Palette Library/Pewter/200": "#d5d7d6",
        "Colors/Palette Library/Pewter/400": "#abafae",
        "Colors/Palette Library/Pewter/600": "#777d7b",
        "Colors/Palette Library/Pewter/700": "#5a5e5c",
        "Colors/Palette Library/Pewter/800": "#3c3f3d",
        "Colors/Palette Library/Pewter/900": "#1e1f1f",
        "Colors/Palette Library/Pewter/950": "#0f100f",
        "Colors/Palette Library/Carbon/500": "#222222",
        "Colors/Palette Library/Carbon/50": "#e8e8e8",
        "Colors/Palette Library/Carbon/100": "#d4d4d4",
        "Colors/Palette Library/Carbon/200": "#a6a6a6",
        "Colors/Palette Library/Carbon/300": "#7a7a7a",
        "Colors/Palette Library/Carbon/400": "#4f4f4f",
        "Colors/Palette Library/Carbon/600": "#1c1c1c",
        "Colors/Palette Library/Carbon/700": "#141414",
        "Colors/Palette Library/Carbon/800": "#0d0d0d",
        "Colors/Palette Library/Carbon/900": "#080808",
        "Colors/Palette Library/Carbon/950": "#030303",
        "Colors/Palette Library/Granite/500": "#333333",
        "Colors/Palette Library/Granite/50": "#ebebeb",
        "Colors/Palette Library/Granite/100": "#d6d6d6",
        "Colors/Palette Library/Granite/200": "#adadad",
        "Colors/Palette Library/Granite/300": "#858585",
        "Colors/Palette Library/Granite/400": "#5c5c5c",
        "Colors/Palette Library/Granite/600": "#292929",
        "Colors/Palette Library/Granite/700": "#1f1f1f",
        "Colors/Palette Library/Granite/800": "#141414",
        "Colors/Palette Library/Granite/900": "#0a0a0a",
        "Colors/Palette Library/Granite/950": "#050505",
        "Colors/Palette Library/Titanium/500": "#505050",
        "Colors/Palette Library/Titanium/50": "#ededed",
        "Colors/Palette Library/Titanium/100": "#dbdbdb",
        "Colors/Palette Library/Titanium/200": "#bababa",
        "Colors/Palette Library/Titanium/300": "#969696",
        "Colors/Palette Library/Titanium/400": "#737373",
        "Colors/Palette Library/Titanium/600": "#404040",
        "Colors/Palette Library/Titanium/700": "#303030",
        "Colors/Palette Library/Titanium/800": "#212121",
        "Colors/Palette Library/Titanium/900": "#0f0f0f",
        "Colors/Palette Library/Titanium/950": "#080808",
        "Colors/Palette Library/Steel/500": "#e1e1e1",
        "Colors/Palette Library/Steel/50": "#fcfcfc",
        "Colors/Palette Library/Steel/100": "#fafafa",
        "Colors/Palette Library/Steel/200": "#f2f2f2",
        "Colors/Palette Library/Steel/300": "#ededed",
        "Colors/Palette Library/Steel/400": "#e8e8e8",
        "Colors/Palette Library/Steel/600": "#b5b5b5",
        "Colors/Palette Library/Steel/700": "#878787",
        "Colors/Palette Library/Steel/800": "#595959",
        "Colors/Palette Library/Steel/900": "#2e2e2e",
        "Colors/Palette Library/Steel/950": "#171717",
        "Colors/Palette Library/Off White/500": "#f4f4f4",
        "Colors/Palette Library/Off White/50": "#ffffff",
        "Colors/Palette Library/Off White/100": "#fcfcfc",
        "Colors/Palette Library/Off White/200": "#fafafa",
        "Colors/Palette Library/Off White/300": "#f7f7f7",
        "Colors/Palette Library/Off White/400": "#f7f7f7",
        "Colors/Palette Library/Off White/600": "#c4c4c4",
        "Colors/Palette Library/Off White/700": "#919191",
        "Colors/Palette Library/Off White/800": "#616161",
        "Colors/Palette Library/Off White/900": "#303030",
        "Colors/Palette Library/Off White/950": "#1a1a1a",
      },
    },
  },
}

type UISK_Collection1 = UISK_Collection<"2. Radius", "Default", UISK_Variables1>
type UISK_Variables1 = {
  "radius-none": number
  "radius-xxs": number
  "radius-xs": number
  "radius-sm": number
  "radius-md": number
  "radius-xl": number
  "radius-2xl": number
  "radius-4xl": number
  "radius-full": number
  "radius-lg": number
  "radius-3xl": number
}

const collection1: UISK_Collection1 = {
  "2. Radius": {
    defaultModeName: "Default",
    modeNames: ["Default"],
    modes: {
      Default: {
        "radius-none": 0,
        "radius-xxs": 2,
        "radius-xs": 4,
        "radius-sm": 6,
        "radius-md": 8,
        "radius-xl": 12,
        "radius-2xl": 16,
        "radius-4xl": 24,
        "radius-full": 9999,
        "radius-lg": 10,
        "radius-3xl": 20,
      },
    },
  },
}

type UISK_Collection2 = UISK_Collection<
  "3. Spacing",
  "Default",
  UISK_Variables2
>
type UISK_Variables2 = {
  "spacing-none": number
  "spacing-xxs": number
  "spacing-xs": number
  "spacing-md": number
  "spacing-lg": number
  "spacing-xl": number
  "spacing-2xl": number
  "spacing-3xl": number
  "spacing-4xl": number
  "spacing-6xl": number
  "spacing-7xl": number
  "spacing-8xl": number
  "spacing-9xl": number
  "spacing-10xl": number
  "spacing-11xl": number
  "spacing-sm": number
  "spacing-5xl": number
}

const collection2: UISK_Collection2 = {
  "3. Spacing": {
    defaultModeName: "Default",
    modeNames: ["Default"],
    modes: {
      Default: {
        "spacing-none": 0,
        "spacing-xxs": 2,
        "spacing-xs": 4,
        "spacing-md": 8,
        "spacing-lg": 12,
        "spacing-xl": 16,
        "spacing-2xl": 20,
        "spacing-3xl": 24,
        "spacing-4xl": 32,
        "spacing-6xl": 48,
        "spacing-7xl": 64,
        "spacing-8xl": 80,
        "spacing-9xl": 96,
        "spacing-10xl": 128,
        "spacing-11xl": 160,
        "spacing-sm": 6,
        "spacing-5xl": 40,
      },
    },
  },
}

type UISK_Collection3 = UISK_Collection<"5. Widths", "Default", UISK_Variables3>
type UISK_Variables3 = {
  "width-xxs": number
  "width-sm": number
  "width-lg": number
  "width-xl": number
  "width-2xl": number
  "width-3xl": number
  "width-4xl": number
  "width-5xl": number
  "width-6xl": number
  "width-md": number
  "paragraph-max-width": number
  "width-xs": number
}

const collection3: UISK_Collection3 = {
  "5. Widths": {
    defaultModeName: "Default",
    modeNames: ["Default"],
    modes: {
      Default: {
        "width-xxs": 320,
        "width-sm": 480,
        "width-lg": 640,
        "width-xl": 768,
        "width-2xl": 1024,
        "width-3xl": 1280,
        "width-4xl": 1440,
        "width-5xl": 1600,
        "width-6xl": 1920,
        "width-md": 560,
        "paragraph-max-width": 720,
        "width-xs": 384,
      },
    },
  },
}

type UISK_Collection4 = UISK_Collection<
  "6. Containers",
  "Default",
  UISK_Variables4
>
type UISK_Variables4 = {
  "container-max-width-desktop": number
  "container-padding-desktop": number
  "container-padding-mobile": number
}

const collection4: UISK_Collection4 = {
  "6. Containers": {
    defaultModeName: "Default",
    modeNames: ["Default"],
    modes: {
      Default: {
        "container-max-width-desktop": 1280,
        "container-padding-desktop": 32,
        "container-padding-mobile": 16,
      },
    },
  },
}

type UISK_Collection5 = UISK_Collection<
  "7. Typography",
  "Default",
  UISK_Variables5
>
type UISK_Variables5 = {
  "Font family/font-family-display": string
  "Font family/font-family-body": string
  "Font weight/regular": string
  "Font weight/regular-italic": string
  "Font weight/medium": string
  "Font weight/medium-italic": string
  "Font weight/semibold": string
  "Font weight/semibold-italic": string
  "Font weight/bold": string
  "Font weight/bold-italic": string
  "Font size/text-xs": number
  "Font size/text-sm": number
  "Font size/text-md": number
  "Font size/text-lg": number
  "Font size/text-xl": number
  "Font size/display-xs": number
  "Font size/display-sm": number
  "Font size/display-md": number
  "Font size/display-lg": number
  "Font size/display-xl": number
  "Font size/display-2xl": number
  "Line height/text-xs": number
  "Line height/text-sm": number
  "Line height/text-md": number
  "Line height/text-lg": number
  "Line height/text-xl": number
  "Line height/display-xs": number
  "Line height/display-sm": number
  "Line height/display-md": number
  "Line height/display-lg": number
  "Line height/display-xl": number
  "Line height/display-2xl": number
  "Font size/text-xxs": number
  "Line height/text-2xs": number
  "Line height/text-3xs": number
  "Line height/text-4xs": number
}

const collection5: UISK_Collection5 = {
  "7. Typography": {
    defaultModeName: "Default",
    modeNames: ["Default"],
    modes: {
      Default: {
        "Font family/font-family-display": "Work Sans",
        "Font family/font-family-body": "Work Sans",
        "Font weight/regular": "Regular",
        "Font weight/regular-italic": "Italic",
        "Font weight/medium": "Medium",
        "Font weight/medium-italic": "Medium italic",
        "Font weight/semibold": "Semibold",
        "Font weight/semibold-italic": "Semibold italic",
        "Font weight/bold": "Bold",
        "Font weight/bold-italic": "Bold italic",
        "Font size/text-xs": 10,
        "Font size/text-sm": 11,
        "Font size/text-md": 12,
        "Font size/text-lg": 14,
        "Font size/text-xl": 16,
        "Font size/display-xs": 18,
        "Font size/display-sm": 20,
        "Font size/display-md": 24,
        "Font size/display-lg": 30,
        "Font size/display-xl": 34,
        "Font size/display-2xl": 38,
        "Line height/text-xs": 18,
        "Line height/text-sm": 20,
        "Line height/text-md": 24,
        "Line height/text-lg": 28,
        "Line height/text-xl": 30,
        "Line height/display-xs": 32,
        "Line height/display-sm": 38,
        "Line height/display-md": 44,
        "Line height/display-lg": 60,
        "Line height/display-xl": 72,
        "Line height/display-2xl": 90,
        "Font size/text-xxs": 9,
        "Line height/text-2xs": 16,
        "Line height/text-3xs": 14,
        "Line height/text-4xs": 12,
      },
    },
  },
}

type UISK_Collection6 = UISK_Collection<
  "1. Color modes",
  "Dark mode" | "Light mode",
  UISK_Variables6
>
type UISK_Variables6 = {
  "Colors/Text/text-primary (900)": string
  "Colors/Text/text-tertiary (600)": string
  "Colors/Text/text-error-primary (600)": string
  "Colors/Text/text-warning-primary (600)": string
  "Colors/Text/text-success-primary (600)": string
  "Colors/Text/text-white": string
  "Colors/Text/text-secondary (700)": string
  "Colors/Text/text-disabled": string
  "Colors/Text/text-secondary_hover": string
  "Colors/Text/text-tertiary_hover": string
  "Colors/Text/text-brand-secondary (700)": string
  "Colors/Text/text-placeholder": string
  "Colors/Text/text-placeholder_subtle": string
  "Colors/Text/text-brand-tertiary (600)": string
  "Colors/Text/text-quaternary (500)": string
  "Colors/Text/text-brand-primary (900)": string
  "Colors/Text/text-primary_on-brand": string
  "Colors/Text/text-secondary_on-brand": string
  "Colors/Text/text-tertiary_on-brand": string
  "Colors/Text/text-quaternary_on-brand": string
  "Colors/Text/text-brand-tertiary_alt": string
  "Colors/Border/border-secondary": string
  "Colors/Border/border-error_subtle": string
  "Colors/Border/border-primary": string
  "Colors/Border/border-brand": string
  "Colors/Border/border-disabled": string
  "Colors/Border/border-error": string
  "Colors/Border/border-disabled_subtle": string
  "Colors/Border/border-tertiary": string
  "Colors/Border/border-brand_alt": string
  "Colors/Background/bg-primary": string
  "Colors/Background/bg-tertiary": string
  "Colors/Background/bg-brand-primary": string
  "Colors/Background/bg-error-secondary": string
  "Colors/Background/bg-warning-primary": string
  "Colors/Background/bg-warning-secondary": string
  "Colors/Background/bg-success-primary": string
  "Colors/Background/bg-success-secondary": string
  "Colors/Background/bg-brand-solid": string
  "Colors/Background/bg-secondary-solid": string
  "Colors/Background/bg-error-solid": string
  "Colors/Background/bg-warning-solid": string
  "Colors/Background/bg-success-solid": string
  "Colors/Background/bg-secondary_hover": string
  "Colors/Background/bg-primary_hover": string
  "Colors/Background/bg-disabled": string
  "Colors/Background/bg-active": string
  "Colors/Background/bg-brand-solid_hover": string
  "Colors/Background/bg-error-primary": string
  "Colors/Background/bg-brand-secondary": string
  "Colors/Background/bg-secondary": string
  "Colors/Background/bg-disabled_subtle": string
  "Colors/Background/bg-quaternary": string
  "Colors/Background/bg-primary_alt": string
  "Colors/Background/bg-brand-primary_alt": string
  "Colors/Background/bg-secondary_alt": string
  "Colors/Background/bg-overlay": string
  "Colors/Background/bg-secondary_subtle": string
  "Colors/Background/bg-brand-section": string
  "Colors/Background/bg-brand-section_subtle": string
  "Colors/Background/bg-primary-solid": string
  "Colors/Foreground/fg-secondary (700)": string
  "Colors/Foreground/fg-warning-primary": string
  "Colors/Foreground/fg-success-primary": string
  "Colors/Foreground/fg-white": string
  "Colors/Foreground/fg-success-secondary": string
  "Colors/Foreground/fg-secondary_hover": string
  "Colors/Foreground/fg-primary (900)": string
  "Colors/Foreground/fg-disabled": string
  "Colors/Foreground/fg-quaternary (500)": string
  "Colors/Foreground/fg-quaternary_hover": string
  "Colors/Foreground/fg-brand-secondary (500)": string
  "Colors/Foreground/fg-brand-primary (600)": string
  "Colors/Foreground/fg-quinary (400)": string
  "Colors/Foreground/fg-quinary_hover": string
  "Colors/Foreground/fg-error-primary": string
  "Colors/Foreground/fg-disabled_subtle": string
  "Colors/Foreground/fg-warning-secondary": string
  "Colors/Foreground/fg-error-secondary": string
  "Colors/Foreground/fg-senary (300)": string
  "Colors/Foreground/fg-tertiary (600)": string
  "Colors/Foreground/fg-tertiary_hover": string
  "Colors/Foreground/fg-brand-primary_alt": string
  "Colors/Effects/Shadows/shadow-xs": string
  "Colors/Effects/Shadows/shadow-sm_02": string
  "Colors/Effects/Shadows/shadow-lg_01": string
  "Colors/Effects/Shadows/shadow-lg_02": string
  "Colors/Effects/Shadows/shadow-sm_01": string
  "Colors/Effects/Shadows/shadow-3xl": string
  "Colors/Effects/Shadows/shadow-2xl": string
  "Colors/Effects/Shadows/shadow-md_01": string
  "Colors/Effects/Shadows/shadow-md_02": string
  "Colors/Effects/Shadows/shadow-xl_01": string
  "Colors/Effects/Shadows/shadow-xl_02": string
  "Colors/Effects/Shadows/shadow-skeumorphic-inner": string
  "Colors/Effects/Shadows/shadow-skeumorphic-inner-border": string
  "Colors/Effects/Focus rings/focus-ring": string
  "Colors/Effects/Focus rings/focus-ring-error": string
  "Component colors/Utility/Blue/utility-blue-600": string
  "Component colors/Utility/Blue/utility-blue-700": string
  "Component colors/Utility/Blue/utility-blue-500": string
  "Component colors/Utility/Blue/utility-blue-200": string
  "Component colors/Utility/Blue/utility-blue-50": string
  "Component colors/Utility/Blue/utility-blue-100": string
  "Component colors/Utility/Blue/utility-blue-400": string
  "Component colors/Utility/Blue/utility-blue-300": string
  "Component colors/Utility/Brand/utility-brand-600": string
  "Component colors/Utility/Brand/utility-brand-700": string
  "Component colors/Utility/Brand/utility-brand-500": string
  "Component colors/Utility/Brand/utility-brand-200": string
  "Component colors/Utility/Brand/utility-brand-50": string
  "Component colors/Utility/Brand/utility-brand-100": string
  "Component colors/Utility/Brand/utility-brand-400": string
  "Component colors/Utility/Brand/utility-brand-50_alt": string
  "Component colors/Utility/Brand/utility-brand-100_alt": string
  "Component colors/Utility/Brand/utility-brand-200_alt": string
  "Component colors/Utility/Brand/utility-brand-400_alt": string
  "Component colors/Utility/Brand/utility-brand-500_alt": string
  "Component colors/Utility/Brand/utility-brand-600_alt": string
  "Component colors/Utility/Brand/utility-brand-700_alt": string
  "Component colors/Utility/Brand/utility-brand-300": string
  "Component colors/Utility/Brand/utility-brand-900": string
  "Component colors/Utility/Brand/utility-brand-800": string
  "Component colors/Utility/Brand/utility-brand-300_alt": string
  "Component colors/Utility/Brand/utility-brand-800_alt": string
  "Component colors/Utility/Brand/utility-brand-900_alt": string
  "Component colors/Utility/Gray/utility-gray-700": string
  "Component colors/Utility/Gray/utility-gray-600": string
  "Component colors/Utility/Gray/utility-gray-500": string
  "Component colors/Utility/Gray/utility-gray-200": string
  "Component colors/Utility/Gray/utility-gray-50": string
  "Component colors/Utility/Gray/utility-gray-100": string
  "Component colors/Utility/Gray/utility-gray-400": string
  "Component colors/Utility/Gray/utility-gray-300": string
  "Component colors/Utility/Gray/utility-gray-900": string
  "Component colors/Utility/Gray/utility-gray-800": string
  "Component colors/Utility/Error/utility-error-600": string
  "Component colors/Utility/Error/utility-error-700": string
  "Component colors/Utility/Error/utility-error-500": string
  "Component colors/Utility/Error/utility-error-200": string
  "Component colors/Utility/Error/utility-error-50": string
  "Component colors/Utility/Error/utility-error-100": string
  "Component colors/Utility/Error/utility-error-400": string
  "Component colors/Utility/Error/utility-error-300": string
  "Component colors/Utility/Warning/utility-warning-600": string
  "Component colors/Utility/Warning/utility-warning-700": string
  "Component colors/Utility/Warning/utility-warning-500": string
  "Component colors/Utility/Warning/utility-warning-200": string
  "Component colors/Utility/Warning/utility-warning-50": string
  "Component colors/Utility/Warning/utility-warning-100": string
  "Component colors/Utility/Warning/utility-warning-400": string
  "Component colors/Utility/Warning/utility-warning-300": string
  "Component colors/Utility/Success/utility-success-600": string
  "Component colors/Utility/Success/utility-success-700": string
  "Component colors/Utility/Success/utility-success-500": string
  "Component colors/Utility/Success/utility-success-200": string
  "Component colors/Utility/Success/utility-success-50": string
  "Component colors/Utility/Success/utility-success-100": string
  "Component colors/Utility/Success/utility-success-400": string
  "Component colors/Utility/Success/utility-success-300": string
  "Component colors/Utility/Orange/utility-orange-600": string
  "Component colors/Utility/Orange/utility-orange-700": string
  "Component colors/Utility/Orange/utility-orange-500": string
  "Component colors/Utility/Orange/utility-orange-200": string
  "Component colors/Utility/Orange/utility-orange-50": string
  "Component colors/Utility/Orange/utility-orange-100": string
  "Component colors/Utility/Orange/utility-orange-400": string
  "Component colors/Utility/Orange/utility-orange-300": string
  "Component colors/Utility/Blue dark/utility-blue-dark-600": string
  "Component colors/Utility/Blue dark/utility-blue-dark-700": string
  "Component colors/Utility/Blue dark/utility-blue-dark-500": string
  "Component colors/Utility/Blue dark/utility-blue-dark-200": string
  "Component colors/Utility/Blue dark/utility-blue-dark-50": string
  "Component colors/Utility/Blue dark/utility-blue-dark-100": string
  "Component colors/Utility/Blue dark/utility-blue-dark-400": string
  "Component colors/Utility/Blue dark/utility-blue-dark-300": string
  "Component colors/Utility/Indigo/utility-indigo-600": string
  "Component colors/Utility/Indigo/utility-indigo-700": string
  "Component colors/Utility/Indigo/utility-indigo-500": string
  "Component colors/Utility/Indigo/utility-indigo-200": string
  "Component colors/Utility/Indigo/utility-indigo-50": string
  "Component colors/Utility/Indigo/utility-indigo-100": string
  "Component colors/Utility/Indigo/utility-indigo-400": string
  "Component colors/Utility/Indigo/utility-indigo-300": string
  "Component colors/Utility/Fuchsia/utility-fuchsia-600": string
  "Component colors/Utility/Fuchsia/utility-fuchsia-700": string
  "Component colors/Utility/Fuchsia/utility-fuchsia-500": string
  "Component colors/Utility/Fuchsia/utility-fuchsia-200": string
  "Component colors/Utility/Fuchsia/utility-fuchsia-50": string
  "Component colors/Utility/Fuchsia/utility-fuchsia-100": string
  "Component colors/Utility/Fuchsia/utility-fuchsia-400": string
  "Component colors/Utility/Fuchsia/utility-fuchsia-300": string
  "Component colors/Utility/Pink/utility-pink-600": string
  "Component colors/Utility/Pink/utility-pink-700": string
  "Component colors/Utility/Pink/utility-pink-500": string
  "Component colors/Utility/Pink/utility-pink-200": string
  "Component colors/Utility/Pink/utility-pink-50": string
  "Component colors/Utility/Pink/utility-pink-100": string
  "Component colors/Utility/Pink/utility-pink-400": string
  "Component colors/Utility/Pink/utility-pink-300": string
  "Component colors/Utility/Purple/utility-purple-600": string
  "Component colors/Utility/Purple/utility-purple-700": string
  "Component colors/Utility/Purple/utility-purple-500": string
  "Component colors/Utility/Purple/utility-purple-200": string
  "Component colors/Utility/Purple/utility-purple-50": string
  "Component colors/Utility/Purple/utility-purple-100": string
  "Component colors/Utility/Purple/utility-purple-400": string
  "Component colors/Utility/Purple/utility-purple-300": string
  "Component colors/Utility/Orange dark/utility-orange-dark-600": string
  "Component colors/Utility/Orange dark/utility-orange-dark-700": string
  "Component colors/Utility/Orange dark/utility-orange-dark-500": string
  "Component colors/Utility/Orange dark/utility-orange-dark-200": string
  "Component colors/Utility/Orange dark/utility-orange-dark-50": string
  "Component colors/Utility/Orange dark/utility-orange-dark-100": string
  "Component colors/Utility/Orange dark/utility-orange-dark-400": string
  "Component colors/Utility/Orange dark/utility-orange-dark-300": string
  "Component colors/Utility/Blue light/utility-blue-light-600": string
  "Component colors/Utility/Blue light/utility-blue-light-700": string
  "Component colors/Utility/Blue light/utility-blue-light-500": string
  "Component colors/Utility/Blue light/utility-blue-light-200": string
  "Component colors/Utility/Blue light/utility-blue-light-50": string
  "Component colors/Utility/Blue light/utility-blue-light-100": string
  "Component colors/Utility/Blue light/utility-blue-light-400": string
  "Component colors/Utility/Blue light/utility-blue-light-300": string
  "Component colors/Utility/Gray blue/utility-gray-blue-600": string
  "Component colors/Utility/Gray blue/utility-gray-blue-700": string
  "Component colors/Utility/Gray blue/utility-gray-blue-500": string
  "Component colors/Utility/Gray blue/utility-gray-blue-200": string
  "Component colors/Utility/Gray blue/utility-gray-blue-50": string
  "Component colors/Utility/Gray blue/utility-gray-blue-100": string
  "Component colors/Utility/Gray blue/utility-gray-blue-400": string
  "Component colors/Utility/Gray blue/utility-gray-blue-300": string
  "Component colors/Components/Tooltips/tooltip-supporting-text": string
  "Component colors/Components/Buttons/Brand/button-brand-bg": string
  "Component colors/Components/Buttons/Brand/button-brand-bg_hover": string
  "Component colors/Components/Buttons/Brand/button-brand-fg": string
  "Component colors/Components/Buttons/Brand/button-brand-fg_hover": string
  "Component colors/Components/Buttons/Secondary/button-secondary-bg": string
  "Component colors/Components/Buttons/Secondary/button-secondary-bg_hover": string
  "Component colors/Components/Buttons/Secondary/button-secondary-fg": string
  "Component colors/Components/Buttons/Secondary/button-secondary-fg_hover": string
  "Component colors/Components/Buttons/Secondary/button-secondary-border": string
  "Component colors/Components/Buttons/Secondary/button-secondary-border_hover": string
  "Component colors/Components/Buttons/Secondary color/button-secondary-color-bg": string
  "Component colors/Components/Buttons/Secondary color/button-secondary-color-bg_hover": string
  "Component colors/Components/Buttons/Secondary color/button-secondary-color-border_hover": string
  "Component colors/Components/Buttons/Secondary color/button-secondary-color-border": string
  "Component colors/Components/Buttons/Secondary color/button-secondary-color-fg": string
  "Component colors/Components/Buttons/Secondary color/button-secondary-color-fg_hover": string
  "Component colors/Components/Buttons/Primary error/button-primary-error-fg": string
  "Component colors/Components/Buttons/Primary error/button-primary-error-fg_hover": string
  "Component colors/Components/Buttons/Primary error/button-primary-error-bg": string
  "Component colors/Components/Buttons/Primary error/button-primary-error-bg_hover": string
  "Component colors/Components/Buttons/Secondary error/button-secondary-error-fg": string
  "Component colors/Components/Buttons/Secondary error/button-secondary-error-fg_hover": string
  "Component colors/Components/Buttons/Secondary error/button-secondary-error-bg": string
  "Component colors/Components/Buttons/Secondary error/button-secondary-error-bg_hover": string
  "Component colors/Components/Buttons/Secondary error/button-secondary-error-border": string
  "Component colors/Components/Buttons/Secondary error/button-secondary-error-border_hover": string
  "Component colors/Components/Buttons/Tertiary/button-tertiary-fg": string
  "Component colors/Components/Buttons/Tertiary/button-tertiary-fg_hover": string
  "Component colors/Components/Buttons/Tertiary/button-tertiary-bg_hover": string
  "Component colors/Components/Buttons/Tertiary color/button-tertiary-color-fg": string
  "Component colors/Components/Buttons/Tertiary color/button-tertiary-color-fg_hover": string
  "Component colors/Components/Buttons/Tertiary color/button-tertiary-color-bg_hover": string
  "Component colors/Components/Buttons/Tertiary error/button-tertiary-error-fg": string
  "Component colors/Components/Buttons/Tertiary error/button-tertiary-error-fg_hover": string
  "Component colors/Components/Buttons/Tertiary error/button-tertiary-error-bg_hover": string
  "Component colors/Components/Toggles/toggle-button-fg_disabled": string
  "Colors/Border/border-warning": string
  "Colors/Border/border-warning_subtle": string
  "Colors/Text/text-buy-primary": string
  "Colors/Text/text-sell-primary": string
  "Colors/Background/bg-sell-primary": string
  "Colors/Background/bg-sell-primary_hover": string
  "Colors/Background/bg-buy-primary": string
  "Colors/Background/bg-buy-primary_hover": string
  "Colors/Border/border-success": string
  "Component colors/Utility/Data/utility-data-positive-50": string
  "Component colors/Utility/Data/utility-data-positive-100": string
  "Component colors/Utility/Data/utility-data-positive-200": string
  "Component colors/Utility/Data/utility-data-positive-300": string
  "Component colors/Utility/Data/utility-data-positive-400": string
  "Component colors/Utility/Data/utility-data-positive-500": string
  "Component colors/Utility/Data/utility-data-positive-600": string
  "Component colors/Utility/Data/utility-data-positive-700": string
  "Component colors/Utility/Red/utility-red-700": string
  "Component colors/Utility/Red/utility-red-600": string
  "Component colors/Utility/Red/utility-red-500": string
  "Component colors/Utility/Red/utility-red-400": string
  "Component colors/Utility/Red/utility-red-300": string
  "Component colors/Utility/Red/utility-red-200": string
  "Component colors/Utility/Red/utility-red-100": string
  "Component colors/Utility/Red/utility-red-50": string
  "Component colors/Components/Buttons/Primary/button-primary-bg": string
  "Component colors/Components/Buttons/Primary/button-primary-bg_hover": string
  "Component colors/Components/Buttons/Primary/button-primary-fg": string
  "Component colors/Components/Buttons/Primary/button-primary-fg_hover": string
  "Component colors/Components/Buttons/Primary/button-primary-border": string
  "Component colors/Components/Buttons/Primary/button-primary-border_hover": string
  "Component colors/Components/Buttons/Primary/button-primary-fg_subtle": string
  "Colors/Border/border-sell": string
  "Colors/Border/border-buy": string
  "Colors/Text/text-black": string
  "Colors/Text/text-primary_alt": string
  "Colors/Border/border-hover": string
}

const collection6: UISK_Collection6 = {
  "1. Color modes": {
    defaultModeName: "Dark mode",
    modeNames: ["Dark mode", "Light mode"],
    modes: {
      "Dark mode": {
        "Colors/Text/text-primary (900)": "#f7f7f7",
        "Colors/Text/text-tertiary (600)": "#a3a3a3",
        "Colors/Text/text-error-primary (600)": "#c34646",
        "Colors/Text/text-warning-primary (600)": "#fdb022",
        "Colors/Text/text-success-primary (600)": "#47cd89",
        "Colors/Text/text-white": "#ffffff",
        "Colors/Text/text-secondary (700)": "#d6d6d6",
        "Colors/Text/text-disabled": "#737373",
        "Colors/Text/text-secondary_hover": "#e5e5e5",
        "Colors/Text/text-tertiary_hover": "#d6d6d6",
        "Colors/Text/text-brand-secondary (700)": "#d6d6d6",
        "Colors/Text/text-placeholder": "#737373",
        "Colors/Text/text-placeholder_subtle": "#424242",
        "Colors/Text/text-brand-tertiary (600)": "#a3a3a3",
        "Colors/Text/text-quaternary (500)": "#737373",
        "Colors/Text/text-brand-primary (900)": "#8e90f9",
        "Colors/Text/text-primary_on-brand": "#ffffff",
        "Colors/Text/text-secondary_on-brand": "#d9dafd",
        "Colors/Text/text-tertiary_on-brand": "#c0c2fc",
        "Colors/Text/text-quaternary_on-brand": "#a7a9fa",
        "Colors/Text/text-brand-tertiary_alt": "#f7f7f7",
        "Colors/Border/border-secondary": "#292929",
        "Colors/Border/border-error_subtle": "#890c21",
        "Colors/Border/border-primary": "#424242",
        "Colors/Border/border-brand": "#8184f8",
        "Colors/Border/border-disabled": "#424242",
        "Colors/Border/border-error": "#c41230",
        "Colors/Border/border-disabled_subtle": "#292929",
        "Colors/Border/border-tertiary": "#292929",
        "Colors/Border/border-brand_alt": "#424242",
        "Colors/Background/bg-primary": "#0f0f0f",
        "Colors/Background/bg-tertiary": "#292929",
        "Colors/Background/bg-brand-primary": "#8184f8",
        "Colors/Background/bg-error-secondary": "#890c21",
        "Colors/Background/bg-warning-primary": "#f79009",
        "Colors/Background/bg-warning-secondary": "#dc6803",
        "Colors/Background/bg-success-primary": "#17b26a",
        "Colors/Background/bg-success-secondary": "#079455",
        "Colors/Background/bg-brand-solid": "#676ac6",
        "Colors/Background/bg-secondary-solid": "#525252",
        "Colors/Background/bg-error-solid": "#890c21",
        "Colors/Background/bg-warning-solid": "#dc6803",
        "Colors/Background/bg-success-solid": "#079455",
        "Colors/Background/bg-secondary_hover": "#424242",
        "Colors/Background/bg-primary_hover": "#292929",
        "Colors/Background/bg-disabled": "#292929",
        "Colors/Background/bg-active": "#292929",
        "Colors/Background/bg-brand-solid_hover": "#8184f8",
        "Colors/Background/bg-error-primary": "#a50e28",
        "Colors/Background/bg-brand-secondary": "#676ac6",
        "Colors/Background/bg-secondary": "#1f1f1f",
        "Colors/Background/bg-disabled_subtle": "#292929",
        "Colors/Background/bg-quaternary": "#424242",
        "Colors/Background/bg-primary_alt": "#141414",
        "Colors/Background/bg-brand-primary_alt": "#1f1f1f",
        "Colors/Background/bg-secondary_alt": "#0f0f0f",
        "Colors/Background/bg-overlay": "#292929",
        "Colors/Background/bg-secondary_subtle": "#141414",
        "Colors/Background/bg-brand-section": "#1f1f1f",
        "Colors/Background/bg-brand-section_subtle": "#0f0f0f",
        "Colors/Background/bg-primary-solid": "#f5f5f5",
        "Colors/Foreground/fg-secondary (700)": "#d6d6d6",
        "Colors/Foreground/fg-warning-primary": "#f79009",
        "Colors/Foreground/fg-success-primary": "#17b26a",
        "Colors/Foreground/fg-white": "#ffffff",
        "Colors/Foreground/fg-success-secondary": "#47cd89",
        "Colors/Foreground/fg-secondary_hover": "#e5e5e5",
        "Colors/Foreground/fg-primary (900)": "#ffffff",
        "Colors/Foreground/fg-disabled": "#737373",
        "Colors/Foreground/fg-quaternary (500)": "#a3a3a3",
        "Colors/Foreground/fg-quaternary_hover": "#d6d6d6",
        "Colors/Foreground/fg-brand-secondary (500)": "#8184f8",
        "Colors/Foreground/fg-brand-primary (600)": "#8184f8",
        "Colors/Foreground/fg-quinary (400)": "#737373",
        "Colors/Foreground/fg-quinary_hover": "#a3a3a3",
        "Colors/Foreground/fg-error-primary": "#a50e28",
        "Colors/Foreground/fg-disabled_subtle": "#525252",
        "Colors/Foreground/fg-warning-secondary": "#fdb022",
        "Colors/Foreground/fg-error-secondary": "#c41230",
        "Colors/Foreground/fg-senary (300)": "#525252",
        "Colors/Foreground/fg-tertiary (600)": "#a3a3a3",
        "Colors/Foreground/fg-tertiary_hover": "#d6d6d6",
        "Colors/Foreground/fg-brand-primary_alt": "#d6d6d6",
        "Colors/Effects/Shadows/shadow-xs": "#1313160d",
        "Colors/Effects/Shadows/shadow-sm_02": "#1313160f",
        "Colors/Effects/Shadows/shadow-lg_01": "#131316",
        "Colors/Effects/Shadows/shadow-lg_02": "#131316cc",
        "Colors/Effects/Shadows/shadow-sm_01": "#1313161a",
        "Colors/Effects/Shadows/shadow-3xl": "#13131624",
        "Colors/Effects/Shadows/shadow-2xl": "#1313162e",
        "Colors/Effects/Shadows/shadow-md_01": "#1313161a",
        "Colors/Effects/Shadows/shadow-md_02": "#1313160f",
        "Colors/Effects/Shadows/shadow-xl_01": "#13131614",
        "Colors/Effects/Shadows/shadow-xl_02": "#13131608",
        "Colors/Effects/Shadows/shadow-skeumorphic-inner": "#1313160d",
        "Colors/Effects/Shadows/shadow-skeumorphic-inner-border": "#13131640",
        "Colors/Effects/Focus rings/focus-ring": "#2e90fa",
        "Colors/Effects/Focus rings/focus-ring-error": "#a50e28",
        "Component colors/Utility/Blue/utility-blue-600": "#53b1fd",
        "Component colors/Utility/Blue/utility-blue-700": "#84caff",
        "Component colors/Utility/Blue/utility-blue-500": "#2e90fa",
        "Component colors/Utility/Blue/utility-blue-200": "#1849a9",
        "Component colors/Utility/Blue/utility-blue-50": "#102a56",
        "Component colors/Utility/Blue/utility-blue-100": "#194185",
        "Component colors/Utility/Blue/utility-blue-400": "#1570ef",
        "Component colors/Utility/Blue/utility-blue-300": "#175cd3",
        "Component colors/Utility/Brand/utility-brand-600": "#8e90f9",
        "Component colors/Utility/Brand/utility-brand-700": "#a7a9fa",
        "Component colors/Utility/Brand/utility-brand-500": "#8184f8",
        "Component colors/Utility/Brand/utility-brand-200": "#41427c",
        "Component colors/Utility/Brand/utility-brand-50": "#0d0d19",
        "Component colors/Utility/Brand/utility-brand-100": "#27284a",
        "Component colors/Utility/Brand/utility-brand-400": "#676ac6",
        "Component colors/Utility/Brand/utility-brand-50_alt": "#141414",
        "Component colors/Utility/Brand/utility-brand-100_alt": "#292929",
        "Component colors/Utility/Brand/utility-brand-200_alt": "#424242",
        "Component colors/Utility/Brand/utility-brand-400_alt": "#525252",
        "Component colors/Utility/Brand/utility-brand-500_alt": "#737373",
        "Component colors/Utility/Brand/utility-brand-600_alt": "#a3a3a3",
        "Component colors/Utility/Brand/utility-brand-700_alt": "#d6d6d6",
        "Component colors/Utility/Brand/utility-brand-300": "#4d4f95",
        "Component colors/Utility/Brand/utility-brand-900": "#d9dafd",
        "Component colors/Utility/Brand/utility-brand-800": "#c0c2fc",
        "Component colors/Utility/Brand/utility-brand-300_alt": "#424242",
        "Component colors/Utility/Brand/utility-brand-800_alt": "#e5e5e5",
        "Component colors/Utility/Brand/utility-brand-900_alt": "#f5f5f5",
        "Component colors/Utility/Gray/utility-gray-700": "#d6d6d6",
        "Component colors/Utility/Gray/utility-gray-600": "#a3a3a3",
        "Component colors/Utility/Gray/utility-gray-500": "#737373",
        "Component colors/Utility/Gray/utility-gray-200": "#424242",
        "Component colors/Utility/Gray/utility-gray-50": "#141414",
        "Component colors/Utility/Gray/utility-gray-100": "#292929",
        "Component colors/Utility/Gray/utility-gray-400": "#525252",
        "Component colors/Utility/Gray/utility-gray-300": "#424242",
        "Component colors/Utility/Gray/utility-gray-900": "#f5f5f5",
        "Component colors/Utility/Gray/utility-gray-800": "#e5e5e5",
        "Component colors/Utility/Error/utility-error-600": "#c41230",
        "Component colors/Utility/Error/utility-error-700": "#d14159",
        "Component colors/Utility/Error/utility-error-500": "#a50e28",
        "Component colors/Utility/Error/utility-error-200": "#500713",
        "Component colors/Utility/Error/utility-error-50": "#34040d",
        "Component colors/Utility/Error/utility-error-100": "#34040d",
        "Component colors/Utility/Error/utility-error-400": "#890c21",
        "Component colors/Utility/Error/utility-error-300": "#6d091a",
        "Component colors/Utility/Warning/utility-warning-600": "#fdb022",
        "Component colors/Utility/Warning/utility-warning-700": "#fec84b",
        "Component colors/Utility/Warning/utility-warning-500": "#f79009",
        "Component colors/Utility/Warning/utility-warning-200": "#93370d",
        "Component colors/Utility/Warning/utility-warning-50": "#4e1d09",
        "Component colors/Utility/Warning/utility-warning-100": "#7a2e0e",
        "Component colors/Utility/Warning/utility-warning-400": "#dc6803",
        "Component colors/Utility/Warning/utility-warning-300": "#b54708",
        "Component colors/Utility/Success/utility-success-600": "#47cd89",
        "Component colors/Utility/Success/utility-success-700": "#75e0a7",
        "Component colors/Utility/Success/utility-success-500": "#17b26a",
        "Component colors/Utility/Success/utility-success-200": "#085d3a",
        "Component colors/Utility/Success/utility-success-50": "#053321",
        "Component colors/Utility/Success/utility-success-100": "#074d31",
        "Component colors/Utility/Success/utility-success-400": "#079455",
        "Component colors/Utility/Success/utility-success-300": "#067647",
        "Component colors/Utility/Orange/utility-orange-600": "#f38744",
        "Component colors/Utility/Orange/utility-orange-700": "#f7b27a",
        "Component colors/Utility/Orange/utility-orange-500": "#ef6820",
        "Component colors/Utility/Orange/utility-orange-200": "#932f19",
        "Component colors/Utility/Orange/utility-orange-50": "#511c10",
        "Component colors/Utility/Orange/utility-orange-100": "#772917",
        "Component colors/Utility/Orange/utility-orange-400": "#e04f16",
        "Component colors/Utility/Orange/utility-orange-300": "#b93815",
        "Component colors/Utility/Blue dark/utility-blue-dark-600": "#528bff",
        "Component colors/Utility/Blue dark/utility-blue-dark-700": "#84adff",
        "Component colors/Utility/Blue dark/utility-blue-dark-500": "#2970ff",
        "Component colors/Utility/Blue dark/utility-blue-dark-200": "#0040c1",
        "Component colors/Utility/Blue dark/utility-blue-dark-50": "#002266",
        "Component colors/Utility/Blue dark/utility-blue-dark-100": "#00359e",
        "Component colors/Utility/Blue dark/utility-blue-dark-400": "#155eef",
        "Component colors/Utility/Blue dark/utility-blue-dark-300": "#004eeb",
        "Component colors/Utility/Indigo/utility-indigo-600": "#8098f9",
        "Component colors/Utility/Indigo/utility-indigo-700": "#a4bcfd",
        "Component colors/Utility/Indigo/utility-indigo-500": "#6172f3",
        "Component colors/Utility/Indigo/utility-indigo-200": "#2d31a6",
        "Component colors/Utility/Indigo/utility-indigo-50": "#1f235b",
        "Component colors/Utility/Indigo/utility-indigo-100": "#2d3282",
        "Component colors/Utility/Indigo/utility-indigo-400": "#444ce7",
        "Component colors/Utility/Indigo/utility-indigo-300": "#3538cd",
        "Component colors/Utility/Fuchsia/utility-fuchsia-600": "#e478fa",
        "Component colors/Utility/Fuchsia/utility-fuchsia-700": "#eeaafd",
        "Component colors/Utility/Fuchsia/utility-fuchsia-500": "#d444f1",
        "Component colors/Utility/Fuchsia/utility-fuchsia-200": "#821890",
        "Component colors/Utility/Fuchsia/utility-fuchsia-50": "#47104c",
        "Component colors/Utility/Fuchsia/utility-fuchsia-100": "#6f1877",
        "Component colors/Utility/Fuchsia/utility-fuchsia-400": "#ba24d5",
        "Component colors/Utility/Fuchsia/utility-fuchsia-300": "#9f1ab1",
        "Component colors/Utility/Pink/utility-pink-600": "#f670c7",
        "Component colors/Utility/Pink/utility-pink-700": "#faa7e0",
        "Component colors/Utility/Pink/utility-pink-500": "#ee46bc",
        "Component colors/Utility/Pink/utility-pink-200": "#9e165f",
        "Component colors/Utility/Pink/utility-pink-50": "#4e0d30",
        "Component colors/Utility/Pink/utility-pink-100": "#851651",
        "Component colors/Utility/Pink/utility-pink-400": "#dd2590",
        "Component colors/Utility/Pink/utility-pink-300": "#c11574",
        "Component colors/Utility/Purple/utility-purple-600": "#9b8afb",
        "Component colors/Utility/Purple/utility-purple-700": "#bdb4fe",
        "Component colors/Utility/Purple/utility-purple-500": "#7a5af8",
        "Component colors/Utility/Purple/utility-purple-200": "#4a1fb8",
        "Component colors/Utility/Purple/utility-purple-50": "#27115f",
        "Component colors/Utility/Purple/utility-purple-100": "#3e1c96",
        "Component colors/Utility/Purple/utility-purple-400": "#6938ef",
        "Component colors/Utility/Purple/utility-purple-300": "#5925dc",
        "Component colors/Utility/Orange dark/utility-orange-dark-600":
          "#ff692e",
        "Component colors/Utility/Orange dark/utility-orange-dark-700":
          "#ff9c66",
        "Component colors/Utility/Orange dark/utility-orange-dark-500":
          "#ff4405",
        "Component colors/Utility/Orange dark/utility-orange-dark-200":
          "#97180c",
        "Component colors/Utility/Orange dark/utility-orange-dark-50":
          "#57130a",
        "Component colors/Utility/Orange dark/utility-orange-dark-100":
          "#771a0d",
        "Component colors/Utility/Orange dark/utility-orange-dark-400":
          "#e62e05",
        "Component colors/Utility/Orange dark/utility-orange-dark-300":
          "#bc1b06",
        "Component colors/Utility/Blue light/utility-blue-light-600": "#36bffa",
        "Component colors/Utility/Blue light/utility-blue-light-700": "#7cd4fd",
        "Component colors/Utility/Blue light/utility-blue-light-500": "#0ba5ec",
        "Component colors/Utility/Blue light/utility-blue-light-200": "#065986",
        "Component colors/Utility/Blue light/utility-blue-light-50": "#062c41",
        "Component colors/Utility/Blue light/utility-blue-light-100": "#0b4a6f",
        "Component colors/Utility/Blue light/utility-blue-light-400": "#0086c9",
        "Component colors/Utility/Blue light/utility-blue-light-300": "#026aa2",
        "Component colors/Utility/Gray blue/utility-gray-blue-600": "#717bbc",
        "Component colors/Utility/Gray blue/utility-gray-blue-700": "#b3b8db",
        "Component colors/Utility/Gray blue/utility-gray-blue-500": "#4e5ba6",
        "Component colors/Utility/Gray blue/utility-gray-blue-200": "#293056",
        "Component colors/Utility/Gray blue/utility-gray-blue-50": "#101323",
        "Component colors/Utility/Gray blue/utility-gray-blue-100": "#101323",
        "Component colors/Utility/Gray blue/utility-gray-blue-400": "#3e4784",
        "Component colors/Utility/Gray blue/utility-gray-blue-300": "#363f72",
        "Component colors/Components/Tooltips/tooltip-supporting-text":
          "#d6d6d6",
        "Component colors/Components/Buttons/Brand/button-brand-bg": "#8184f8",
        "Component colors/Components/Buttons/Brand/button-brand-bg_hover":
          "#4d4f95",
        "Component colors/Components/Buttons/Brand/button-brand-fg": "#000000",
        "Component colors/Components/Buttons/Brand/button-brand-fg_hover":
          "#ffffff",
        "Component colors/Components/Buttons/Secondary/button-secondary-bg":
          "#141414",
        "Component colors/Components/Buttons/Secondary/button-secondary-bg_hover":
          "#292929",
        "Component colors/Components/Buttons/Secondary/button-secondary-fg":
          "#d6d6d6",
        "Component colors/Components/Buttons/Secondary/button-secondary-fg_hover":
          "#f5f5f5",
        "Component colors/Components/Buttons/Secondary/button-secondary-border":
          "#424242",
        "Component colors/Components/Buttons/Secondary/button-secondary-border_hover":
          "#424242",
        "Component colors/Components/Buttons/Secondary color/button-secondary-color-bg":
          "#141414",
        "Component colors/Components/Buttons/Secondary color/button-secondary-color-bg_hover":
          "#292929",
        "Component colors/Components/Buttons/Secondary color/button-secondary-color-border_hover":
          "#424242",
        "Component colors/Components/Buttons/Secondary color/button-secondary-color-border":
          "#424242",
        "Component colors/Components/Buttons/Secondary color/button-secondary-color-fg":
          "#d6d6d6",
        "Component colors/Components/Buttons/Secondary color/button-secondary-color-fg_hover":
          "#f5f5f5",
        "Component colors/Components/Buttons/Primary error/button-primary-error-fg":
          "#ffffff",
        "Component colors/Components/Buttons/Primary error/button-primary-error-fg_hover":
          "#ffffff",
        "Component colors/Components/Buttons/Primary error/button-primary-error-bg":
          "#890c21",
        "Component colors/Components/Buttons/Primary error/button-primary-error-bg_hover":
          "#6d091a",
        "Component colors/Components/Buttons/Secondary error/button-secondary-error-fg":
          "#e28897",
        "Component colors/Components/Buttons/Secondary error/button-secondary-error-fg_hover":
          "#f3d0d6",
        "Component colors/Components/Buttons/Secondary error/button-secondary-error-bg":
          "#34040d",
        "Component colors/Components/Buttons/Secondary error/button-secondary-error-bg_hover":
          "#34040d",
        "Component colors/Components/Buttons/Secondary error/button-secondary-error-border":
          "#500713",
        "Component colors/Components/Buttons/Secondary error/button-secondary-error-border_hover":
          "#6d091a",
        "Component colors/Components/Buttons/Tertiary/button-tertiary-fg":
          "#a3a3a3",
        "Component colors/Components/Buttons/Tertiary/button-tertiary-fg_hover":
          "#e5e5e5",
        "Component colors/Components/Buttons/Tertiary/button-tertiary-bg_hover":
          "#292929",
        "Component colors/Components/Buttons/Tertiary color/button-tertiary-color-fg":
          "#d6d6d6",
        "Component colors/Components/Buttons/Tertiary color/button-tertiary-color-fg_hover":
          "#f5f5f5",
        "Component colors/Components/Buttons/Tertiary color/button-tertiary-color-bg_hover":
          "#292929",
        "Component colors/Components/Buttons/Tertiary error/button-tertiary-error-fg":
          "#d14159",
        "Component colors/Components/Buttons/Tertiary error/button-tertiary-error-fg_hover":
          "#e28897",
        "Component colors/Components/Buttons/Tertiary error/button-tertiary-error-bg_hover":
          "#34040d",
        "Component colors/Components/Toggles/toggle-button-fg_disabled":
          "#525252",
        "Colors/Border/border-warning": "#f79009",
        "Colors/Border/border-warning_subtle": "#a15c07",
        "Colors/Text/text-buy-primary": "#8184f8",
        "Colors/Text/text-sell-primary": "#f63d68",
        "Colors/Background/bg-sell-primary": "#c01048",
        "Colors/Background/bg-sell-primary_hover": "#e31b54",
        "Colors/Background/bg-buy-primary": "#8e90f9",
        "Colors/Background/bg-buy-primary_hover": "#676ac6",
        "Colors/Border/border-success": "#079455",
        "Component colors/Utility/Data/utility-data-positive-50": "#cce4cc",
        "Component colors/Utility/Data/utility-data-positive-100": "#7fbb7f",
        "Component colors/Utility/Data/utility-data-positive-200": "#339233",
        "Component colors/Utility/Data/utility-data-positive-300": "#007700",
        "Component colors/Utility/Data/utility-data-positive-400": "#005a00",
        "Component colors/Utility/Data/utility-data-positive-500": "#004b00",
        "Component colors/Utility/Data/utility-data-positive-600": "#003b00",
        "Component colors/Utility/Data/utility-data-positive-700": "#002c00",
        "Component colors/Utility/Red/utility-red-700": "#e28897",
        "Component colors/Utility/Red/utility-red-600": "#d14159",
        "Component colors/Utility/Red/utility-red-500": "#c41230",
        "Component colors/Utility/Red/utility-red-400": "#a50e28",
        "Component colors/Utility/Red/utility-red-300": "#890c21",
        "Component colors/Utility/Red/utility-red-200": "#6d091a",
        "Component colors/Utility/Red/utility-red-100": "#500713",
        "Component colors/Utility/Red/utility-red-50": "#34040d",
        "Component colors/Components/Buttons/Primary/button-primary-bg":
          "#292929",
        "Component colors/Components/Buttons/Primary/button-primary-bg_hover":
          "#424242",
        "Component colors/Components/Buttons/Primary/button-primary-fg":
          "#d6d6d6",
        "Component colors/Components/Buttons/Primary/button-primary-fg_hover":
          "#fcfcfc",
        "Component colors/Components/Buttons/Primary/button-primary-border":
          "#424242",
        "Component colors/Components/Buttons/Primary/button-primary-border_hover":
          "#424242",
        "Component colors/Components/Buttons/Primary/button-primary-fg_subtle":
          "#a3a3a3",
        "Colors/Border/border-sell": "#f63d68",
        "Colors/Border/border-buy": "#8184f8",
        "Colors/Text/text-black": "#000000",
        "Colors/Text/text-primary_alt": "#0f0f0f",
        "Colors/Border/border-hover": "#737373",
      },
      "Light mode": {
        "Colors/Text/text-primary (900)": "#141414",
        "Colors/Text/text-tertiary (600)": "#525252",
        "Colors/Text/text-error-primary (600)": "#730000",
        "Colors/Text/text-warning-primary (600)": "#dc6803",
        "Colors/Text/text-success-primary (600)": "#079455",
        "Colors/Text/text-white": "#ffffff",
        "Colors/Text/text-secondary (700)": "#424242",
        "Colors/Text/text-disabled": "#737373",
        "Colors/Text/text-secondary_hover": "#292929",
        "Colors/Text/text-tertiary_hover": "#424242",
        "Colors/Text/text-brand-secondary (700)": "#4d4f95",
        "Colors/Text/text-placeholder": "#737373",
        "Colors/Text/text-placeholder_subtle": "#d6d6d6",
        "Colors/Text/text-brand-tertiary (600)": "#676ac6",
        "Colors/Text/text-quaternary (500)": "#737373",
        "Colors/Text/text-brand-primary (900)": "#8184f8",
        "Colors/Text/text-primary_on-brand": "#ffffff",
        "Colors/Text/text-secondary_on-brand": "#c0c2fc",
        "Colors/Text/text-tertiary_on-brand": "#c0c2fc",
        "Colors/Text/text-quaternary_on-brand": "#a7a9fa",
        "Colors/Text/text-brand-tertiary_alt": "#676ac6",
        "Colors/Border/border-secondary": "#f5f5f5",
        "Colors/Border/border-error_subtle": "#d14159",
        "Colors/Border/border-primary": "#e5e5e5",
        "Colors/Border/border-brand": "#27284a",
        "Colors/Border/border-disabled": "#d6d6d6",
        "Colors/Border/border-error": "#a50e28",
        "Colors/Border/border-disabled_subtle": "#e5e5e5",
        "Colors/Border/border-tertiary": "#f5f5f5",
        "Colors/Border/border-brand_alt": "#676ac6",
        "Colors/Background/bg-primary": "#f5f5f5",
        "Colors/Background/bg-tertiary": "#f5f5f5",
        "Colors/Background/bg-brand-primary": "#e6e6fe",
        "Colors/Background/bg-error-secondary": "#f3d0d6",
        "Colors/Background/bg-warning-primary": "#fffaeb",
        "Colors/Background/bg-warning-secondary": "#fef0c7",
        "Colors/Background/bg-success-primary": "#ecfdf3",
        "Colors/Background/bg-success-secondary": "#dcfae6",
        "Colors/Background/bg-brand-solid": "#676ac6",
        "Colors/Background/bg-secondary-solid": "#525252",
        "Colors/Background/bg-error-solid": "#890c21",
        "Colors/Background/bg-warning-solid": "#dc6803",
        "Colors/Background/bg-success-solid": "#079455",
        "Colors/Background/bg-secondary_hover": "#f5f5f5",
        "Colors/Background/bg-primary_hover": "#f7f7f7",
        "Colors/Background/bg-disabled": "#f5f5f5",
        "Colors/Background/bg-active": "#e5e5e5",
        "Colors/Background/bg-brand-solid_hover": "#4d4f95",
        "Colors/Background/bg-error-primary": "#f9e7ea",
        "Colors/Background/bg-brand-secondary": "#d9dafd",
        "Colors/Background/bg-secondary": "#f7f7f7",
        "Colors/Background/bg-disabled_subtle": "#f7f7f7",
        "Colors/Background/bg-quaternary": "#e5e5e5",
        "Colors/Background/bg-primary_alt": "#ffffff",
        "Colors/Background/bg-brand-primary_alt": "#e6e6fe",
        "Colors/Background/bg-secondary_alt": "#f7f7f7",
        "Colors/Background/bg-overlay": "#0f0f0f",
        "Colors/Background/bg-secondary_subtle": "#fcfcfc",
        "Colors/Background/bg-brand-section": "#41427c",
        "Colors/Background/bg-brand-section_subtle": "#4d4f95",
        "Colors/Background/bg-primary-solid": "#0f0f0f",
        "Colors/Foreground/fg-secondary (700)": "#424242",
        "Colors/Foreground/fg-warning-primary": "#dc6803",
        "Colors/Foreground/fg-success-primary": "#079455",
        "Colors/Foreground/fg-white": "#ffffff",
        "Colors/Foreground/fg-success-secondary": "#17b26a",
        "Colors/Foreground/fg-secondary_hover": "#292929",
        "Colors/Foreground/fg-primary (900)": "#141414",
        "Colors/Foreground/fg-disabled": "#a3a3a3",
        "Colors/Foreground/fg-quaternary (500)": "#737373",
        "Colors/Foreground/fg-quaternary_hover": "#525252",
        "Colors/Foreground/fg-brand-secondary (500)": "#8184f8",
        "Colors/Foreground/fg-brand-primary (600)": "#676ac6",
        "Colors/Foreground/fg-quinary (400)": "#a3a3a3",
        "Colors/Foreground/fg-quinary_hover": "#737373",
        "Colors/Foreground/fg-error-primary": "#890c21",
        "Colors/Foreground/fg-disabled_subtle": "#d6d6d6",
        "Colors/Foreground/fg-warning-secondary": "#f79009",
        "Colors/Foreground/fg-error-secondary": "#a50e28",
        "Colors/Foreground/fg-senary (300)": "#d6d6d6",
        "Colors/Foreground/fg-tertiary (600)": "#525252",
        "Colors/Foreground/fg-tertiary_hover": "#424242",
        "Colors/Foreground/fg-brand-primary_alt": "#676ac6",
        "Colors/Effects/Shadows/shadow-xs": "#1018280d",
        "Colors/Effects/Shadows/shadow-sm_02": "#1018280f",
        "Colors/Effects/Shadows/shadow-lg_01": "#10182814",
        "Colors/Effects/Shadows/shadow-lg_02": "#10182808",
        "Colors/Effects/Shadows/shadow-sm_01": "#1018281a",
        "Colors/Effects/Shadows/shadow-3xl": "#10182824",
        "Colors/Effects/Shadows/shadow-2xl": "#1018282e",
        "Colors/Effects/Shadows/shadow-md_01": "#1018281a",
        "Colors/Effects/Shadows/shadow-md_02": "#1018280f",
        "Colors/Effects/Shadows/shadow-xl_01": "#10182814",
        "Colors/Effects/Shadows/shadow-xl_02": "#10182808",
        "Colors/Effects/Shadows/shadow-skeumorphic-inner": "#1018280d",
        "Colors/Effects/Shadows/shadow-skeumorphic-inner-border": "#1018282e",
        "Colors/Effects/Focus rings/focus-ring": "#8184f8",
        "Colors/Effects/Focus rings/focus-ring-error": "#a50e28",
        "Component colors/Utility/Blue/utility-blue-600": "#1570ef",
        "Component colors/Utility/Blue/utility-blue-700": "#175cd3",
        "Component colors/Utility/Blue/utility-blue-500": "#2e90fa",
        "Component colors/Utility/Blue/utility-blue-200": "#b2ddff",
        "Component colors/Utility/Blue/utility-blue-50": "#eff8ff",
        "Component colors/Utility/Blue/utility-blue-100": "#d1e9ff",
        "Component colors/Utility/Blue/utility-blue-400": "#53b1fd",
        "Component colors/Utility/Blue/utility-blue-300": "#84caff",
        "Component colors/Utility/Brand/utility-brand-600": "#676ac6",
        "Component colors/Utility/Brand/utility-brand-700": "#4d4f95",
        "Component colors/Utility/Brand/utility-brand-500": "#8184f8",
        "Component colors/Utility/Brand/utility-brand-200": "#c0c2fc",
        "Component colors/Utility/Brand/utility-brand-50": "#e6e6fe",
        "Component colors/Utility/Brand/utility-brand-100": "#d9dafd",
        "Component colors/Utility/Brand/utility-brand-400": "#8e90f9",
        "Component colors/Utility/Brand/utility-brand-50_alt": "#e6e6fe",
        "Component colors/Utility/Brand/utility-brand-100_alt": "#d9dafd",
        "Component colors/Utility/Brand/utility-brand-200_alt": "#c0c2fc",
        "Component colors/Utility/Brand/utility-brand-400_alt": "#8e90f9",
        "Component colors/Utility/Brand/utility-brand-500_alt": "#8184f8",
        "Component colors/Utility/Brand/utility-brand-600_alt": "#676ac6",
        "Component colors/Utility/Brand/utility-brand-700_alt": "#4d4f95",
        "Component colors/Utility/Brand/utility-brand-300": "#a7a9fa",
        "Component colors/Utility/Brand/utility-brand-900": "#27284a",
        "Component colors/Utility/Brand/utility-brand-800": "#41427c",
        "Component colors/Utility/Brand/utility-brand-300_alt": "#a7a9fa",
        "Component colors/Utility/Brand/utility-brand-800_alt": "#41427c",
        "Component colors/Utility/Brand/utility-brand-900_alt": "#27284a",
        "Component colors/Utility/Gray/utility-gray-700": "#424242",
        "Component colors/Utility/Gray/utility-gray-600": "#525252",
        "Component colors/Utility/Gray/utility-gray-500": "#737373",
        "Component colors/Utility/Gray/utility-gray-200": "#e5e5e5",
        "Component colors/Utility/Gray/utility-gray-50": "#f7f7f7",
        "Component colors/Utility/Gray/utility-gray-100": "#f5f5f5",
        "Component colors/Utility/Gray/utility-gray-400": "#a3a3a3",
        "Component colors/Utility/Gray/utility-gray-300": "#d6d6d6",
        "Component colors/Utility/Gray/utility-gray-900": "#141414",
        "Component colors/Utility/Gray/utility-gray-800": "#292929",
        "Component colors/Utility/Error/utility-error-600": "#890c21",
        "Component colors/Utility/Error/utility-error-700": "#6d091a",
        "Component colors/Utility/Error/utility-error-500": "#a50e28",
        "Component colors/Utility/Error/utility-error-200": "#e28897",
        "Component colors/Utility/Error/utility-error-50": "#f9e7ea",
        "Component colors/Utility/Error/utility-error-100": "#f3d0d6",
        "Component colors/Utility/Error/utility-error-400": "#c41230",
        "Component colors/Utility/Error/utility-error-300": "#d14159",
        "Component colors/Utility/Warning/utility-warning-600": "#dc6803",
        "Component colors/Utility/Warning/utility-warning-700": "#b54708",
        "Component colors/Utility/Warning/utility-warning-500": "#f79009",
        "Component colors/Utility/Warning/utility-warning-200": "#fedf89",
        "Component colors/Utility/Warning/utility-warning-50": "#fffaeb",
        "Component colors/Utility/Warning/utility-warning-100": "#fef0c7",
        "Component colors/Utility/Warning/utility-warning-400": "#fdb022",
        "Component colors/Utility/Warning/utility-warning-300": "#fec84b",
        "Component colors/Utility/Success/utility-success-600": "#079455",
        "Component colors/Utility/Success/utility-success-700": "#067647",
        "Component colors/Utility/Success/utility-success-500": "#17b26a",
        "Component colors/Utility/Success/utility-success-200": "#abefc6",
        "Component colors/Utility/Success/utility-success-50": "#ecfdf3",
        "Component colors/Utility/Success/utility-success-100": "#dcfae6",
        "Component colors/Utility/Success/utility-success-400": "#47cd89",
        "Component colors/Utility/Success/utility-success-300": "#75e0a7",
        "Component colors/Utility/Orange/utility-orange-600": "#e04f16",
        "Component colors/Utility/Orange/utility-orange-700": "#b93815",
        "Component colors/Utility/Orange/utility-orange-500": "#ef6820",
        "Component colors/Utility/Orange/utility-orange-200": "#f9dbaf",
        "Component colors/Utility/Orange/utility-orange-50": "#fef6ee",
        "Component colors/Utility/Orange/utility-orange-100": "#fdead7",
        "Component colors/Utility/Orange/utility-orange-400": "#f38744",
        "Component colors/Utility/Orange/utility-orange-300": "#f7b27a",
        "Component colors/Utility/Blue dark/utility-blue-dark-600": "#155eef",
        "Component colors/Utility/Blue dark/utility-blue-dark-700": "#004eeb",
        "Component colors/Utility/Blue dark/utility-blue-dark-500": "#2970ff",
        "Component colors/Utility/Blue dark/utility-blue-dark-200": "#b2ccff",
        "Component colors/Utility/Blue dark/utility-blue-dark-50": "#eff4ff",
        "Component colors/Utility/Blue dark/utility-blue-dark-100": "#d1e0ff",
        "Component colors/Utility/Blue dark/utility-blue-dark-400": "#528bff",
        "Component colors/Utility/Blue dark/utility-blue-dark-300": "#84adff",
        "Component colors/Utility/Indigo/utility-indigo-600": "#444ce7",
        "Component colors/Utility/Indigo/utility-indigo-700": "#3538cd",
        "Component colors/Utility/Indigo/utility-indigo-500": "#6172f3",
        "Component colors/Utility/Indigo/utility-indigo-200": "#c7d7fe",
        "Component colors/Utility/Indigo/utility-indigo-50": "#eef4ff",
        "Component colors/Utility/Indigo/utility-indigo-100": "#e0eaff",
        "Component colors/Utility/Indigo/utility-indigo-400": "#8098f9",
        "Component colors/Utility/Indigo/utility-indigo-300": "#a4bcfd",
        "Component colors/Utility/Fuchsia/utility-fuchsia-600": "#ba24d5",
        "Component colors/Utility/Fuchsia/utility-fuchsia-700": "#9f1ab1",
        "Component colors/Utility/Fuchsia/utility-fuchsia-500": "#d444f1",
        "Component colors/Utility/Fuchsia/utility-fuchsia-200": "#f6d0fe",
        "Component colors/Utility/Fuchsia/utility-fuchsia-50": "#fdf4ff",
        "Component colors/Utility/Fuchsia/utility-fuchsia-100": "#fbe8ff",
        "Component colors/Utility/Fuchsia/utility-fuchsia-400": "#e478fa",
        "Component colors/Utility/Fuchsia/utility-fuchsia-300": "#eeaafd",
        "Component colors/Utility/Pink/utility-pink-600": "#dd2590",
        "Component colors/Utility/Pink/utility-pink-700": "#c11574",
        "Component colors/Utility/Pink/utility-pink-500": "#ee46bc",
        "Component colors/Utility/Pink/utility-pink-200": "#fcceee",
        "Component colors/Utility/Pink/utility-pink-50": "#fdf2fa",
        "Component colors/Utility/Pink/utility-pink-100": "#fce7f6",
        "Component colors/Utility/Pink/utility-pink-400": "#f670c7",
        "Component colors/Utility/Pink/utility-pink-300": "#faa7e0",
        "Component colors/Utility/Purple/utility-purple-600": "#6938ef",
        "Component colors/Utility/Purple/utility-purple-700": "#5925dc",
        "Component colors/Utility/Purple/utility-purple-500": "#7a5af8",
        "Component colors/Utility/Purple/utility-purple-200": "#d9d6fe",
        "Component colors/Utility/Purple/utility-purple-50": "#f4f3ff",
        "Component colors/Utility/Purple/utility-purple-100": "#ebe9fe",
        "Component colors/Utility/Purple/utility-purple-400": "#9b8afb",
        "Component colors/Utility/Purple/utility-purple-300": "#bdb4fe",
        "Component colors/Utility/Orange dark/utility-orange-dark-600":
          "#e62e05",
        "Component colors/Utility/Orange dark/utility-orange-dark-700":
          "#bc1b06",
        "Component colors/Utility/Orange dark/utility-orange-dark-500":
          "#ff4405",
        "Component colors/Utility/Orange dark/utility-orange-dark-200":
          "#ffd6ae",
        "Component colors/Utility/Orange dark/utility-orange-dark-50":
          "#fff4ed",
        "Component colors/Utility/Orange dark/utility-orange-dark-100":
          "#ffe6d5",
        "Component colors/Utility/Orange dark/utility-orange-dark-400":
          "#ff692e",
        "Component colors/Utility/Orange dark/utility-orange-dark-300":
          "#ff9c66",
        "Component colors/Utility/Blue light/utility-blue-light-600": "#0086c9",
        "Component colors/Utility/Blue light/utility-blue-light-700": "#026aa2",
        "Component colors/Utility/Blue light/utility-blue-light-500": "#0ba5ec",
        "Component colors/Utility/Blue light/utility-blue-light-200": "#b9e6fe",
        "Component colors/Utility/Blue light/utility-blue-light-50": "#f0f9ff",
        "Component colors/Utility/Blue light/utility-blue-light-100": "#e0f2fe",
        "Component colors/Utility/Blue light/utility-blue-light-400": "#36bffa",
        "Component colors/Utility/Blue light/utility-blue-light-300": "#7cd4fd",
        "Component colors/Utility/Gray blue/utility-gray-blue-600": "#3e4784",
        "Component colors/Utility/Gray blue/utility-gray-blue-700": "#363f72",
        "Component colors/Utility/Gray blue/utility-gray-blue-500": "#4e5ba6",
        "Component colors/Utility/Gray blue/utility-gray-blue-200": "#d5d9eb",
        "Component colors/Utility/Gray blue/utility-gray-blue-50": "#f8f9fc",
        "Component colors/Utility/Gray blue/utility-gray-blue-100": "#eaecf5",
        "Component colors/Utility/Gray blue/utility-gray-blue-400": "#717bbc",
        "Component colors/Utility/Gray blue/utility-gray-blue-300": "#b3b8db",
        "Component colors/Components/Tooltips/tooltip-supporting-text":
          "#d6d6d6",
        "Component colors/Components/Buttons/Brand/button-brand-bg": "#27284a",
        "Component colors/Components/Buttons/Brand/button-brand-bg_hover":
          "#4d4f95",
        "Component colors/Components/Buttons/Brand/button-brand-fg": "#000000",
        "Component colors/Components/Buttons/Brand/button-brand-fg_hover":
          "#ffffff",
        "Component colors/Components/Buttons/Secondary/button-secondary-bg":
          "#ffffff",
        "Component colors/Components/Buttons/Secondary/button-secondary-bg_hover":
          "#f7f7f7",
        "Component colors/Components/Buttons/Secondary/button-secondary-fg":
          "#424242",
        "Component colors/Components/Buttons/Secondary/button-secondary-fg_hover":
          "#292929",
        "Component colors/Components/Buttons/Secondary/button-secondary-border":
          "#d6d6d6",
        "Component colors/Components/Buttons/Secondary/button-secondary-border_hover":
          "#d6d6d6",
        "Component colors/Components/Buttons/Secondary color/button-secondary-color-bg":
          "#ffffff",
        "Component colors/Components/Buttons/Secondary color/button-secondary-color-bg_hover":
          "#e6e6fe",
        "Component colors/Components/Buttons/Secondary color/button-secondary-color-border_hover":
          "#a7a9fa",
        "Component colors/Components/Buttons/Secondary color/button-secondary-color-border":
          "#a7a9fa",
        "Component colors/Components/Buttons/Secondary color/button-secondary-color-fg":
          "#4d4f95",
        "Component colors/Components/Buttons/Secondary color/button-secondary-color-fg_hover":
          "#41427c",
        "Component colors/Components/Buttons/Primary error/button-primary-error-fg":
          "#ffffff",
        "Component colors/Components/Buttons/Primary error/button-primary-error-fg_hover":
          "#ffffff",
        "Component colors/Components/Buttons/Primary error/button-primary-error-bg":
          "#890c21",
        "Component colors/Components/Buttons/Primary error/button-primary-error-bg_hover":
          "#6d091a",
        "Component colors/Components/Buttons/Secondary error/button-secondary-error-fg":
          "#6d091a",
        "Component colors/Components/Buttons/Secondary error/button-secondary-error-fg_hover":
          "#500713",
        "Component colors/Components/Buttons/Secondary error/button-secondary-error-bg":
          "#ffffff",
        "Component colors/Components/Buttons/Secondary error/button-secondary-error-bg_hover":
          "#f9e7ea",
        "Component colors/Components/Buttons/Secondary error/button-secondary-error-border":
          "#d14159",
        "Component colors/Components/Buttons/Secondary error/button-secondary-error-border_hover":
          "#d14159",
        "Component colors/Components/Buttons/Tertiary/button-tertiary-fg":
          "#525252",
        "Component colors/Components/Buttons/Tertiary/button-tertiary-fg_hover":
          "#424242",
        "Component colors/Components/Buttons/Tertiary/button-tertiary-bg_hover":
          "#f7f7f7",
        "Component colors/Components/Buttons/Tertiary color/button-tertiary-color-fg":
          "#4d4f95",
        "Component colors/Components/Buttons/Tertiary color/button-tertiary-color-fg_hover":
          "#41427c",
        "Component colors/Components/Buttons/Tertiary color/button-tertiary-color-bg_hover":
          "#e6e6fe",
        "Component colors/Components/Buttons/Tertiary error/button-tertiary-error-fg":
          "#6d091a",
        "Component colors/Components/Buttons/Tertiary error/button-tertiary-error-fg_hover":
          "#500713",
        "Component colors/Components/Buttons/Tertiary error/button-tertiary-error-bg_hover":
          "#f9e7ea",
        "Component colors/Components/Toggles/toggle-button-fg_disabled":
          "#f7f7f7",
        "Colors/Border/border-warning": "#f79009",
        "Colors/Border/border-warning_subtle": "#fec84b",
        "Colors/Text/text-buy-primary": "#676ac6",
        "Colors/Text/text-sell-primary": "#e31b54",
        "Colors/Background/bg-sell-primary": "#e31b54",
        "Colors/Background/bg-sell-primary_hover": "#c01048",
        "Colors/Background/bg-buy-primary": "#8e90f9",
        "Colors/Background/bg-buy-primary_hover": "#41427c",
        "Colors/Border/border-success": "#17b26a",
        "Component colors/Utility/Data/utility-data-positive-50": "#cce4cc",
        "Component colors/Utility/Data/utility-data-positive-100": "#7fbb7f",
        "Component colors/Utility/Data/utility-data-positive-200": "#339233",
        "Component colors/Utility/Data/utility-data-positive-300": "#007700",
        "Component colors/Utility/Data/utility-data-positive-400": "#005a00",
        "Component colors/Utility/Data/utility-data-positive-500": "#004b00",
        "Component colors/Utility/Data/utility-data-positive-600": "#003b00",
        "Component colors/Utility/Data/utility-data-positive-700": "#002c00",
        "Component colors/Utility/Red/utility-red-700": "#6d091a",
        "Component colors/Utility/Red/utility-red-600": "#890c21",
        "Component colors/Utility/Red/utility-red-500": "#a50e28",
        "Component colors/Utility/Red/utility-red-400": "#c41230",
        "Component colors/Utility/Red/utility-red-300": "#d14159",
        "Component colors/Utility/Red/utility-red-200": "#e28897",
        "Component colors/Utility/Red/utility-red-100": "#f3d0d6",
        "Component colors/Utility/Red/utility-red-50": "#f9e7ea",
        "Component colors/Components/Buttons/Primary/button-primary-bg":
          "#ffffff",
        "Component colors/Components/Buttons/Primary/button-primary-bg_hover":
          "#f7f7f7",
        "Component colors/Components/Buttons/Primary/button-primary-fg":
          "#424242",
        "Component colors/Components/Buttons/Primary/button-primary-fg_hover":
          "#292929",
        "Component colors/Components/Buttons/Primary/button-primary-border":
          "#d6d6d6",
        "Component colors/Components/Buttons/Primary/button-primary-border_hover":
          "#d6d6d6",
        "Component colors/Components/Buttons/Primary/button-primary-fg_subtle":
          "#424242",
        "Colors/Border/border-sell": "#f63d68",
        "Colors/Border/border-buy": "#8184f8",
        "Colors/Text/text-black": "#000000",
        "Colors/Text/text-primary_alt": "#fcfcfc",
        "Colors/Border/border-hover": "#e5e5e5",
      },
    },
  },
}

type UISK_Collection7 = UISK_Collection<
  "4. Density",
  "Comfortable" | "Compact" | "Spacious",
  UISK_Variables7
>
type UISK_Variables7 = {
  "density-sm": number
  "density-md": number
  "density-lg": number
  "density-xl": number
  "density-xs": number
}

const collection7: UISK_Collection7 = {
  "4. Density": {
    defaultModeName: "Comfortable",
    modeNames: ["Comfortable", "Compact", "Spacious"],
    modes: {
      Comfortable: {
        "density-sm": 24,
        "density-md": 28,
        "density-lg": 32,
        "density-xl": 44,
        "density-xs": 20,
      },
      Compact: {
        "density-sm": 20,
        "density-md": 24,
        "density-lg": 30,
        "density-xl": 34,
        "density-xs": 16,
      },
      Spacious: {
        "density-sm": 30,
        "density-md": 34,
        "density-lg": 40,
        "density-xl": 48,
        "density-xs": 26,
      },
    },
  },
}
const collections: UISK_Collections = {
  ...collection0,
  ...collection1,
  ...collection2,
  ...collection3,
  ...collection4,
  ...collection5,
  ...collection6,
  ...collection7,
}

type UISK_TextStyles = {
  "Display 2xl/Regular": ResolvedTextStyleDefinition
  "Display 2xl/Medium": ResolvedTextStyleDefinition
  "Display 2xl/Semibold": ResolvedTextStyleDefinition
  "Display 2xl/Bold": ResolvedTextStyleDefinition
  "Display xl/Regular": ResolvedTextStyleDefinition
  "Display xl/Medium": ResolvedTextStyleDefinition
  "Display xl/Semibold": ResolvedTextStyleDefinition
  "Display xl/Bold": ResolvedTextStyleDefinition
  "Display lg/Regular": ResolvedTextStyleDefinition
  "Display lg/Medium": ResolvedTextStyleDefinition
  "Display lg/Semibold": ResolvedTextStyleDefinition
  "Display lg/Bold": ResolvedTextStyleDefinition
  "Display md/Regular": ResolvedTextStyleDefinition
  "Display md/Medium": ResolvedTextStyleDefinition
  "Display md/Semibold": ResolvedTextStyleDefinition
  "Display md/Bold": ResolvedTextStyleDefinition
  "Display sm/Regular": ResolvedTextStyleDefinition
  "Display sm/Medium": ResolvedTextStyleDefinition
  "Display sm/Semibold": ResolvedTextStyleDefinition
  "Display sm/Bold": ResolvedTextStyleDefinition
  "Display xs/Regular": ResolvedTextStyleDefinition
  "Display xs/Medium": ResolvedTextStyleDefinition
  "Display xs/Semibold": ResolvedTextStyleDefinition
  "Display xs/Bold": ResolvedTextStyleDefinition
  "Text xl/Regular": ResolvedTextStyleDefinition
  "Text xl/Medium": ResolvedTextStyleDefinition
  "Text xl/Semibold": ResolvedTextStyleDefinition
  "Text xl/Bold": ResolvedTextStyleDefinition
  "Text xl/Regular italic": ResolvedTextStyleDefinition
  "Text xl/Medium italic": ResolvedTextStyleDefinition
  "Text xl/Semibold italic": ResolvedTextStyleDefinition
  "Text xl/Bold italic": ResolvedTextStyleDefinition
  "Text xl/Regular underlined": ResolvedTextStyleDefinition
  "Text lg/Regular": ResolvedTextStyleDefinition
  "Text lg/Medium": ResolvedTextStyleDefinition
  "Text lg/Semibold": ResolvedTextStyleDefinition
  "Text lg/Bold": ResolvedTextStyleDefinition
  "Text lg/Regular italic": ResolvedTextStyleDefinition
  "Text lg/Medium italic": ResolvedTextStyleDefinition
  "Text lg/Semibold italic": ResolvedTextStyleDefinition
  "Text lg/Bold italic": ResolvedTextStyleDefinition
  "Text lg/Regular underlined": ResolvedTextStyleDefinition
  "Text md/Regular": ResolvedTextStyleDefinition
  "Text md/Medium": ResolvedTextStyleDefinition
  "Text md/Semibold": ResolvedTextStyleDefinition
  "Text md/Bold": ResolvedTextStyleDefinition
  "Text md/Regular italic": ResolvedTextStyleDefinition
  "Text md/Medium italic": ResolvedTextStyleDefinition
  "Text md/Semibold italic": ResolvedTextStyleDefinition
  "Text md/Bold italic": ResolvedTextStyleDefinition
  "Text md/Regular underlined": ResolvedTextStyleDefinition
  "Text sm/Regular": ResolvedTextStyleDefinition
  "Text sm/Medium": ResolvedTextStyleDefinition
  "Text sm/Semibold": ResolvedTextStyleDefinition
  "Text sm/Bold": ResolvedTextStyleDefinition
  "Text sm/Regular italic": ResolvedTextStyleDefinition
  "Text sm/Regular underlined": ResolvedTextStyleDefinition
  "Text sm/Medium italic": ResolvedTextStyleDefinition
  "Text sm/Semibold italic": ResolvedTextStyleDefinition
  "Text sm/Bold italic": ResolvedTextStyleDefinition
  "Text xs/Regular": ResolvedTextStyleDefinition
  "Text xs/Medium": ResolvedTextStyleDefinition
  "Text xs/Semibold": ResolvedTextStyleDefinition
  "Text xs/Bold": ResolvedTextStyleDefinition
  "Text xs/Regular italic": ResolvedTextStyleDefinition
  "Text xs/Regular underlined": ResolvedTextStyleDefinition
  "Text xs/Medium italic": ResolvedTextStyleDefinition
  "Text xs/Semibold italic": ResolvedTextStyleDefinition
  "Text xs/Bold italic": ResolvedTextStyleDefinition
  "Text xxs/Regular": ResolvedTextStyleDefinition
  "Text xxs/Medium": ResolvedTextStyleDefinition
  "Text xxs/Semibold": ResolvedTextStyleDefinition
  "Text xxs/Bold": ResolvedTextStyleDefinition
  "Text xxs/Regular italic": ResolvedTextStyleDefinition
  "Text xxs/Regular underlined": ResolvedTextStyleDefinition
  "Text xxs/Medium italic": ResolvedTextStyleDefinition
  "Text xxs/Semibold italic": ResolvedTextStyleDefinition
  "Text xxs/Bold italic": ResolvedTextStyleDefinition
}
type ThemeTextStyles = {
  "Display 2xl/Regular": ThemeTextStyle
  "Display 2xl/Medium": ThemeTextStyle
  "Display 2xl/Semibold": ThemeTextStyle
  "Display 2xl/Bold": ThemeTextStyle
  "Display xl/Regular": ThemeTextStyle
  "Display xl/Medium": ThemeTextStyle
  "Display xl/Semibold": ThemeTextStyle
  "Display xl/Bold": ThemeTextStyle
  "Display lg/Regular": ThemeTextStyle
  "Display lg/Medium": ThemeTextStyle
  "Display lg/Semibold": ThemeTextStyle
  "Display lg/Bold": ThemeTextStyle
  "Display md/Regular": ThemeTextStyle
  "Display md/Medium": ThemeTextStyle
  "Display md/Semibold": ThemeTextStyle
  "Display md/Bold": ThemeTextStyle
  "Display sm/Regular": ThemeTextStyle
  "Display sm/Medium": ThemeTextStyle
  "Display sm/Semibold": ThemeTextStyle
  "Display sm/Bold": ThemeTextStyle
  "Display xs/Regular": ThemeTextStyle
  "Display xs/Medium": ThemeTextStyle
  "Display xs/Semibold": ThemeTextStyle
  "Display xs/Bold": ThemeTextStyle
  "Text xl/Regular": ThemeTextStyle
  "Text xl/Medium": ThemeTextStyle
  "Text xl/Semibold": ThemeTextStyle
  "Text xl/Bold": ThemeTextStyle
  "Text xl/Regular italic": ThemeTextStyle
  "Text xl/Medium italic": ThemeTextStyle
  "Text xl/Semibold italic": ThemeTextStyle
  "Text xl/Bold italic": ThemeTextStyle
  "Text xl/Regular underlined": ThemeTextStyle
  "Text lg/Regular": ThemeTextStyle
  "Text lg/Medium": ThemeTextStyle
  "Text lg/Semibold": ThemeTextStyle
  "Text lg/Bold": ThemeTextStyle
  "Text lg/Regular italic": ThemeTextStyle
  "Text lg/Medium italic": ThemeTextStyle
  "Text lg/Semibold italic": ThemeTextStyle
  "Text lg/Bold italic": ThemeTextStyle
  "Text lg/Regular underlined": ThemeTextStyle
  "Text md/Regular": ThemeTextStyle
  "Text md/Medium": ThemeTextStyle
  "Text md/Semibold": ThemeTextStyle
  "Text md/Bold": ThemeTextStyle
  "Text md/Regular italic": ThemeTextStyle
  "Text md/Medium italic": ThemeTextStyle
  "Text md/Semibold italic": ThemeTextStyle
  "Text md/Bold italic": ThemeTextStyle
  "Text md/Regular underlined": ThemeTextStyle
  "Text sm/Regular": ThemeTextStyle
  "Text sm/Medium": ThemeTextStyle
  "Text sm/Semibold": ThemeTextStyle
  "Text sm/Bold": ThemeTextStyle
  "Text sm/Regular italic": ThemeTextStyle
  "Text sm/Regular underlined": ThemeTextStyle
  "Text sm/Medium italic": ThemeTextStyle
  "Text sm/Semibold italic": ThemeTextStyle
  "Text sm/Bold italic": ThemeTextStyle
  "Text xs/Regular": ThemeTextStyle
  "Text xs/Medium": ThemeTextStyle
  "Text xs/Semibold": ThemeTextStyle
  "Text xs/Bold": ThemeTextStyle
  "Text xs/Regular italic": ThemeTextStyle
  "Text xs/Regular underlined": ThemeTextStyle
  "Text xs/Medium italic": ThemeTextStyle
  "Text xs/Semibold italic": ThemeTextStyle
  "Text xs/Bold italic": ThemeTextStyle
  "Text xxs/Regular": ThemeTextStyle
  "Text xxs/Medium": ThemeTextStyle
  "Text xxs/Semibold": ThemeTextStyle
  "Text xxs/Bold": ThemeTextStyle
  "Text xxs/Regular italic": ThemeTextStyle
  "Text xxs/Regular underlined": ThemeTextStyle
  "Text xxs/Medium italic": ThemeTextStyle
  "Text xxs/Semibold italic": ThemeTextStyle
  "Text xxs/Bold italic": ThemeTextStyle
}

const internalTextStyles: ThemeTextStyles = {
  "Display 2xl/Regular": {
    name: "Display 2xl/Regular",
    definition: {
      fontSize: 38,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Regular" },
      letterSpacing: { value: -2, unit: "PERCENT" },
      lineHeight: { value: 90, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 38,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-2xl",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-2xl",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-2xl",
      },
    },
  },
  "Display 2xl/Medium": {
    name: "Display 2xl/Medium",
    definition: {
      fontSize: 38,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Medium" },
      letterSpacing: { value: -2, unit: "PERCENT" },
      lineHeight: { value: 90, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 38,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-2xl",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/medium",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-2xl",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-2xl",
      },
    },
  },
  "Display 2xl/Semibold": {
    name: "Display 2xl/Semibold",
    definition: {
      fontSize: 38,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "SemiBold" },
      letterSpacing: { value: -2, unit: "PERCENT" },
      lineHeight: { value: 90, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 38,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-2xl",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/semibold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-2xl",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-2xl",
      },
    },
  },
  "Display 2xl/Bold": {
    name: "Display 2xl/Bold",
    definition: {
      fontSize: 38,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Bold" },
      letterSpacing: { value: -2, unit: "PERCENT" },
      lineHeight: { value: 90, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 38,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-2xl",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/bold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-2xl",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-2xl",
      },
    },
  },
  "Display xl/Regular": {
    name: "Display xl/Regular",
    definition: {
      fontSize: 34,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Regular" },
      letterSpacing: { value: -2, unit: "PERCENT" },
      lineHeight: { value: 72, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 34,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-xl",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-xl",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-xl",
      },
    },
  },
  "Display xl/Medium": {
    name: "Display xl/Medium",
    definition: {
      fontSize: 34,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Medium" },
      letterSpacing: { value: -2, unit: "PERCENT" },
      lineHeight: { value: 72, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 34,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-xl",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/medium",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-xl",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-xl",
      },
    },
  },
  "Display xl/Semibold": {
    name: "Display xl/Semibold",
    definition: {
      fontSize: 34,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "SemiBold" },
      letterSpacing: { value: -2, unit: "PERCENT" },
      lineHeight: { value: 72, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 34,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-xl",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/semibold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-xl",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-xl",
      },
    },
  },
  "Display xl/Bold": {
    name: "Display xl/Bold",
    definition: {
      fontSize: 34,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Bold" },
      letterSpacing: { value: -2, unit: "PERCENT" },
      lineHeight: { value: 72, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 34,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-xl",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/bold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-xl",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-xl",
      },
    },
  },
  "Display lg/Regular": {
    name: "Display lg/Regular",
    definition: {
      fontSize: 30,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Regular" },
      letterSpacing: { value: -2, unit: "PERCENT" },
      lineHeight: { value: 60, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 30,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-lg",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-lg",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-lg",
      },
    },
  },
  "Display lg/Medium": {
    name: "Display lg/Medium",
    definition: {
      fontSize: 30,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Medium" },
      letterSpacing: { value: -2, unit: "PERCENT" },
      lineHeight: { value: 60, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 30,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-lg",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/medium",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-lg",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-lg",
      },
    },
  },
  "Display lg/Semibold": {
    name: "Display lg/Semibold",
    definition: {
      fontSize: 30,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "SemiBold" },
      letterSpacing: { value: -2, unit: "PERCENT" },
      lineHeight: { value: 60, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 30,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-lg",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/semibold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-lg",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-lg",
      },
    },
  },
  "Display lg/Bold": {
    name: "Display lg/Bold",
    definition: {
      fontSize: 30,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Bold" },
      letterSpacing: { value: -2, unit: "PERCENT" },
      lineHeight: { value: 60, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 30,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-lg",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/bold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-lg",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-lg",
      },
    },
  },
  "Display md/Regular": {
    name: "Display md/Regular",
    definition: {
      fontSize: 24,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Regular" },
      letterSpacing: { value: -2, unit: "PERCENT" },
      lineHeight: { value: 44, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 24,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-md",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-md",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-md",
      },
    },
  },
  "Display md/Medium": {
    name: "Display md/Medium",
    definition: {
      fontSize: 24,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Medium" },
      letterSpacing: { value: -2, unit: "PERCENT" },
      lineHeight: { value: 44, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 24,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-md",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/medium",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-md",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-md",
      },
    },
  },
  "Display md/Semibold": {
    name: "Display md/Semibold",
    definition: {
      fontSize: 24,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "SemiBold" },
      letterSpacing: { value: -2, unit: "PERCENT" },
      lineHeight: { value: 44, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 24,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-md",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/semibold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-md",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-md",
      },
    },
  },
  "Display md/Bold": {
    name: "Display md/Bold",
    definition: {
      fontSize: 24,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Bold" },
      letterSpacing: { value: -2, unit: "PERCENT" },
      lineHeight: { value: 44, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 24,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-md",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/bold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-md",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-md",
      },
    },
  },
  "Display sm/Regular": {
    name: "Display sm/Regular",
    definition: {
      fontSize: 20,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Regular" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 38, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 20,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-sm",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-sm",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-sm",
      },
    },
  },
  "Display sm/Medium": {
    name: "Display sm/Medium",
    definition: {
      fontSize: 20,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Medium" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 38, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 20,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-sm",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/medium",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-sm",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-sm",
      },
    },
  },
  "Display sm/Semibold": {
    name: "Display sm/Semibold",
    definition: {
      fontSize: 20,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "SemiBold" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 38, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 20,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-sm",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/semibold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-sm",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-sm",
      },
    },
  },
  "Display sm/Bold": {
    name: "Display sm/Bold",
    definition: {
      fontSize: 20,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Bold" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 38, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 20,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-sm",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/bold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-sm",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-sm",
      },
    },
  },
  "Display xs/Regular": {
    name: "Display xs/Regular",
    definition: {
      fontSize: 18,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Regular" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 32, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 18,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-xs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-xs",
      },
    },
  },
  "Display xs/Medium": {
    name: "Display xs/Medium",
    definition: {
      fontSize: 18,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Medium" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 32, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 18,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-xs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/medium",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-xs",
      },
    },
  },
  "Display xs/Semibold": {
    name: "Display xs/Semibold",
    definition: {
      fontSize: 18,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "SemiBold" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 32, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 18,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-xs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/semibold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-xs",
      },
    },
  },
  "Display xs/Bold": {
    name: "Display xs/Bold",
    definition: {
      fontSize: 18,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Bold" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 32, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 18,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/display-xs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/bold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-display",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/display-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/display-xs",
      },
    },
  },
  "Text xl/Regular": {
    name: "Text xl/Regular",
    definition: {
      fontSize: 16,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Regular" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 30, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 16,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xl",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xl",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-xl",
      },
    },
  },
  "Text xl/Medium": {
    name: "Text xl/Medium",
    definition: {
      fontSize: 16,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Medium" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 30, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 16,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xl",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/medium",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xl",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-xl",
      },
    },
  },
  "Text xl/Semibold": {
    name: "Text xl/Semibold",
    definition: {
      fontSize: 16,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "SemiBold" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 30, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 16,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xl",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/semibold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xl",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-xl",
      },
    },
  },
  "Text xl/Bold": {
    name: "Text xl/Bold",
    definition: {
      fontSize: 16,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Bold" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 30, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 16,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xl",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/bold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xl",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-xl",
      },
    },
  },
  "Text xl/Regular italic": {
    name: "Text xl/Regular italic",
    definition: {
      fontSize: 16,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 30, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 16,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xl",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xl",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-xl",
      },
    },
  },
  "Text xl/Medium italic": {
    name: "Text xl/Medium italic",
    definition: {
      fontSize: 16,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Medium Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 30, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 16,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xl",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/medium-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xl",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-xl",
      },
    },
  },
  "Text xl/Semibold italic": {
    name: "Text xl/Semibold italic",
    definition: {
      fontSize: 16,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "SemiBold Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 30, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 16,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xl",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/semibold-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xl",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-xl",
      },
    },
  },
  "Text xl/Bold italic": {
    name: "Text xl/Bold italic",
    definition: {
      fontSize: 16,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Bold Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 30, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 16,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xl",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/bold-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xl",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-xl",
      },
    },
  },
  "Text xl/Regular underlined": {
    name: "Text xl/Regular underlined",
    definition: {
      fontSize: 16,
      textDecoration: "UNDERLINE",
      fontName: { family: "Work Sans", style: "Regular" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 30, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 16,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xl",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xl",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-xl",
      },
    },
  },
  "Text lg/Regular": {
    name: "Text lg/Regular",
    definition: {
      fontSize: 14,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Regular" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 28, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 14,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-lg",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-lg",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-lg",
      },
    },
  },
  "Text lg/Medium": {
    name: "Text lg/Medium",
    definition: {
      fontSize: 14,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Medium" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 28, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 14,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-lg",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/medium",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-lg",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-lg",
      },
    },
  },
  "Text lg/Semibold": {
    name: "Text lg/Semibold",
    definition: {
      fontSize: 14,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "SemiBold" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 28, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 14,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-lg",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/semibold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-lg",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-lg",
      },
    },
  },
  "Text lg/Bold": {
    name: "Text lg/Bold",
    definition: {
      fontSize: 14,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Bold" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 28, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 14,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-lg",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/bold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-lg",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-lg",
      },
    },
  },
  "Text lg/Regular italic": {
    name: "Text lg/Regular italic",
    definition: {
      fontSize: 14,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 28, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 14,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-lg",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-lg",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-lg",
      },
    },
  },
  "Text lg/Medium italic": {
    name: "Text lg/Medium italic",
    definition: {
      fontSize: 14,
      textDecoration: "NONE",
      fontName: { family: "Roboto", style: "Medium Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 28, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 14,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-lg",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/medium-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-lg",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-lg",
      },
    },
  },
  "Text lg/Semibold italic": {
    name: "Text lg/Semibold italic",
    definition: {
      fontSize: 14,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "SemiBold Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 28, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 14,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-lg",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/semibold-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-lg",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-lg",
      },
    },
  },
  "Text lg/Bold italic": {
    name: "Text lg/Bold italic",
    definition: {
      fontSize: 14,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Bold Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 28, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 14,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-lg",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/bold-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-lg",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-lg",
      },
    },
  },
  "Text lg/Regular underlined": {
    name: "Text lg/Regular underlined",
    definition: {
      fontSize: 14,
      textDecoration: "UNDERLINE",
      fontName: { family: "Work Sans", style: "Regular" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 28, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 14,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-lg",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-lg",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-lg",
      },
    },
  },
  "Text md/Regular": {
    name: "Text md/Regular",
    definition: {
      fontSize: 12,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Regular" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 24, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 12,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-md",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-md",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-md",
      },
    },
  },
  "Text md/Medium": {
    name: "Text md/Medium",
    definition: {
      fontSize: 12,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Medium" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 24, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 12,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-md",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/medium",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-md",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-md",
      },
    },
  },
  "Text md/Semibold": {
    name: "Text md/Semibold",
    definition: {
      fontSize: 12,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "SemiBold" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 24, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 12,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-md",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/semibold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-md",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-md",
      },
    },
  },
  "Text md/Bold": {
    name: "Text md/Bold",
    definition: {
      fontSize: 12,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Bold" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 24, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 12,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-md",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/bold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-md",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-md",
      },
    },
  },
  "Text md/Regular italic": {
    name: "Text md/Regular italic",
    definition: {
      fontSize: 12,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 24, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 12,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-md",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-md",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-md",
      },
    },
  },
  "Text md/Medium italic": {
    name: "Text md/Medium italic",
    definition: {
      fontSize: 12,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Medium Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 24, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 12,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-md",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/medium-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-md",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-md",
      },
    },
  },
  "Text md/Semibold italic": {
    name: "Text md/Semibold italic",
    definition: {
      fontSize: 12,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "SemiBold Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 24, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 12,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-md",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/semibold-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-md",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-md",
      },
    },
  },
  "Text md/Bold italic": {
    name: "Text md/Bold italic",
    definition: {
      fontSize: 12,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Bold Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 24, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 12,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-md",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/bold-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-md",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-md",
      },
    },
  },
  "Text md/Regular underlined": {
    name: "Text md/Regular underlined",
    definition: {
      fontSize: 12,
      textDecoration: "UNDERLINE",
      fontName: { family: "Work Sans", style: "Regular" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 24, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 12,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-md",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-md",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-md",
      },
    },
  },
  "Text sm/Regular": {
    name: "Text sm/Regular",
    definition: {
      fontSize: 11,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Regular" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 20, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 11,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-sm",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-sm",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-sm",
      },
    },
  },
  "Text sm/Medium": {
    name: "Text sm/Medium",
    definition: {
      fontSize: 11,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Medium" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 20, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 11,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-sm",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/medium",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-sm",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-sm",
      },
    },
  },
  "Text sm/Semibold": {
    name: "Text sm/Semibold",
    definition: {
      fontSize: 11,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "SemiBold" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 20, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 11,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-sm",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/semibold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-sm",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-sm",
      },
    },
  },
  "Text sm/Bold": {
    name: "Text sm/Bold",
    definition: {
      fontSize: 11,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Bold" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 20, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 11,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-sm",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/bold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-sm",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-sm",
      },
    },
  },
  "Text sm/Regular italic": {
    name: "Text sm/Regular italic",
    definition: {
      fontSize: 11,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 20, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 11,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-sm",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-sm",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-sm",
      },
    },
  },
  "Text sm/Regular underlined": {
    name: "Text sm/Regular underlined",
    definition: {
      fontSize: 11,
      textDecoration: "UNDERLINE",
      fontName: { family: "Work Sans", style: "Regular" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 20, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 11,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-sm",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-sm",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-sm",
      },
    },
  },
  "Text sm/Medium italic": {
    name: "Text sm/Medium italic",
    definition: {
      fontSize: 11,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Medium Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 20, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 11,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-sm",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/medium-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-sm",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-sm",
      },
    },
  },
  "Text sm/Semibold italic": {
    name: "Text sm/Semibold italic",
    definition: {
      fontSize: 11,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "SemiBold Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 20, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 11,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-sm",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/semibold-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-sm",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-sm",
      },
    },
  },
  "Text sm/Bold italic": {
    name: "Text sm/Bold italic",
    definition: {
      fontSize: 11,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Bold Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 20, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 11,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-sm",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/bold-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-sm",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-sm",
      },
    },
  },
  "Text xs/Regular": {
    name: "Text xs/Regular",
    definition: {
      fontSize: 10,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Regular" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 14, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 10,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-3xs",
      },
    },
  },
  "Text xs/Medium": {
    name: "Text xs/Medium",
    definition: {
      fontSize: 10,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Medium" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 14, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 10,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/medium",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-3xs",
      },
    },
  },
  "Text xs/Semibold": {
    name: "Text xs/Semibold",
    definition: {
      fontSize: 10,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "SemiBold" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 14, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 10,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/semibold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-3xs",
      },
    },
  },
  "Text xs/Bold": {
    name: "Text xs/Bold",
    definition: {
      fontSize: 10,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Bold" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 14, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 10,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/bold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-3xs",
      },
    },
  },
  "Text xs/Regular italic": {
    name: "Text xs/Regular italic",
    definition: {
      fontSize: 10,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 14, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 10,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-3xs",
      },
    },
  },
  "Text xs/Regular underlined": {
    name: "Text xs/Regular underlined",
    definition: {
      fontSize: 10,
      textDecoration: "UNDERLINE",
      fontName: { family: "Work Sans", style: "Regular" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 14, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 10,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-3xs",
      },
    },
  },
  "Text xs/Medium italic": {
    name: "Text xs/Medium italic",
    definition: {
      fontSize: 10,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Medium Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 14, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 10,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/medium-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-3xs",
      },
    },
  },
  "Text xs/Semibold italic": {
    name: "Text xs/Semibold italic",
    definition: {
      fontSize: 10,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "SemiBold Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 14, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 10,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/semibold-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-3xs",
      },
    },
  },
  "Text xs/Bold italic": {
    name: "Text xs/Bold italic",
    definition: {
      fontSize: 10,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Bold Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 14, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 10,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/bold-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-3xs",
      },
    },
  },
  "Text xxs/Regular": {
    name: "Text xxs/Regular",
    definition: {
      fontSize: 9,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Regular" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 12, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 10,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xxs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-4xs",
      },
    },
  },
  "Text xxs/Medium": {
    name: "Text xxs/Medium",
    definition: {
      fontSize: 9,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Medium" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 12, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 10,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xxs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/medium",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-4xs",
      },
    },
  },
  "Text xxs/Semibold": {
    name: "Text xxs/Semibold",
    definition: {
      fontSize: 9,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "SemiBold" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 12, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 10,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xxs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/semibold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-4xs",
      },
    },
  },
  "Text xxs/Bold": {
    name: "Text xxs/Bold",
    definition: {
      fontSize: 9,
      textDecoration: "NONE",
      fontName: { family: "Roboto", style: "Bold" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 12, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 10,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xxs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/bold",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-4xs",
      },
    },
  },
  "Text xxs/Regular italic": {
    name: "Text xxs/Regular italic",
    definition: {
      fontSize: 9,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 12, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 10,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xxs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-4xs",
      },
    },
  },
  "Text xxs/Regular underlined": {
    name: "Text xxs/Regular underlined",
    definition: {
      fontSize: 9,
      textDecoration: "UNDERLINE",
      fontName: { family: "Roboto", style: "Regular" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 12, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 10,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xxs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/regular",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-4xs",
      },
    },
  },
  "Text xxs/Medium italic": {
    name: "Text xxs/Medium italic",
    definition: {
      fontSize: 9,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Medium" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 12, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 10,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xxs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/medium",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-4xs",
      },
    },
  },
  "Text xxs/Semibold italic": {
    name: "Text xxs/Semibold italic",
    definition: {
      fontSize: 9,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "SemiBold Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 12, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 10,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xxs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/semibold-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-4xs",
      },
    },
  },
  "Text xxs/Bold italic": {
    name: "Text xxs/Bold italic",
    definition: {
      fontSize: 9,
      textDecoration: "NONE",
      fontName: { family: "Work Sans", style: "Bold Italic" },
      letterSpacing: { value: 0, unit: "PERCENT" },
      lineHeight: { value: 12, unit: "PIXELS" },
      leadingTrim: "NONE",
      paragraphIndent: 0,
      paragraphSpacing: 10,
      listSpacing: 0,
      hangingPunctuation: false,
      hangingList: false,
      textCase: "ORIGINAL",
    },
    boundVariables: {
      fontSize: {
        fieldName: "fontSize",
        collectionName: "7. Typography",
        variableName: "Font size/text-xxs",
      },
      fontStyle: {
        fieldName: "fontStyle",
        collectionName: "7. Typography",
        variableName: "Font weight/bold-italic",
      },
      fontFamily: {
        fieldName: "fontFamily",
        collectionName: "7. Typography",
        variableName: "Font family/font-family-body",
      },
      paragraphSpacing: {
        fieldName: "paragraphSpacing",
        collectionName: "7. Typography",
        variableName: "Font size/text-xs",
      },
      lineHeight: {
        fieldName: "lineHeight",
        collectionName: "7. Typography",
        variableName: "Line height/text-4xs",
      },
    },
  },
}

type BoundVariable = {
  fieldName: string
  collectionName: string
  variableName: string
}

interface FontName {
  readonly family: string
  readonly style: string
}

type FontStretch = "normal" | "condensed" | "expanded"

type FontStyle = "normal" | "italic" | "oblique"

type Globals =
  | "-moz-initial"
  | "inherit"
  | "initial"
  | "revert"
  | "revert-layer"
  | "unset"

type LeadingTrim = "CAP_HEIGHT" | "NONE"

interface LetterSpacing {
  readonly value: number
  readonly unit: "PIXELS" | "PERCENT"
}

type LineHeight =
  | {
      readonly value: number
      readonly unit: "PIXELS" | "PERCENT"
    }
  | {
      readonly unit: "AUTO"
    }

type ResolvedTextDecoration = "none" | "underline" | "line-through"

type ResolvedTextStyleDefinition = {
  fontFamily: string
  fontSize: number
  fontStretch: string
  fontStyle: string
  fontWeight: number
  letterSpacing: number | string
  lineHeight: string
  marginBlockEnd: number
  marginInlineStart: number
  textDecoration: ResolvedTextDecoration
  textTransform: TextTransform
}

type ResolvedVariableValue = boolean | string | number | RGBA

interface RGBA {
  readonly r: number
  readonly g: number
  readonly b: number
  readonly a: number
}

type TextCase =
  | "ORIGINAL"
  | "UPPER"
  | "LOWER"
  | "TITLE"
  | "SMALL_CAPS"
  | "SMALL_CAPS_FORCED"

type TextDecoration = "NONE" | "UNDERLINE" | "STRIKETHROUGH"

type TextStyleDefinition = {
  fontSize: number
  textDecoration: TextDecoration
  fontName: FontName
  letterSpacing: LetterSpacing
  lineHeight: LineHeight
  leadingTrim: LeadingTrim
  paragraphIndent: number
  paragraphSpacing: number
  listSpacing: number
  hangingPunctuation: boolean
  hangingList: boolean
  textCase: TextCase
}

type TextTransform =
  | Globals
  | "capitalize"
  | "full-size-kana"
  | "full-width"
  | "lowercase"
  | "none"
  | "uppercase"

type ThemeTextStyle = ThemeTextStyleDescription & {
  boundVariables: Record<string, BoundVariable>
}

type ThemeTextStyleDescription = {
  name: string
  definition: TextStyleDefinition
}
type LooselyTypedVariables = Record<
  string,
  Record<string, ResolvedVariableValue>
>

/**
 * Resolves text styles in two steps:
 * 1. Parses the values as they come from figma into a type that can be used
 *    with css.
 * 2. Resolves the values that are bound to variables.
 * @param variables Loosely type version of theme variables, that accepts any
 * string as key.
 * @param textStyle Parsed text style definition.
 * @returns ResolvedTextStyleDefinition
 */
export function resolveTextStyle(
  variables: LooselyTypedVariables,
  textStyle: ThemeTextStyle,
): ResolvedTextStyleDefinition {
  const binding = findBinding(textStyle.boundVariables)

  const resolved: ResolvedTextStyleDefinition = {
    fontFamily: resolveStringField(
      textStyle.definition.fontName.family,
      binding("fontFamily"),
      variables,
    ),

    fontSize: resolveNumberField(
      textStyle.definition.fontSize,
      binding("fontSize"),
      variables,
    ),

    fontStyle: parseFontStyle(
      resolveStringField(
        textStyle.definition.fontName.family,
        binding("fontStyle"),
        variables,
      ),
    ),

    fontWeight: resolveFontWeight(
      textStyle.definition.fontName.style,
      binding("fontWeight"),
      variables,
    ),

    letterSpacing: resolveLetterSpacing(
      textStyle.definition.letterSpacing,
      binding("letterSpacing"),
      variables,
    ),

    lineHeight: resolveLineHeight(
      textStyle.definition.lineHeight,
      binding("lineHeight"),
      variables,
    ),

    marginBlockEnd: resolveNumberField(
      textStyle.definition.paragraphSpacing,
      binding("paragraphSpacing"),
      variables,
    ),

    marginInlineStart: resolveNumberField(
      textStyle.definition.paragraphIndent,
      binding("paragraphIndent"),
      variables,
    ),

    fontStretch: parseFontStretch(textStyle.definition.fontName.style),
    textDecoration:
      textDecorations[textStyle.definition.textDecoration] ?? "none",
    textTransform: textCases[textStyle.definition.textCase] ?? "none",
  }

  return resolved
}

const findBinding =
  (boundVariables: Record<string, BoundVariable>) =>
  (
    fieldName:
      | "fontFamily"
      | "fontSize"
      | "fontStyle"
      | "fontWeight"
      | "letterSpacing"
      | "lineHeight"
      | "paragraphSpacing"
      | "paragraphIndent",
  ): BoundVariable | undefined =>
    boundVariables[fieldName]

const resolveStringField = (
  value: string,
  binding: BoundVariable | undefined,
  variables: LooselyTypedVariables,
): string => {
  if (!binding) {
    return value
  }

  const candidate = variables[binding.collectionName]?.[binding.variableName]
  return typeof candidate === "string" ? candidate : value
}

const resolveNumberField = (
  value: number,
  binding: BoundVariable | undefined,
  variables: LooselyTypedVariables,
): number => {
  if (!binding) {
    return value
  }

  const candidate = variables[binding.collectionName]?.[binding.variableName]
  return typeof candidate === "number" ? candidate : value
}

const resolveFontWeight = (
  value: string,
  binding: BoundVariable | undefined,
  variables: LooselyTypedVariables,
): number => {
  const parsed = parseFontWeight(value)
  if (!binding) {
    return parsed
  }

  const candidate = variables[binding.collectionName]?.[binding.variableName]

  if (typeof candidate === "number") {
    return candidate
  }

  if (typeof candidate === "string") {
    return parseFontWeight(candidate)
  }

  return parsed
}

const resolveLetterSpacing = (
  value: LetterSpacing,
  binding: BoundVariable | undefined,
  variables: LooselyTypedVariables,
): number | string => {
  const parsed = parseLetterSpacing(value)

  if (!binding) {
    return parsed
  }

  const candidate = variables[binding.collectionName]?.[binding.variableName]

  return typeof candidate === "number"
    ? parseLetterSpacing({ ...value, value: candidate })
    : parsed
}

const resolveLineHeight = (
  value: LineHeight,
  binding: BoundVariable | undefined,
  variables: LooselyTypedVariables,
): string => {
  const parsed = parseLineHeight(value)

  if (!binding || value.unit === "AUTO") {
    return parsed
  }

  const candidate = variables[binding.collectionName]?.[binding.variableName]

  return typeof candidate === "number"
    ? // this works because at this point units can only be "PIXELS" or "PERCENT"
      parseLineHeight({ unit: value.unit, value: candidate })
    : parsed
}

const parseLetterSpacing = (letterSpacing: LetterSpacing): number | string => {
  return letterSpacing.unit === "PERCENT"
    ? `${letterSpacing.value}%`
    : letterSpacing.value
}

const parseLineHeight = (lineHeight: LineHeight): string => {
  return lineHeight.unit === "PERCENT"
    ? `${lineHeight.value}%`
    : lineHeight.unit === "AUTO"
      ? "normal"
      : `${lineHeight.value}px`
}

const parseFontStretch = (fontStyle: string): FontStretch => {
  const parts = fontStyle.toLowerCase().split(" ")
  const part1 = parts[parts.length - 1] ?? ""
  const part2 = parts[parts.length - 2] ?? ""
  return fontStretch[part1] ?? fontStretch[part2] ?? "normal"
}

const fontStretch: Record<string, FontStretch> = {
  normal: "normal",
  condensed: "condensed",
  expanded: "expanded",
  extended: "expanded",
}

const parseFontStyle = (fontStyle: string): FontStyle => {
  const part = fontStyle.toLowerCase().split(" ").pop() ?? ""
  const candidate = fontStyles[part]
  return candidate ?? "normal"
}

const fontStyles: Record<string, FontStyle> = {
  normal: "normal",
  italic: "italic",
  kursiv: "italic",
  oblique: "oblique",
}

const parseFontWeight = (fontStyle: string): number => {
  const parts = fontStyle.toLowerCase().split(" ")

  let weight = parts[0] ?? ""
  const part1 = parts[0] ?? ""
  const part2 = parts[1] ?? ""

  // merge if space after extra
  if (
    ["extra", "ultra", "semi", "demi"].includes(part1) &&
    ["bold", "light"].includes(part2)
  ) {
    weight = `${parts[0]}${parts[1]}`
  }

  return fontWeights[weight] ?? 400
}

const fontWeights: Record<string, number> = {
  100: 100,
  thin: 100,
  200: 200,
  extralight: 200,
  ultralight: 200,
  extraleicht: 200,
  300: 300,
  light: 300,
  leicht: 300,
  400: 400,
  normal: 400,
  regular: 400,
  buch: 400,
  500: 500,
  medium: 500,
  kraeftig: 500,
  kräftig: 500,
  600: 600,
  semibold: 600,
  demibold: 600,
  halbfett: 600,
  700: 700,
  bold: 700,
  dreiviertelfett: 700,
  800: 800,
  extrabold: 800,
  ultabold: 800,
  fett: 800,
  900: 900,
  black: 900,
  heavy: 900,
  super: 900,
  extrafett: 900,
}

const textDecorations: Record<string, ResolvedTextDecoration> = {
  NONE: "none",
  UNDERLINE: "underline",
  STRIKETHROUGH: "line-through",
}

const textCases: Record<string, TextTransform> = {
  ORIGINAL: "none",
  UPPER: "uppercase",
  LOWER: "lowercase",
  TITLE: "capitalize",
}
