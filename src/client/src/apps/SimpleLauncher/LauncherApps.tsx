import React, { useState } from 'react'
import { appConfigs } from './applicationConfigurations'
import { Tooltip } from '../../rt-components'
import { LaunchButton } from './LaunchButton'
import { open } from './tools'
import { ButtonContainer, IconTitle } from './styles'

export const LauncherApps: React.FC = () => {
  const [hover, setHover] = useState(false)

  return (
    <>
      {appConfigs.map(app => (
        <ButtonContainer key={app.name}>
          <Tooltip message={app.tooltipName}>
            <LaunchButton
              onClick={() => open(app)}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              {hover && app.iconhover ? app.iconhover : app.icon}
              <IconTitle>{app.displayName}</IconTitle>
            </LaunchButton>
          </Tooltip>
        </ButtonContainer>
      ))}
    </>
  )
}
