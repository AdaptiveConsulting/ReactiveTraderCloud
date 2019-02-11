import React from 'react'

import { rules } from 'rt-styleguide'

import { appConfigs } from './applicationConfigurations'
import { LaunchButton } from './LaunchButton'
import { LogoIcon } from 'rt-components'
import { createGlobalStyle } from 'styled-components'
import { ThemeStorageSwitch, styled } from 'rt-theme'

const LauncherGlobalStyle = createGlobalStyle`
:root, body {
  @media all {
    font-size: 16px;
    -webkit-app-region: drag;
  }
}
`

export class Launcher extends React.Component {
  render() {
    return (
      <React.Fragment>
        <LauncherGlobalStyle />
        <Root>
          <LogoContainer>
            <LogoIcon width={1.3} height={1.3} />
          </LogoContainer>
          {appConfigs.map(app => (
            <ButtonContainer key={app.name}>
              <LaunchButton appConfig={app}>
                {app.icon}
                <IconTitle>{app.name}</IconTitle>
              </LaunchButton>
            </ButtonContainer>
          ))}
          <ThemeSwitchContainer>
            <ThemeStorageSwitch />
          </ThemeSwitchContainer>
        </Root>
      </React.Fragment>
    )
  }
}

const Root = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.core.darkBackground};
  color: ${({ theme }) => theme.core.textColor};
`

const IconTitle = styled.span`
  position: absolute;
  bottom: 2px;
  font-size: 9px;
  font-family: Lato;
  color: transparent;
  transition: color 0.3s ease;

  /* avoids text highlighting on icon titles */
  user-select: none;
`

const IconContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  &:hover {
    span {
      color: ${({ theme }) => theme.core.textColor};
    }
  }
`

const ButtonContainer = styled(IconContainer)`
  ${rules.appRegionNoDrag};
`
const ThemeSwitchContainer = styled(ButtonContainer)`
  width: 35%;
`

const LogoContainer = styled(IconContainer)`
  width: 50%;
  background-color: ${({ theme }) => theme.core.darkBackground};
  .svg-icon {
    fill: ${({ theme }) => theme.core.textColor};
  }
  ${rules.appRegionDrag};
`
