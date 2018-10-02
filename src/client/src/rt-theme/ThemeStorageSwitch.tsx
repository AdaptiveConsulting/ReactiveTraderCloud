import React from 'react'
import Switch, { ReactSwitchProps } from 'react-switch'

import { ThemeConsumer, ThemeName, ThemeStorage } from 'rt-theme'

export interface ThemeStorageSwitchProps extends Partial<ReactSwitchProps> {}

export const ThemeStorageSwitch: React.SFC<ThemeStorageSwitchProps> = props => (
  <ThemeStorage.Consumer>
    {({ name, setTheme }) => (
      <ThemeConsumer>
        {theme => (
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
      </ThemeConsumer>
    )}
  </ThemeStorage.Consumer>
)
