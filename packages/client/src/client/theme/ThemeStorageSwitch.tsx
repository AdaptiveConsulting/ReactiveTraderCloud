import Switch, { ReactSwitchProps } from "react-switch"
import { withTheme } from "styled-components"

import { Theme, ThemeName, useTheme } from "."

export type ThemeStorageSwitchProps = Partial<ReactSwitchProps>

const ThemeStorageSwitch = ({
  theme,
  ...props
}: ThemeStorageSwitchProps & {
  theme: Theme
}) => {
  const { themeName, toggleTheme } = useTheme()

  return (
    <Switch
      onChange={toggleTheme}
      checked={themeName === ThemeName.Dark}
      checkedIcon={false}
      uncheckedIcon={false}
      height={12}
      width={27}
      handleDiameter={props.handleDiameter}
      offColor={theme.newTheme.color["Colors/Background/bg-disabled"]}
      offHandleColor={theme.newTheme.color["Colors/Foreground/fg-disabled"]}
      onColor={theme.newTheme.color["Colors/Background/bg-disabled"]}
      onHandleColor={
        theme.newTheme.color["Colors/Foreground/fg-brand-primary (600)"]
      }
      {...props}
    />
  )
}
ThemeStorageSwitch.defaultProps = {
  handleDiameter: 12,
}

export default withTheme(ThemeStorageSwitch)
