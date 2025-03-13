import { useEffect, useState } from "react"
import Switch from "react-switch"
import { useTheme } from "styled-components"

import { IconContainer, SwitchContainer } from "@/client/components/Switch"

import { LockedIcon } from "../icons/LockedIcon"
import { PlatformLockedStatusIcon } from "../icons/PlatformLockedStatusIcon"
import { UnlockedIcon } from "../icons/UnlockedIcon"
import { isLayoutLocked, toggleLayoutLock } from "../utils/layout"

export const LayoutLock: React.FC = () => {
  const [locked, setLocked] = useState(false)
  const [hover, setHover] = useState(false)
  const theme = useTheme()

  async function initializeLocked() {
    setLocked(await isLayoutLocked())
  }

  useEffect(() => {
    initializeLocked()
  }, [])

  function onChange() {
    toggleLayoutLock()
    setLocked((locked) => !locked)
  }

  return (
    <SwitchContainer
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title="toggle layout lock"
    >
      {hover ? (
        <Switch
          onChange={onChange}
          checked={locked}
          checkedIcon={
            <IconContainer hover={hover}>
              <LockedIcon />
              {/* TODO: update this icon */}
            </IconContainer>
          }
          uncheckedIcon={
            <IconContainer hover={hover}>
              <UnlockedIcon />
            </IconContainer>
          }
          handleDiameter={15}
          offColor={theme.color["Colors/Background/bg-secondary"]}
          offHandleColor={theme.color["Colors/Background/bg-brand-primary"]}
          onColor={theme.color["Colors/Background/bg-secondary"]}
          onHandleColor={theme.color["Colors/Background/bg-brand-primary"]}
        />
      ) : (
        <IconContainer hover={hover}>
          <PlatformLockedStatusIcon />
        </IconContainer>
      )}
    </SwitchContainer>
  )
}
