import { useState } from "react"
import Switch, { ReactSwitchProps } from "react-switch"
import { withTheme } from "styled-components"

import { IconContainer, SwitchContainer } from "@/client/components/Switch"
import { Theme, ThemeName, useTheme } from "@/client/theme"

import DarkThemeIcon from "./DarkThemeIcon"
import LightThemeIcon from "./LightThemeIcon"

export type ThemeStorageSwitchProps = Partial<ReactSwitchProps>

const ThemeStorageSwitch = ({
  theme,
  ...props
}: ThemeStorageSwitchProps & {
  theme: Theme
}) => {
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

  const handleChange = () => {
    !isTouchDevice && toggleTheme()
  }

  return (
    <SwitchContainer {...eventHandlers}>
      {hover ? (
        <Switch
          onChange={handleChange}
          checked={isDarkTheme}
          checkedIcon={
            <IconContainer hover={hover}>
              <DarkThemeIcon />
            </IconContainer>
          }
          uncheckedIcon={
            <IconContainer hover={hover}>
              <LightThemeIcon />
            </IconContainer>
          }
          handleDiameter={props.handleDiameter || 15}
          offColor={theme.newTheme.color["Colors/Background/bg-secondary"]}
          offHandleColor={
            theme.newTheme.color["Colors/Background/bg-brand-primary"]
          }
          onColor={theme.newTheme.color["Colors/Background/bg-secondary"]}
          onHandleColor={
            theme.newTheme.color["Colors/Background/bg-brand-primary"]
          }
          {...props}
        />
      ) : (
        <IconContainer hover={hover}>
          <Icon />
        </IconContainer>
      )}
    </SwitchContainer>
  )
}

export default withTheme(ThemeStorageSwitch)
