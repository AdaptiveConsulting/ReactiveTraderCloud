import React from 'react'
import { appConfigs } from './applicationConfigurations'
import { LaunchButton } from './LaunchButton'
import { open } from './tools'
import { ButtonContainer, IconTitle } from './styles'

export const LauncherApps: React.FC = () => {
  return (
    <>
      {appConfigs.map(app => (
        <ButtonContainer key={app.name}>
          <LaunchButton title={app.tooltipName} onClick={() => open(app)} fill={app.iconhovercolor}>
            {app.icon}
            <IconTitle>{app.displayName}</IconTitle>
          </LaunchButton>
        </ButtonContainer>
      ))}
    </>
  )
}
