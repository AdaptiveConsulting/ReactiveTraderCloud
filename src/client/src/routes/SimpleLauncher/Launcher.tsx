import React from 'react'

import { rules } from 'rt-styleguide'
import { injectGlobal, styled, ThemeStorageSwitch } from 'rt-theme'

import { config } from './config'
import { Link } from './Link'

export class Launcher extends React.Component {
  // unset global scaling on mount
  _ = injectGlobal`
    :root, body {
      @media all {
        font-size: 16px;
        -webkit-app-region: drag;
      }
    }
  `

  render() {
    return (
      <Root>
        <Frame>
          <Fill />
          {config.map(app => (
            <ToggleContainer key={app.name}>
              <Link to={app}>{app.icon}</Link>
            </ToggleContainer>
          ))}

          <AutoFill />

          <ToggleContainer>
            <ThemeStorageSwitch />
          </ToggleContainer>

          <Fill />
        </Frame>
      </Root>
    )
  }
}

const Root = styled.div(({ theme }) => {
  return {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.shell.backgroundColor,
    color: theme.shell.textColor,
  }
})

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  height: 100%;
  max-width: 4rem;
  max-height: 20rem;
  border-radius: 0.25rem;

  /* Browser / Prototyping framing: */
  box-shadow: 0 0 0 0.125rem rgba(127, 127, 127, 0.1);
`

const Fill = styled.div`
  min-height: 0.75rem;
  max-height: 0.75rem;
  width: 100%;

  ${rules.appRegionDrag};
`

const AutoFill = styled.div`
  flex: 1 1 100%;
  width: 100%;

  ${rules.appRegionDrag};
`

const ToggleContainer = styled.div`
  min-height: 2.75rem;
  max-height: 2.75rem;
  min-width: 3rem;
  max-width: 3rem;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  ${rules.appRegionNoDrag};
`

export const Rule = styled.div`
  width: 3rem;
  display: block;
  height: 0.125rem;
  background-color: rgba(0, 0, 0, 0.1);

  ${rules.appRegionDrag};
`
