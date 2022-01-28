import { useState } from "react"
import SwitchO, { ReactSwitchProps } from "react-switch"
import { ThemeName, Theme, useTheme } from "@/theme"
import { withTheme } from "styled-components"
import DarkThemeIcon from "./DarkThemeIcon"
import { IconContainer, SwitchContainer } from "@/components/Switch"
import LightThemeIcon from "./LightThemeIcon"

export interface ThemeStorageSwitchProps extends Partial<ReactSwitchProps> {}
const iconSize = 18

// TODO: Get rid of this library or open an issue/PR to fix their build
const Switch: typeof SwitchO = (SwitchO as any).default
  ? (SwitchO as any).default
  : SwitchO

const ThemeStorageSwitch: React.FC<ThemeStorageSwitchProps & { theme: Theme }> =
  ({ theme, ...props }) => {
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
      </SwitchContainer>
    )
  }

ThemeStorageSwitch.defaultProps = {
  handleDiameter: 15,
}

export default withTheme(ThemeStorageSwitch)
