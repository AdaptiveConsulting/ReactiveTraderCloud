import React from 'react'
import Switch, { ReactSwitchProps } from 'react-switch'
import { ThemeConsumer, ThemeName, Theme } from 'rt-theme'
import { withTheme } from 'styled-components'

export interface ThemeStorageSwitchProps extends Partial<ReactSwitchProps> {}

const ThemeStorageSwitch: React.SFC<ThemeStorageSwitchProps & { theme: Theme }> = ({ theme, ...props }) => (
  <ThemeConsumer>
    {({ name, setTheme }) => (
      <Switch
        ariaLabel="Switch Theme"
        onChange={() =>
          setTheme({
            name: name === ThemeName.Dark ? ThemeName.Light : ThemeName.Dark,
          })
        }
        checked={ThemeName.Dark === name}
        checkedIcon={false}
        uncheckedIcon={false}
        height={12}
        width={27}
        handleDiameter={12}
        offColor={theme.secondary[4]}
        offHandleColor={theme.secondary.base}
        onColor={theme.primary[4]}
        onHandleColor={theme.primary[2]}
        activeBoxShadow={`0 0 0 0.125rem ${theme.secondary[4]} inset`}
        {...props}
      />
    )}
  </ThemeConsumer>
)

export default withTheme(ThemeStorageSwitch)
