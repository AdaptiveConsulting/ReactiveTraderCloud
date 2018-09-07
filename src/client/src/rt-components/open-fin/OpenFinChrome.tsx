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
    <HeaderControl intent="aware" onClick={minimize}>
      <i className="fas fa-minus fa-set-position" />
    </HeaderControl>
    <HeaderControl intent="primary" onClick={maximize}>
      <i className="far fa-window-maximize" />
    </HeaderControl>
    <HeaderControl intent="bad" onClick={close}>
      <FontAwesomeIcon icon={faTimes} />
    </HeaderControl>
  </React.Fragment>
)

const Header = styled.div`
  display: grid;
  grid-template-columns: 10fr repeat(3, 1fr);

  min-height: 2.5rem;

  font-size: 1rem;
  font-weight: 600;
`

const DragRegion = styled.div`
  -webkit-app-region: drag;
`

const HeaderControl = styled.div<{ intent?: string }>`
  display: grid;
  justify-items: center;
  align-items: center;

  color: ${props => props.theme.button.secondary.backgroundColor};
  min-width: 2.5rem;
  cursor: pointer;

  &:hover {
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
