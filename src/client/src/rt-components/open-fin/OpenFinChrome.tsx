import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { SFC } from 'react'
import { Helmet } from 'react-helmet'
import { styled } from 'test-theme'

export interface ControlProps {
  minimize?: () => void
  maximize?: () => void
  close: () => void
}

export const OpenFinChrome: SFC = ({ children }) => (
  <React.Fragment>
    <Helmet>
      <style type="text/css">{`
        :root,
        body,
        #root {
          overflow: hidden;
          min-height: 100%;
          max-height: 100vh;
        }
    `}</style>
    </Helmet>
    <Root>{children}</Root>
  </React.Fragment>
)

export const OpenFinHeader: React.SFC<ControlProps> = ({ ...props }) => (
  <Header>
    <DragRegion />
    <OpenFinControls {...props} />
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

const Header = styled.div`
  display: flex;
  width: 100%;
  min-height: 1.5rem;
  font-size: 1rem;
`

const DragRegion = styled.div`
  display: flex;
  flex-grow: 1;
  -webkit-app-region: drag;
`

const HeaderControl = styled.div<{ intent?: string }>`
  display: flex;
  justify-content: center;
  align-self: center;
  min-width: 2.5rem;

  color: ${props => props.theme.button.secondary.backgroundColor};
  cursor: pointer;

  &:hover {
    color: ${({ theme, intent = 'primary' }) => theme.button[intent].backgroundColor};
  }
`

export const Root = styled.div`
  display: grid;
  background-color: ${props => props.theme.shell.backgroundColor};
  color: ${props => props.theme.shell.textColor};

  height: 100%;
  width: 100%;

  grid-template-rows: 1.5rem 1fr;
`

export default OpenFinChrome
