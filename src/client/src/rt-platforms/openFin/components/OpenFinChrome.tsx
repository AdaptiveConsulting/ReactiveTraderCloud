import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { SFC } from 'react'
import { Helmet } from 'react-helmet'
import { styled, AccentName } from 'rt-theme'

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

export const OpenFinHeader: React.FC<ControlProps> = ({ ...props }) => (
  <Header>
    <DragRegion />
    <OpenFinControls {...props} />
  </Header>
)

export const OpenFinControls: React.FC<ControlProps> = ({ minimize, maximize, close }) => (
  <React.Fragment>
    {minimize ? (
      <HeaderControl accent="aware" onClick={minimize}>
        <i className="fas fa-minus fa-set-position" />
      </HeaderControl>
    ) : null}
    {maximize ? (
      <HeaderControl accent="dominant" onClick={maximize}>
        <i className="far fa-window-maximize" />
      </HeaderControl>
    ) : null}
    <HeaderControl accent="bad" onClick={close}>
      <FontAwesomeIcon icon={faTimes} />
    </HeaderControl>
  </React.Fragment>
)

export const OPENFIN_CHROME_HEADER_HEIGHT = '21px'

const Header = styled.div`
  display: flex;
  width: 100%;
  min-height: 1.5rem;
  font-size: 1rem;
  height: ${OPENFIN_CHROME_HEADER_HEIGHT};
`

const DragRegion = styled.div`
  display: flex;
  flex-grow: 1;
  -webkit-app-region: drag;
`

const HeaderControl = styled.div<{ accent?: AccentName }>`
  display: flex;
  justify-content: center;
  align-self: center;
  min-width: 2.3rem;
  padding-top: 7px;

  color: ${props => props.theme.button.secondary.backgroundColor};
  cursor: pointer;

  &:hover {
    color: ${({ theme, accent = 'dominant' }) => theme.button[accent].backgroundColor};
  }
`

export const Root = styled.div`
  background-color: ${props => props.theme.core.darkBackground};
  color: ${props => props.theme.core.textColor};

  height: 100%;
  width: 100%;
`

export default OpenFinChrome
