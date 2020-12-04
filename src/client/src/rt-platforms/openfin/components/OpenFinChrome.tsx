import React, { FC, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { AccentName } from 'rt-theme'
import styled from 'styled-components/macro'
import Header from 'apps/MainRoute/components/app-header'
import OpenFinContactButton from './OpenFinContactButton'
import { OpenFinSnapshotButton } from './OpenFinSnapshot'
import { StatusButtonContainer } from './OpenFinStatusConnection/StatusContainers'
import StatusBar from 'apps/MainRoute/widgets/status-bar'
import {
  ExitIcon,
  maximiseScreenIcon,
  minimiseNormalIcon,
  popInIcon,
} from 'apps/SimpleLauncher/icons'
import ReactGA from 'react-ga'
import { inMainOpenFinWindow, closeOtherWindows } from './utils'
import LayoutLockToggleSwitch from './LayoutLockToggleSwitch'

export interface ControlProps {
  minimize?: () => void
  maximize?: () => void
  close?: () => void
  popIn?: () => void
}

interface HeaderProps extends ControlProps {
  title?: string
}

const LAYOUT_ITEMS = {
  Blotter: 'stream',
  Analytics: 'chart-line',
  Pricing: 'dollar-sign',
}

const getEmptyContent = (key: string, useIcon: boolean = true) => {
  if (useIcon) {
    const icon = LAYOUT_ITEMS[key]
    if (icon) {
      return `<i style="font-size: 6rem" class="fas fa-${icon} fa-set-position" />`
    }
  }
  return key
}

interface Props {
  title?: string
}
export const OpenFinChrome: FC<Props> = ({ children, title }) => {
  //TODO: Remove this HACK once OpenFin exposes content of "empty" layout containers...
  useEffect(() => {
    //@ts-ignore
    if (!window.fin.me.isView) {
      const listenerViewAttached = (e: any) => {
        const label: string = ((e || {}).viewIdentity || {}).name || 'unknown'
        ReactGA.event({ category: 'RT - Tab', action: 'attach', label })
      }
      const listenerViewDetached = (e: any) => {
        const label: string = ((e || {}).viewIdentity || {}).name || 'unknown'
        ReactGA.event({ category: 'RT - Tab', action: 'detach', label })
      }
      const listenerViewHidden = (e: any) => {
        const layoutItems: HTMLCollectionOf<Element> = document.getElementsByClassName('lm_item')
        for (let idx in layoutItems) {
          const layoutItem = layoutItems[idx]
          if (layoutItem && layoutItem.querySelector) {
            const placeholder = layoutItem.querySelector('.wrapper_title')
            const tab = layoutItem.querySelector('.lm_tab.lm_active .lm_title')
            if (placeholder && tab) {
              placeholder.innerHTML = getEmptyContent(tab.innerHTML, false)
            }
          }
        }
      }
      const listenerWindowCreated = (e: any) => {
        const label: string = (e || {}).name || 'unknown'
        ReactGA.event({ category: 'RT - Window', action: 'open', label })
      }
      const listenerWindowClosed = (e: any) => {
        const label: string = (e || {}).name || 'unknown'
        ReactGA.event({ category: 'RT - Window', action: 'close', label })
      }

      fin.Window.getCurrent()
        .then(window => {
          window.addListener('view-attached', listenerViewAttached)
          window.addListener('view-detached', listenerViewDetached)
        })
        .catch(ex => console.warn(ex))
      fin.Application.getCurrent()
        .then(app => {
          app.addListener('view-hidden', listenerViewHidden)
          app.addListener('window-closed', listenerWindowClosed)
          app.addListener('window-created', listenerWindowCreated)
        })
        .catch(ex => console.warn(ex))

      return () => {
        fin.Window.getCurrent()
          .then(window => {
            window.removeListener('view-attached', listenerViewAttached)
            window.removeListener('view-detached', listenerViewDetached)
          })
          .catch(ex => console.warn(ex))
        fin.Application.getCurrent()
          .then(app => {
            app.removeListener('view-hidden', listenerViewHidden)
            app.removeListener('window-closed', listenerWindowClosed)
            app.removeListener('window-created', listenerWindowCreated)
          })
          .catch(ex => console.warn(ex))
      }
    }
  }, [])

  return (
    <>
      <Helmet title={title}>
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
      {children}
    </>
  )
}

export const OpenFinHeader: React.FC<HeaderProps> = ({ title, ...props }) => (
  <Header
    controls={<OpenFinControls {...props} />}
    filler={<OpenFinTitleBar className="title-bar-draggable">{title}</OpenFinTitleBar>}
    switches={<LayoutLockToggleSwitch />}
  />
)

export const OpenFinFooter: React.FC = ({ ...props }) => (
  <StatusBar>
    <FooterControl>
      <OpenFinContactButton />
      <OpenFinSnapshotButton />
      <StatusButtonContainer />
    </FooterControl>
  </StatusBar>
)

export const OpenFinControls: React.FC<ControlProps> = ({ minimize, maximize, popIn, close }) => {
  async function customClose() {
    if (inMainOpenFinWindow()) {
      await closeOtherWindows()
    }

    if (close) {
      close()
    }
  }

  return (
    <OpenFinControlsWrapper>
      {minimize && (
        <HeaderControl accent="aware" onClick={minimize} data-qa="openfin-chrome__minimize">
          {minimiseNormalIcon}
        </HeaderControl>
      )}
      {maximize && (
        <HeaderControl accent="primary" onClick={maximize} data-qa="openfin-chrome__maximize">
          {maximiseScreenIcon}
        </HeaderControl>
      )}
      {popIn && (
        <HeaderControl accent="primary" onClick={popIn} data-qa="openfin-chrome__popin">
          {popInIcon}
        </HeaderControl>
      )}
      {close && (
        <HeaderControl accent="negative" onClick={customClose} data-qa="openfin-chrome__close">
          <ExitIcon />
        </HeaderControl>
      )}
    </OpenFinControlsWrapper>
  )
}

const OpenFinTitleBar = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  font-weight: normal;
  min-height: 1.5rem;
  margin: 0;
  font-size: 0.625rem;
  height: 100%;
`

const OpenFinControlsWrapper = styled.div`
  display: flex;
`

const HeaderControl = styled.div<{ accent?: AccentName }>`
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-self: center;

  color: ${props => props.theme.secondary.base};

  &:hover {
    svg {
      path:last-child {
        fill: ${({ theme, accent = 'primary' }) => theme.button[accent].backgroundColor};
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

const FooterControl = styled.div`
  margin-right: 0.5rem;
  display: flex;
`

export const OpenFinSubWindowHeader: React.FC<HeaderProps> = ({ title, ...props }) => (
  <SubWindowHeader>
    <OpenFinTitleBar className="title-bar-draggable">{title}</OpenFinTitleBar>
    <OpenFinControls {...props} />
  </SubWindowHeader>
)

const SubWindowHeader = styled.div`
  display: flex;
  width: 100%;
  height: 1.5rem;
  font-size: 1rem;
  padding: 0 0.625rem;
  color: ${({ theme }) => theme.core.textColor};
`

export default OpenFinChrome
