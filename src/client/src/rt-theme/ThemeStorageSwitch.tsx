import React from 'react'
import Switch, { ReactSwitchProps } from 'react-switch'
import { ThemeName, Theme, useTheme } from 'rt-theme'
import { withTheme } from 'styled-components'

export interface ThemeStorageSwitchProps extends Partial<ReactSwitchProps> {}

const ThemeStorageSwitch: React.FC<ThemeStorageSwitchProps & { theme: Theme }> = ({ theme, ...props }) => {
  const { themeName, toggleTheme } = useTheme()

  return (
    <Switch
      ariaLabel="Switch Theme"
      onChange={toggleTheme}
      checked={themeName === ThemeName.Dark}
      checkedIcon={false}
      uncheckedIcon={false}
      height={12}
      width={27}
      handleDiameter={props.handleDiameter}
      offColor={theme.secondary[4]}
      offHandleColor={theme.secondary.base}
      onColor={theme.primary[4]}
      onHandleColor={theme.primary[2]}
      activeBoxShadow={`0 0 0 0.125rem ${theme.secondary[4]} inset`}
      {...props}
    />
  )
}
ThemeStorageSwitch.defaultProps = {
  handleDiameter: 12,
}

export default withTheme(ThemeStorageSwitch)
