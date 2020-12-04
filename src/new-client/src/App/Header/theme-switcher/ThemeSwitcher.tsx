import React, { useState } from "react"
import Switch, { ReactSwitchProps } from "react-switch"
import { ThemeName, Theme, useTheme } from "theme"
import styled, { withTheme } from "styled-components/macro"
import DarkThemeIcon from "./DarkThemeIcon"
import LightThemeIcon from "./LightThemeIcon"

export interface ThemeStorageSwitchProps extends Partial<ReactSwitchProps> {}
const iconSize = 18

const SwitcherContainer = styled.div`
  margin: 0 1rem;
  padding-top: 1px;
  min-width: 3.5rem;
  display: flex;
  justify-content: flex-end;
`

const IconContainer = styled.div<{ hover: boolean }>`
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 50%;
  height: 1.8rem;
  width: 1.8rem;
  padding: 4px 6px;
  display: flex;
  justify-content: ${({ hover }) => (hover ? "flex-end" : "center")};
  align-items: center;
`

const ThemeStorageSwitch: React.FC<
  ThemeStorageSwitchProps & { theme: Theme }
> = ({ theme, ...props }) => {
  const [hover, setHover] = useState<boolean>(false)
  const { themeName, toggleTheme } = useTheme()
  const isDarkTheme = themeName === ThemeName.Dark
  const isTouchDevice = "ontouchstart" in document.documentElement
  const Icon = isDarkTheme ? DarkThemeIcon : LightThemeIcon

  const handleTouchThemeSwitch = () => {
    setHover(true)
    setTimeout(() => {
      toggleTheme()
    }, 400)
    setTimeout(() => {
      setHover(false)
    }, 1200)
  }

  const eventHandlers = {
    ...(!isTouchDevice && { onMouseEnter: () => setHover(true) }),
    ...(!isTouchDevice && { onMouseLeave: () => setHover(false) }),
    ...(isTouchDevice && { onTouchStart: handleTouchThemeSwitch }),
  }

  return (
    <SwitcherContainer {...eventHandlers}>
      {hover ? (
        <Switch
          onChange={toggleTheme}
          checked={isDarkTheme}
          checkedIcon={
            <IconContainer hover={hover}>
              <DarkThemeIcon
                height={iconSize}
                width={iconSize}
                fill={theme.secondary.base}
              />
            </IconContainer>
          }
          uncheckedIcon={
            <IconContainer hover={hover}>
              <LightThemeIcon
                height={iconSize}
                width={iconSize}
                fill={theme.secondary.base}
              />
            </IconContainer>
          }
          handleDiameter={props.handleDiameter}
          offColor={theme.primary.base}
          offHandleColor={theme.accents.primary.base}
          onColor={theme.primary[1]}
          onHandleColor={theme.accents.primary.base}
          {...props}
        />
      ) : (
        <IconContainer hover={hover}>
          <Icon height={iconSize} width={iconSize} />
        </IconContainer>
      )}
    </SwitcherContainer>
  )
}

ThemeStorageSwitch.defaultProps = {
  handleDiameter: 15,
}

export default withTheme(ThemeStorageSwitch)
