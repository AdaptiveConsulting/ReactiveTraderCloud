import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { css } from 'emotion'
import React from 'react'
import { Helmet } from 'react-helmet'
import { rules } from 'rt-styleguide'
import { styled, StyledComponent } from 'rt-theme'

export interface ControlProps {
  minimize?: () => void
  maximize?: () => void
  close: () => void
}

export interface HeaderProps extends ControlProps {
  hide?: boolean
}

export const OpenFinChrome = ({ children }) => (
  <React.Fragment>
    <Helmet>
      <style type="text/css">{`
        :root,
        body,
        #root {
          overflow: hidden;
          max-height: 100vh;
        }
    `}</style>
    </Helmet>
    <Root>{children}</Root>
  </React.Fragment>
)

export const OpenFinHeader: React.SFC<HeaderProps> = ({ hide, ...props }) => (
  <Header hide={hide}>
    <DragRegion />
    <ControlGroup>
      <OpenFinControls {...props} />
    </ControlGroup>
  </Header>
)

export const OpenFinControls: React.SFC<ControlProps> = ({ minimize, maximize, close }) => (
  <React.Fragment>
    {minimize ? (
      <HeaderControl intent="aware" onClick={minimize}>
        <i className="fas fa-minus fa-set-position" />
      </HeaderControl>
    ) : null}
    {maximize ? (
      <HeaderControl intent="primary" onClick={maximize}>
        <i className="far fa-window-maximize" />
      </HeaderControl>
    ) : null}
    <HeaderControl intent="bad" onClick={close}>
      <FontAwesomeIcon icon={faTimes} />
    </HeaderControl>
  </React.Fragment>
)

const DragRegion = styled.div`
  flex: 1 1 100%;
  -webkit-app-region: drag;
  cursor: -webkit-grab;
`

const ControlGroup = styled.div`
  display: flex;
  flex: 1;

  align-content: center;

  height: 2rem;
  max-width: 6rem;
  position: relative;
  z-index: 20;
`

const Header: StyledComponent<{ hide?: boolean }> = styled.div`
  display: flex;
  width: 100%;
  height: 2rem;

  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 600;

  align-content: center;
  vertical-align: middle;

  position: relative;

  ${({ hide }) =>
    !hide
      ? ''
      : css`
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 10;

          opacity: 0;

          height: 1rem;

          ${HeaderControl} {
            min-height: 1rem;
          }

          ${Root}:hover & {
            opacity: 1;
            z-index: 20;
          }
        `};
`

const HeaderControl: StyledComponent<{ intent?: string }> = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${props => props.theme.button.secondary.backgroundColor};

  font-size: 1em;
  min-width: 2.5rem;
  min-height: 2.5rem;

  cursor: pointer;

  &:hover {
    ${({ intent = 'primary', theme }) => css`
      background: none;
      color: ${theme.button[intent].backgroundColor};
    `};
  }

  &,
  * {
    ${props => ' ' || rules.userSelectButton};
  }
`

export const Root = styled.div`
  background-color: ${props => props.theme.shell.backgroundColor};
  color: ${props => props.theme.shell.textColor};

  height: 100vh;
  position: relative;
`

export default OpenFinChrome
