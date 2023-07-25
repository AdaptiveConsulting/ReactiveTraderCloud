import { ThemeName, ThemeStorageSwitch, useTheme } from "client/theme"
import { ReactElement } from "react"
import styled from "styled-components"

import { Block } from "../styled"

export const FloatingTools = () => {
  const { themeName } = useTheme()
  const isDark = themeName === ThemeName.Dark
  return (
    <Root>
      <Bar>
        <Label>Show {isDark ? "Light" : "Dark"} theme </Label>
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
      <Block bg={(t) => t.primary[2]} />
      {children}
    </>
  )
}

const Bar = styled((props) => (
  <Block
    px={3}
    bg={(t) => t.primary[1]}
    fg={(t) => t.secondary[3]}
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
  opacity: 0.85;
  min-height: 2.5rem;
  max-height: 2.5rem;
`

const Label = styled.label`
  text-transform: uppercase;
  letter-spacing: 0.0625rem;
  font-size: 0.5rem;
  padding-right: 0.5rem;
  text-align: right;
`

export default FloatingTools
