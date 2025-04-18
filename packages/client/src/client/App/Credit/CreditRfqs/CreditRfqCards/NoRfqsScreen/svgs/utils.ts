import { useMemo } from "react"

import { themes, useTheme } from "@/client/theme"

export const DEFAULT_NO_RFQ_SVG_SIZE = 82

export const useNoRfqsIconColors = () => {
  const { themeName } = useTheme()

  return useMemo(() => {
    const theme = themes[themeName]
    return {
      primary: theme.color["Colors/Text/text-primary (900)"],
      contrast: theme.color["Colors/Text/text-brand-primary (900)"],
      secondary: theme.color["Colors/Text/text-brand-primary (900)"],
    }
  }, [themeName])
}
