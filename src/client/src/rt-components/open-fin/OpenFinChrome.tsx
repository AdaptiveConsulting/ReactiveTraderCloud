import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { SFC } from 'react'
import { Helmet } from 'react-helmet'
import { styled } from 'rt-theme'

export interface ControlProps {
  minimize?: () => void
  maximize?: () => void
  close: () => void
}

export const OpenFinChrome: SFC<{}> = ({ children }) => (
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

const DragRegion = styled.div`
  flex-grow: 1;
  background-color: lime;
  -webkit-app-region: drag;
  cursor: -webkit-grab;
`

const Header = styled.div`
  display: flex;
  width: 100%;

  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 600;
`

const HeaderControl = styled.div<{ intent?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${props => props.theme.button.secondary.backgroundColor};

  font-size: 1em;
  min-width: 2rem;
  min-height: 2rem;

  cursor: pointer;

  &:hover {
    background: none;
    color: ${({ theme, intent = 'primary' }) => theme.button[intent].backgroundColor};
  }
`

export const Root = styled.div`
  background-color: ${props => props.theme.shell.backgroundColor};
  color: ${props => props.theme.shell.textColor};

  height: 100%;
  width: 100%;
`

export default OpenFinChrome
