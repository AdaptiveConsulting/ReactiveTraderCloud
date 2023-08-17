import { themes, useTheme } from "client/theme"
import { useMemo } from "react"

export const DEFAULT_NO_RFQ_SVG_SIZE = 82

export const useNoRfqsIconColors = () => {
  const { themeName } = useTheme()

  return useMemo(() => {
    const theme = themes[themeName]
    return {
      primary: theme.core.textColor,
      contrast: theme.colors.spectrum.blue.base,
      secondary: theme.colors.spectrum.blue.base,
    }
  }, [themeName])
}
