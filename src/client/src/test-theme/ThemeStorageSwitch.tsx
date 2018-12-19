import React from 'react'
import Switch, { ReactSwitchProps } from 'react-switch'
import { TestThemeConsumer, ThemeName, Theme } from 'test-theme'
import { withTheme } from 'styled-components'

export interface ThemeStorageSwitchProps extends Partial<ReactSwitchProps> {}

const ThemeStorageSwitch: React.SFC<ThemeStorageSwitchProps & { theme?: Theme }> = ({ theme, ...props }) => (
  <TestThemeConsumer>
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
        width={32}
        handleDiameter={16}
        offColor={theme.secondary[4]}
        offHandleColor={theme.secondary.base}
        onColor={theme.primary[4]}
        onHandleColor={theme.primary[2]}
        activeBoxShadow={`0 0 0 0.125rem ${theme.secondary[4]} inset`}
        {...props}
      />
    )}
  </TestThemeConsumer>
)

export default withTheme(ThemeStorageSwitch)
