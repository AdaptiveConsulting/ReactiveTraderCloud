import { ReactElement } from "react"
import styled from "styled-components"

import { Typography } from "@/client/components/Typography"
import { ThemeName, ThemeStorageSwitch, useTheme } from "@/client/theme"

import { Block } from "../styled"

export const FloatingTools = () => {
  const { themeName } = useTheme()
  const isDark = themeName === ThemeName.Dark
  return (
    <Root>
      <Bar>
        <Label
          variant="Text xs/Regular"
          color="Colors/Text/text-secondary (700)"
        >
          Show {isDark ? "Light" : "Dark"} theme{" "}
        </Label>
        <ThemeStorageSwitch handleDiameter={18} />
      </Bar>
    </Root>
  )
}

interface RootProps {
  children: ReactElement
}

const Root: React.FC<RootProps> = ({ children }: RootProps) => {
  return (
    <>
      <Block
        bg={(t) => t.newTheme.color["Colors/Background/bg-secondary_subtle"]}
      />
      {children}
    </>
  )
}

const Bar = styled((props) => (
  <Block
    px={3}
    bg={(t) => t.newTheme.color["Colors/Background/bg-secondary_subtle"]}
    fg={(t) => t.newTheme.color["Colors/Foreground/fg-secondary (700)"]}
    {...props}
  />
))`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  min-height: 2.5rem;
  max-height: 2.5rem;
`

const Label = styled(Typography)`
  text-transform: uppercase;
  padding-right: 0.5rem;
`
