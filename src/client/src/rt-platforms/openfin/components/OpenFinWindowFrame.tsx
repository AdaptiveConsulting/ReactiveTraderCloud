import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components/macro'
import { OpenFinChrome, OpenFinHeader, OpenFinFooter } from './OpenFinChrome'
import { getAppName } from 'rt-util'
import { ExitIcon } from 'apps/SimpleLauncher/icons'
import { renderToStaticMarkup } from 'react-dom/server'
import { PopoutIcon } from 'rt-components'

export const popoutIconString = encodeURIComponent(renderToStaticMarkup(PopoutIcon))
export const exitIconString = encodeURIComponent(renderToStaticMarkup(<ExitIcon />))

const OpenFinFrameRoot = styled.div`
  background-color: ${({ theme }) => theme.core.darkBackground};
  color: ${({ theme }) => theme.core.textColor};
  height: 100%;
  width: 100%;
  padding: 0px;
  margin: 0;
  position: absolute;
  overflow: hidden;

  --title-bar-height: 3.5rem;
  --openfin-footer-height: 2.5rem;

  #layout-container {
    height: 100%;
    width: 100%;
    padding: 0;
  }

  .wrapper_title {
    color: ${({ theme }) => theme.core.textColor};
  }

  .lm_tab {
    background-color: ${({ theme }) => theme.core.lightBackground};
    font-size: 3rem;
  }

  .lm_tabs {
    background-color: ${({ theme }) => theme.core.darkBackground};
    padding-left: 1rem;
  }

  .lm_header {
    background-color: ${({ theme }) => theme.core.darkBackground};
  }

  .lm_goldenlayout {
    background-color: ${({ theme }) => theme.core.lightBackground};
  }

  .lm_tab,
  .lm_tab.lm_active {
    background-color: ${({ theme }) => theme.core.darkBackground};
    color: ${({ theme }) => theme.core.textColor};
  }

  .lm_title {
    color: ${({ theme }) => theme.core.textColor} !important;
  }

  .lm_close_tab {
    background-image: url('data:image/svg+xml;utf8,${exitIconString}') !important;
    background-size: 20px !important;
  }

  .lm_popout {
    background-image: url('data:image/svg+xml;utf8,${popoutIconString}') !important;
    background-size: 30px !important;
    margin: 0.5rem 1.5rem 0 0;
  }
`

const LayoutRoot = styled.div`
  height: calc(100% - var(--title-bar-height) - var(--openfin-footer-height));
`

export const OpenFinWindowFrame: React.FC = () => {
  const win = fin.Window.getCurrentSync()
  const headerControlHandlers = {
    close: () => win.close(),
    minimize: () => win.minimize(),
    maximize: () =>
      win.getState().then(state => (state === 'maximized' ? win.restore() : win.maximize())),
  }

  useEffect(() => {
    window.document.dispatchEvent(
      new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true,
      })
    )
    fin.Platform.Layout.init()
  }, [])

  return (
    <OpenFinFrameRoot>
      <Helmet>
        <style type="text/css">{`
        :root, body {
          font-size: 16px;
        }
        body, select, button, li, span, div {
          font-family: inherit;
          color: inherit;
        }
    `}</style>
      </Helmet>
      <OpenFinChrome>
        <OpenFinHeader {...headerControlHandlers} title={getAppName()} />

        <LayoutRoot>
          {/* This div and id is required by Openfin */}
          <div id="layout-container"></div>
        </LayoutRoot>
        <OpenFinFooter />
      </OpenFinChrome>
    </OpenFinFrameRoot>
  )
}
