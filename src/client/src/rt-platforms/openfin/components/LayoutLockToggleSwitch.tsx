import {
  IconContainer,
  SwitcherContainer,
} from 'apps/MainRoute/components/app-header/theme-switcher/ThemeSwitcher'
import React, { useEffect, useState } from 'react'
import Switch from 'react-switch'
import { Theme } from 'rt-theme'
import { ThemeStorageSwitchProps } from 'rt-theme/ThemeStorageSwitch'
import styled, { withTheme } from 'styled-components/macro'
import PlatformLockedStatusIcon, { LockedIcon, UnlockedIcon } from './PlatformLockedStatusIcon'
import { isLayoutLocked, toggleLayoutLock } from './utils'

const InjectedSwitcherContainer = styled(SwitcherContainer)`
  margin: 0 1rem 0 -1rem;
`

const LayoutLockToggleSwitch: React.FC<ThemeStorageSwitchProps & { theme: Theme }> = ({
  theme,
  ...props
}) => {
  const [hover, setHover] = useState<boolean>(false)
  const [locked, setLocked] = useState<boolean>(false)

  const initializeLocked = async () => {
    const locked = await isLayoutLocked()
    setLocked(locked)
  }

  useEffect(() => {
    initializeLocked()
  })

  const onChange = async () => {
    toggleLayoutLock()
    setLocked(!locked)
  }

  return (
    <InjectedSwitcherContainer
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover ? (
        <Switch
          onChange={onChange}
          checked={locked}
          checkedIcon={
            <IconContainer hover={hover}>
              <LockedIcon />
            </IconContainer>
          }
          uncheckedIcon={
            <IconContainer hover={hover}>
              <UnlockedIcon />
            </IconContainer>
          }
          handleDiameter={15}
          offColor={theme.primary[1]}
          offHandleColor={theme.accents.primary.base}
          onColor={theme.primary[1]}
          onHandleColor={theme.accents.primary.base}
          {...props}
        />
      ) : (
        <IconContainer hover={hover}>
          <PlatformLockedStatusIcon />
        </IconContainer>
      )}
    </InjectedSwitcherContainer>
  )
}

export default withTheme(LayoutLockToggleSwitch)
