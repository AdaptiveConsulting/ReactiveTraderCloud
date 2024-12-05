import { parseColors } from "./parseColors"
import { GeneratedThemeVariables } from "./types"

it("should parse raw color theme into nested theme object", () => {
  const testColors = {
    "Colors/Text/text-primary (900)": "#f7f7f7",
    "Colors/Text/text-tertiary (600)": "#a3a3a3",
    "Colors/Text/text-error-primary (600)": "#c41230",
    "Colors/Text/text-secondary (700)": "#d6d6d6",
    "Colors/Text/text-disabled": "#737373",
    "Colors/Text/text-brand-secondary (700)": "#d6d6d6",
    "Colors/Border/border-secondary": "#292929",
    "Colors/Background/bg-primary": "#0f0f0f",
    "Colors/Background/bg-primary-solid": "#f5f5f5",
    "Colors/Background/bg-tertiary": "#292929",
    "Colors/Background/bg-secondary": "#141414",
    "Colors/Background/bg-primary_alt": "#141414",
    "Colors/Background/bg-secondary_alt": "#0f0f0f",
    "Colors/Foreground/fg-primary (900)": "#ffffff",
    "Colors/Foreground/fg-error-primary": "#a50e28",
    "Colors/Effects/Focus rings/focus-ring": "#2e90fa",
    "Component colors/Utility/Blue/utility-blue-500": "#2e90fa",
    "Component colors/Utility/Brand/utility-brand-700": "#a7a9fa",
    "Component colors/Utility/Brand/utility-brand-200": "#41427c",
    "Component colors/Utility/Brand/utility-brand-50": "#0d0d19",
    "Component colors/Utility/Success/utility-success-700": "#75e0a7",
    "Component colors/Utility/Success/utility-success-200": "#085d3a",
    "Component colors/Utility/Success/utility-success-50": "#053321",
  }

  const expected = {
    colors: {
      text: {
        primary: "#f7f7f7",
        tertiary: "#a3a3a3",
        errorPrimary: "#c41230",
        secondary: "#d6d6d6",
        disabled: "#737373",
        brandSecondary: "#d6d6d6",
      },
      border: {
        secondary: "#292929",
      },
      background: {
        primary: "#0f0f0f",
        primarySolid: "#f5f5f5",
        tertiary: "#292929",
        secondary: "#141414",
        primary_alt: "#141414",
        secondary_alt: "#0f0f0f",
      },
      foreground: {
        primary: "#ffffff",
        errorPrimary: "#a50e28",
      },
      effects: {
        "focus rings": {
          focusRing: "#2e90fa",
        },
      },
    },
    "component colors": {
      utility: {
        blue: {
          "500": "#2e90fa",
        },
        brand: {
          "50": "#0d0d19",
          "200": "#41427c",
          "700": "#a7a9fa",
        },
        success: {
          "50": "#053321",
          "200": "#085d3a",
          "700": "#75e0a7",
        },
      },
    },
  }

  expect(
    parseColors(testColors as GeneratedThemeVariables["1. Color modes"]),
  ).toEqual(expected)
})
