import React, { useEffect, useState, useCallback } from 'react'
import { Helmet } from 'react-helmet'
import { snapAndDock } from 'openfin-layouts'
import { styled, AccentName } from 'rt-theme'
import {
  minimiseNormalIcon,
  maximiseScreenIcon,
  exitNormalIcon,
  popInIcon,
} from 'apps/SimpleLauncher/icons'
import { isCurrentWindowDocked } from '../adapter'
import { UndockIcon } from '../../../rt-components'

const exitIcon = exitNormalIcon()

export interface ControlProps {
  minimize?: () => void
  maximize?: () => void
  popIn?: () => void
  close?: () => void
}

export const OpenFinChrome: React.FC = ({ children }) => (
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
    <OpenFinUndockControl />
    <DragRegion />
    <OpenFinControls {...props} />
  </Header>
)

export const OpenFinControls: React.FC<ControlProps> = ({ minimize, maximize, close, popIn }) => (
  <React.Fragment>
    {minimize ? (
      <HeaderControl onClick={minimize} data-qa="openfin-chrome__minimize">
        {minimiseNormalIcon}
      </HeaderControl>
    ) : null}
    {maximize ? (
      <HeaderControl onClick={maximize} data-qa="openfin-chrome__maximize">
        {maximiseScreenIcon}
      </HeaderControl>
    ) : null}
    {popIn ? (
      <HeaderControl onClick={popIn} data-qa="openfin-chrome__maximize">
        {popInIcon}
      </HeaderControl>
    ) : null}
    {close ? (
      <HeaderControl onClick={close} data-qa="openfin-chrome__close">
        {exitIcon}
      </HeaderControl>
    ) : null}
  </React.Fragment>
)

const OpenFinUndockControl: React.FC = () => {
  const [isWindowDocked, setIsWindowDocked] = useState(false)

  useEffect(() => {
    const handleWindowDocked = () => {
      setIsWindowDocked(true)
    }

    snapAndDock.addEventListener('window-docked', handleWindowDocked)

    return () => {
      snapAndDock.removeEventListener('window-docked', handleWindowDocked)
    }
  }, [])

  useEffect(() => {
    isCurrentWindowDocked().then(isDocked => {
      setIsWindowDocked(isDocked)
    })
  }, [])

  const handleUndockClick = useCallback(() => {
    snapAndDock.undockWindow()
    setIsWindowDocked(false)
  }, [])

  return (
    <>
      {isWindowDocked && (
        <UndockButton onClick={handleUndockClick}>
          <UndockIcon width={24} height={24} />
        </UndockButton>
      )}
    </>
  )
}

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
  color: ${props => props.theme.button.secondary.backgroundColor};
  cursor: pointer;

  &:hover {
    svg path:last-child {
      fill: #5f94f5;
    }
  }
`

const UndockButton = styled.button`
  display: block;
  height: 100%;
  width: max-content;
  padding-left: 0.625rem;
  cursor: pointer;

  &:hover {
    .icon {
      path:nth-child(2) {
        fill: #5f94f5;
      }
      path:last-child {
        fill: #535760;
      }
    }
  }

  &:disabled {
    .icon {
      path:nth-child(2) {
        fill: #535760;
      }
      path:last-child {
        fill: #3d424c;
      }
    }
  }
`

export const Root = styled.div`
  background-color: ${props => props.theme.core.darkBackground};
  color: ${props => props.theme.core.textColor};

  height: 100%;
  width: 100%;
`

export default OpenFinChrome
