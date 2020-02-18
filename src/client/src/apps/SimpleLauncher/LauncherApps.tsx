import React from 'react'
import { appConfigs } from './applicationConfigurations'
import { Tooltip } from '../../rt-components'
import { LaunchButton } from './LaunchButton'
import { open } from './tools'
import { ButtonContainer, IconTitle } from './styles'

export const LauncherApps: React.FC = () => {
  return (
    <>
      {appConfigs.map(app => (
        <ButtonContainer key={app.name}>
          <Tooltip message={app.tooltipName}>
            <LaunchButton onClick={() => open(app)} fill={app.iconhovercolor}>
              {app.icon}
              <IconTitle>{app.displayName}</IconTitle>
            </LaunchButton>
          </Tooltip>
        </ButtonContainer>
      ))}
    </>
  )
}
