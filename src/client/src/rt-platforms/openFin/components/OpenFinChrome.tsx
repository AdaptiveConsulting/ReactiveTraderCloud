import React, { useEffect, useState, useCallback } from 'react'
import { Helmet } from 'react-helmet'
import { snapAndDock } from 'openfin-layouts'
import { styled, AccentName } from 'rt-theme'
import {
  minimiseNormalIcon,
  maximiseScreenIcon,
  ExitIcon,
  popInIcon,
} from 'apps/SimpleLauncher/icons'
import { isCurrentWindowDocked } from '../adapter'
import { UndockIcon } from '../../../rt-components'
import { getAppName } from 'rt-util'

export interface ControlProps {
  minimize?: () => void
  maximize?: () => void
  popIn?: () => void
  close?: () => void
  title?: string
  isBlotterOrTrade?: boolean
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
  <Header hasBottomBorder={props.isBlotterOrTrade}>
    <OpenFinUndockControl />
    <DragRegion>{props.title}</DragRegion>
    <OpenFinControls {...props} />
  </Header>
)

export const OpenFinControls: React.FC<ControlProps> = ({ minimize, maximize, close, popIn }) => (
  <React.Fragment>
    {maximize ? <TitleContainer>{getAppName()}</TitleContainer> : null}
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
        <ExitIcon />
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

    const handleWindowUnDocked = () => {
      setIsWindowDocked(false)
    }

    snapAndDock.addEventListener('window-docked', handleWindowDocked)
    snapAndDock.addEventListener('window-undocked', handleWindowUnDocked)

    return () => {
      snapAndDock.removeEventListener('window-docked', handleWindowDocked)
      snapAndDock.removeEventListener('window-undocked', handleWindowUnDocked)
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
    <UndockControl
      disabled={!isWindowDocked}
      onClick={handleUndockClick}
      isWindowDocked={isWindowDocked}
    >
      <UndockIcon width={24} height={24} />
    </UndockControl>
  )
}

const TitleContainer = styled.div`
  position: absolute;
  top: 20px;
  margin-top: 20px;
  margin: 0 auto;
  left: 0;
  right: 0;
  text-align: center;
  width: 80%;
  font-size: 0.625rem;
  font-weight: normal;
  z-index: 100;
  text-transform: uppercase;
`

const Header = styled.div<{ hasBottomBorder?: boolean }>`
  display: flex;
  width: 100%;
  min-height: 1.5rem;
  font-size: 1rem;
  padding: 0 0.625rem;
  border-bottom: ${({ hasBottomBorder, theme }) =>
    hasBottomBorder ? `1px solid ${theme.primary[1]}` : 0};
  color: ${({ theme }) => theme.core.textColor};
`

const DragRegion = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  font-size: 0.625rem;
  letter-spacing: 0.2px;
  text-transform: uppercase;

  -webkit-app-region: drag;
`

const HeaderControl = styled.button<{ accent?: AccentName }>`
  display: flex;
  cursor: pointer;

  &:hover {
    svg {
      path:last-child {
        fill: #5f94f5;
      }
    }
  }

  &:disabled {
    svg {
      path:nth-child(2) {
        fill: #535760;
      }
      path:last-child {
        fill: #535760;
      }
    }
  }
`
const UndockControl = styled(HeaderControl)<{ isWindowDocked: boolean }>`
  visibility: ${({ isWindowDocked }) => (isWindowDocked ? 'visible' : 'hidden')};
`

export const Root = styled.div`
  background-color: ${props => props.theme.core.darkBackground};
  color: ${props => props.theme.core.textColor};

  height: 100%;
  width: 100%;
`

export default OpenFinChrome
