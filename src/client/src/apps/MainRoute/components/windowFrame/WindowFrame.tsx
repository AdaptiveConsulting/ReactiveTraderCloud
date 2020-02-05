import React, { useEffect, FC } from 'react'
import { styled } from 'rt-theme'
import { OpenFinControls } from 'rt-platforms/openFin/components'

const FrameRoot = styled.div`
  background-color: ${({ theme }) => theme.core.darkBackground};
  color: ${({ theme }) => theme.core.textColor};
  height: 100%;
  width: 100%;
  padding: 0px;
  margin: 0;
  position: absolute;
  overflow: hidden;

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

const WindowFrame: FC = () => {
  const win = fin.Window.getCurrentSync()
  const onClose = () => win.close()
  const onMinimize = () => win.minimize()
  const onMaximize = async () =>
    win.getState().then(state => (state === 'maximized' ? win.restore() : win.maximize()))

  useEffect(() => {
    window.document.dispatchEvent(
      new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true,
      }),
    )
  }, [])

  return (
    <FrameRoot>
      <TitleBarRoot>
        <div className="title-bar-draggable"></div>
        <OpenFinControls
          minimize={() => onMinimize()}
          maximize={() => onMaximize()}
          close={() => onClose()}
        />
      </TitleBarRoot>
      {/* This div and id is required by Openfin */}
      <div id="layout-container"></div>
    </FrameRoot>
  )
}

export default WindowFrame
