import React, { useEffect } from 'react'

import { Resizer, TearOff } from 'rt-components'
import { externalWindowDefault, ExternalWindow, WindowPosition } from 'rt-platforms'
import { AnalyticsContainer } from '../widgets/analytics'
import { BlotterContainer } from '../widgets/blotter'
import StatusBar from '../widgets/status-bar'
import StatusButton from '../widgets/status-connection'
import { WorkspaceContainer } from '../widgets/workspace'
import OpenFinStatusButton from 'rt-platforms/openFin/components/OpenFinStatusConnection'
import ReconnectModal from '../components/reconnect-modal'
import DefaultLayout from '../layouts/DefaultLayout'
import { BlotterWrapper, AnalyticsWrapper, WorkspaceWrapper, OverflowScroll } from './styled'
import { analyticsSelector, blotterSelector } from '../layouts/selectors'
import { useSelector } from 'react-redux'
import { createGlobalStyle } from 'styled-components'
import { Theme } from 'rt-theme'
import { applySnapshotFromStorageOnLoad } from "rt-platforms/openFin/snapshots"

interface Props {
  header?: React.ReactChild
  footer?: React.ReactChild
}

const addLayoutToConfig = (windowConfig: ExternalWindow, layout: WindowPosition) => {
  return {
    ...windowConfig,
    config: {
      ...windowConfig.config,
      x: layout.x,
      y: layout.y,
    },
  }
}

const ShellRoute: React.FC<Props> = ({ header, footer }) => {
  const blotter = useSelector(blotterSelector)
  const analytics = useSelector(analyticsSelector)

  useEffect(() => {
    window.document.dispatchEvent(
      new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true,
      }),
    )
  }, [])

  //@ts-ignore
  if (window.fin && window.fin.Application.me) {

    //TODO: Wait for OpenFin to complete Platform context get/set.
    applySnapshotFromStorageOnLoad().catch(ex => console.error(ex))

    const OfTabTheme = createGlobalStyle<{ theme: Theme }>`
      .lm_tabs {
        background-color: ${({ theme }) => theme.core.lightBackground};
        border-radius: 0px;
      }
      .lm_content {
        background-color: ${({ theme }) => theme.core.lightBackground};
      }
      .lm_tab, .lm_tab.lm_active {
        background-color: ${({ theme }) => theme.core.darkBackground} !important;
        color: ${({ theme }) => theme.core.textColor} !important;
      }
      .lm_splitter {
        background-color: ${({ theme }) => theme.core.offBackground} !important;
      }
    `

    const OfBody = (
      <React.Fragment>
        <OfTabTheme />
        <div style={{ height: '100%', width: '100%' }} id="layout-container" />
      </React.Fragment>
    )

    const ofStatusBar = (
      <StatusBar>
        {footer}
        <OpenFinStatusButton />
      </StatusBar>
    )

    return (
      <DefaultLayout
        header={header}
        body={OfBody}
        footer={ofStatusBar}
        after={<ReconnectModal />}
      />
    )
  }

  const body = (
    <Resizer
      defaultHeight={30}
      component={() => (
        <BlotterWrapper data-qa="shell-route__blotter-wrapper">
          <TearOff
            id="blotter"
            dragTearOff={true}
            externalWindowProps={addLayoutToConfig(externalWindowDefault.blotterRegion, blotter)}
            render={(popOut, tornOff) => (
              <BlotterContainer onPopoutClick={popOut} tornOff={tornOff} tearable />
            )}
            tornOff={!blotter.visible}
          />
        </BlotterWrapper>
      )}
      disabled={!blotter.visible}
    >
      <WorkspaceWrapper data-qa="shell-route__workspace-wrapper">
        <OverflowScroll>
          <WorkspaceContainer />
        </OverflowScroll>
      </WorkspaceWrapper>
    </Resizer>
  )

  const aside = (
    <AnalyticsWrapper data-qa="shell-route__analytics-wrapper">
      <TearOff
        id="region"
        dragTearOff={true}
        externalWindowProps={addLayoutToConfig(externalWindowDefault.analyticsRegion, analytics)}
        render={(popOut, tornOff) => (
          <AnalyticsContainer onPopoutClick={popOut} tornOff={tornOff} tearable />
        )}
        tornOff={!analytics.visible}
      />
    </AnalyticsWrapper>
  )

  const statusBar = (
    <StatusBar>
      {footer}
      <StatusButton />
    </StatusBar>
  )

  return (
    <DefaultLayout
      header={header}
      body={body}
      aside={aside}
      footer={statusBar}
      after={<ReconnectModal />}
    />
  )
}

export default ShellRoute
