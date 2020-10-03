import React, { useEffect, FC } from 'react'
import styled from 'styled-components/macro'
import { OpenFinControls } from 'rt-platforms/openfin-platform/components'

const FrameRoot = styled.div`
  background-color: ${({ theme }) => theme.core.darkBackground};
  color: ${({ theme }) => theme.core.textColor};
  height: 100%;
  width: 100%;
  padding: 0px;
  margin: 0;
  position: absolute;
  overflow: hidden;

  #layout-container {
    height: 100%;
    width: 100%
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
    background-color: ${({ theme }) => theme.core.offBackground} !important;
  }
`

const TitleBarRoot = styled.div`
  width: 100%;
  height: var(--title-bar-height);
  display: flex;
`

const TitleBarWindowName = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const LayoutRoot = styled.div`
  height: calc(100% - var(--title-bar-height));
`
const WindowFrame: FC<{ maximize?: boolean }> = ({ maximize = false }) => {
  const win = fin.Window.getCurrentSync()
  const onClose = () => win.close()
  const onMinimize = () => win.minimize()
  const onMaximize = async () =>
    win.getState().then(state => (state === 'maximized' ? win.restore() : win.maximize()))
  const windowName = win.identity.name

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
    <FrameRoot>
      <TitleBarRoot>
        <div className="title-bar-draggable">
          <TitleBarWindowName>{windowName}</TitleBarWindowName>
        </div>
        <OpenFinControls
          minimize={onMinimize}
          maximize={maximize ? onMaximize : undefined}
          close={onClose}
        />
      </TitleBarRoot>

      <LayoutRoot>
        {/* This div and id is required by Openfin */}
        <div id="layout-container"></div>
      </LayoutRoot>
    </FrameRoot>
  )
}

export default WindowFrame
