import { getPlatformLayoutTitle } from 'apps/utils/openfin-utils'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { isParentAppOpenfinLauncher } from 'rt-platforms'
import { getAppName } from 'rt-util'
import styled from 'styled-components/macro'
import { OpenFinChrome, OpenFinSubWindowHeader } from './OpenFinChrome'

const OpenFinSubFrameRoot = styled.div`
  background-color: ${({ theme }) => theme.core.darkBackground};
  color: ${({ theme }) => theme.core.textColor};
  height: 100%;
  width: 100%;
  padding: 0px;
  margin: 0;
  position: absolute;
  overflow: hidden;

  --title-bar-height: 1.5rem;
  --openfin-footer-height: 0rem;

  #layout-container {
    height: 100%;
    width: 100%;
    padding: 0;
  }

  .lm_tabs {
    background-color: ${({ theme }) => theme.core.lightBackground};
    border-radius: 0px;
  }

  .lm_content {
    background-color: ${({ theme }) => theme.core.lightBackground};
  }

  .lm_tab,
  .lm_tab.lm_active {
    background-color: ${({ theme }) => theme.core.darkBackground} !important;
    color: ${({ theme }) => theme.core.textColor} !important;
  }

  .lm_controls {
    display: none;
  }

  .lm_splitter {
    background-color: ${({ theme }) => theme.core.textColor};
  }

`

const LayoutRoot = styled.div`
  height: calc(100% - var(--title-bar-height) - var(--openfin-footer-height));
`

export const OpenFinSubWindowFrame: React.FC = () => {
  const win = fin.Window.getCurrentSync()
  const [fromLauncher] = useState<boolean>(isParentAppOpenfinLauncher())
  const [windowName, setWindowName] = useState('')

  const headerControlHandlers = {
    minimize: () => win.minimize(),
    popIn: !fromLauncher ? () => win.close() : undefined,
    close: fromLauncher ? () => win.close() : undefined,
  }

  useEffect(() => {
    window.document.dispatchEvent(
      new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true,
      })
    )
    async function init() {
      async function updateWindowName() {
        const windowTitle = await getPlatformLayoutTitle()
        if (windowTitle) {
          setWindowName(windowTitle)
        }
      }
      await fin.Platform.Layout.init()

      // This seems to be necessary to give OpenFin Platform enough time to initialise
      // Otherwise the layout can't be found...
      setTimeout(updateWindowName, 0)
    }
    init()
  }, [])

  const title = `${getAppName()}${windowName ? ` - ${windowName}` : ''}`

  return (
    <OpenFinSubFrameRoot>
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
        <OpenFinSubWindowHeader {...headerControlHandlers} title={title} />

        <LayoutRoot>
          {/* This div and id is required by Openfin */}
          <div id="layout-container"></div>
        </LayoutRoot>
      </OpenFinChrome>
    </OpenFinSubFrameRoot>
  )
}
