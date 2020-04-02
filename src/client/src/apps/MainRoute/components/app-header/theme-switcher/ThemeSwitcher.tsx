import React, { useState } from 'react'
import Switch, { ReactSwitchProps } from 'react-switch'
import { ThemeName, Theme, useTheme, styled } from 'rt-theme'
import { withTheme } from 'styled-components'
import DarkThemeIcon from './DarkThemeIcon'
import LightThemeIcon from './LightThemeIcon'

export interface ThemeStorageSwitchProps extends Partial<ReactSwitchProps> {}
const iconSize = 18

const SwitcherContainer = styled.div`
  margin: 0 1rem;
`

const IconContainer = styled.div<{ hover: boolean }>`
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 50%;
  height: 1.8rem;
  width: 1.8rem;
  display: flex;
  justify-content: ${({ hover }) => (hover ? 'flex-end' : 'center')};
  align-items: center;
`

const ThemeStorageSwitch: React.FC<ThemeStorageSwitchProps & { theme: Theme }> = ({
  theme,
  ...props
}) => {
  const [hover, setHover] = useState<boolean>(false)
  const { themeName, toggleTheme } = useTheme()
  const isDarkTheme = themeName === ThemeName.Dark
  const Icon = isDarkTheme ? DarkThemeIcon : LightThemeIcon

  return (
    <SwitcherContainer onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {hover ? (
        <Switch
          onChange={toggleTheme}
          checked={isDarkTheme}
          checkedIcon={
            <IconContainer hover={hover}>
              <DarkThemeIcon height={iconSize} width={iconSize} fill={theme.secondary.base} />
            </IconContainer>
          }
          uncheckedIcon={
            <IconContainer hover={hover}>
              <LightThemeIcon height={iconSize} width={iconSize} fill={theme.secondary.base} />
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
