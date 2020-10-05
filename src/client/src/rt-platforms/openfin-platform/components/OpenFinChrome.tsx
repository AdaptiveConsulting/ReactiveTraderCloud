import React, { FC, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { AccentName } from 'rt-theme'
import styled from 'styled-components/macro'
import Header from 'apps/MainRoute/components/app-header'
import StatusBar from 'apps/MainRoute/widgets/status-bar'
import { ExitIcon, maximiseScreenIcon, minimiseNormalIcon } from 'apps/SimpleLauncher/icons'
import { getAppName } from 'rt-util'
import OpenfinSnapshotSelection from './OpenfinSnapshotSelection'
import OpenFinStatusButton from './OpenFinStatusConnection'
import ReactGA from 'react-ga'

export interface ControlProps {
  minimize?: () => void
  maximize?: () => void
  close: () => void
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

export const OpenFinChrome: FC = ({ children }) => {
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
      <Helmet>
        <style type="text/css">{`
        :root,
        body,
        #root {
          overflow: hidden;
          min-height: 100%;
          max-height: 100vh;
        }
        body, select, button, li, span, div {
          font-family: inherit;
          color: inherit;
        }
    `}</style>
      </Helmet>
      {children}
    </>
  )
}

export const OpenFinHeader: React.FC<ControlProps> = ({ ...props }) => (
  <Header
    controls={<OpenFinControls {...props} />}
    filler={<OpenFinTitleBar className="title-bar-draggable">{getAppName()}</OpenFinTitleBar>}
  />
)

export const OpenFinFooter: React.FC = ({ ...props }) => (
  <StatusBar>
    <FooterControl>
      <OpenfinSnapshotSelection />
      <OpenFinStatusButton />
    </FooterControl>
  </StatusBar>
)

export const OpenFinControls: React.FC<ControlProps> = ({ minimize, maximize, close }) => (
  <OpenFinControlsWrapper>
    {minimize ? (
      <HeaderControl accent="aware" onClick={minimize} data-qa="openfin-chrome__minimize">
        {minimiseNormalIcon}
      </HeaderControl>
    ) : null}
    {maximize ? (
      <HeaderControl accent="primary" onClick={maximize} data-qa="openfin-chrome__maximize">
        {maximiseScreenIcon}
      </HeaderControl>
    ) : null}
    <HeaderControl accent="negative" onClick={close} data-qa="openfin-chrome__close">
      <ExitIcon />
    </HeaderControl>
  </OpenFinControlsWrapper>
)

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
  height: 3rem;
`

const OpenFinControlsWrapper = styled.div`
  display: flex;
`

const HeaderControl = styled.div<{ accent?: AccentName }>`
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-self: center;
  padding-top: 7px;

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

export default OpenFinChrome
