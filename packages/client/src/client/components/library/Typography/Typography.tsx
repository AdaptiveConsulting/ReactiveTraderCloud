import { PropsWithChildren } from "react"

import { Color } from "@/client/theme/types"
import { UISK_TextStyleName } from "@/client/theme/uisk/generatedTheme"
import {
  colorVariableMap,
  textStyleClassMap,
} from "@/client/theme/uisk/generateUISKCss"

interface TypographyProps {
  variant?: UISK_TextStyleName
  color?: Color
  allowLineHeight?: boolean
}

export const Typography = ({
  children,
  variant,
  color,
  allowLineHeight,
}: PropsWithChildren<TypographyProps>) => {
  const className = variant && textStyleClassMap[variant]
  const colorVar = color && colorVariableMap[color]
  return (
    <div
      className={`typography ${className}`}
      style={{
        color: `var(${colorVar})`,
        lineHeight: allowLineHeight ? undefined : 1,
      }}
    >
      {children}
    </div>
  )
}
