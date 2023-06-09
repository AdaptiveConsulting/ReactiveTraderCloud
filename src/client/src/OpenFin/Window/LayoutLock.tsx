import { useEffect, useState } from "react"
import Switch from "react-switch"
import { useTheme } from "styled-components"

import { IconContainer, SwitchContainer } from "@/components/Switch"

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
        />
      ) : (
        <IconContainer hover={hover}>
          <PlatformLockedStatusIcon />
        </IconContainer>
      )}
    </SwitchContainer>
  )
}
