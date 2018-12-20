import React from 'react'

import { rules } from 'rt-styleguide'

import { config } from './config'
import { Link } from './Link'
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
            <LogoIcon width={1.5} height={1.5} />
          </LogoContainer>
          {config.map(app => (
            <ButtonContainer key={app.name}>
              <Link to={app}>{app.icon}</Link>
            </ButtonContainer>
          ))}

          <ButtonContainer>
            <ThemeStorageSwitch />
          </ButtonContainer>
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

const IconContainer = styled.div`
  height: 100%;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const ButtonContainer = styled(IconContainer)`
  ${rules.appRegionNoDrag};
`

const LogoContainer = styled(IconContainer)`
  background-color: ${({ theme }) => theme.core.lightBackground};

  .svg-icon {
    fill: ${({ theme }) => theme.core.textColor};
  }

  ${rules.appRegionDrag};
`
