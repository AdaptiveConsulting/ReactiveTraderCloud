import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Resizer, TearOff } from 'rt-components'
import { externalWindowDefault, ExternalWindow, WindowPosition } from 'rt-platforms'
import { AnalyticsContainer } from '../widgets/analytics'
import { BlotterContainer } from '../widgets/blotter'
import StatusBar from '../widgets/status-bar'
import StatusButton from '../widgets/status-connection'
import { WorkspaceContainer } from '../widgets/workspace'
import ReconnectModal from '../components/reconnect-modal'
import { analyticsSelector, blotterSelector, liveRatesSelector, DefaultLayout } from '../layouts'
import { BlotterWrapper, AnalyticsWrapper, OverflowScroll, WorkspaceWrapper } from './styled'
import UsersModal from '../components/users-modal'
import ContactUsButton from '../widgets/contact-us'
// TODO - move to openfin-platform
import OpenFinStatusButton from 'rt-platforms/openfin-platform/components/OpenFinStatusConnection'
import { applySnapshotFromStorageOnLoad } from 'rt-platforms/openfin-platform/snapshots'
import { createGlobalStyle } from 'styled-components/macro'
import { Theme } from 'rt-theme'

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
  const liveRates = useSelector(liveRatesSelector)

  const lastRemainingService = useMemo(() => {
    const numberOfVisibleService = [blotter.visible, analytics.visible, liveRates.visible].filter(
      visible => visible === true
    ).length

    return numberOfVisibleService === 1
  }, [blotter.visible, analytics.visible, liveRates.visible])

  // TODO: This information should come from the platform context
  const isOpenFinTopWindow = window.fin?.me?.isWindow

  useEffect(() => {
    window.document.dispatchEvent(
      new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true,
      })
    )
    if (isOpenFinTopWindow) {
      async function run() {
        try {
          await applySnapshotFromStorageOnLoad()
        } catch (ex) {
          console.error(ex)
        }
        await fin.Platform.Layout.init()
      }
      run()
    }
  }, [isOpenFinTopWindow])

  if (isOpenFinTopWindow) {
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
      #layout-container {
        max-height: calc(100vh - 5rem);
        max-width: 100vw;
      }
    `

    const OfBody = (
      <React.Fragment>
        <OfTabTheme />
        <div id="layout-container" />
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
            dragTearOff
            externalWindowProps={addLayoutToConfig(externalWindowDefault.blotterRegion, blotter)}
            render={(popOut, tornOff) => (
              <BlotterContainer
                onPopoutClick={popOut}
                tornOff={tornOff}
                tearable={!lastRemainingService}
              />
            )}
            tornOff={!blotter.visible}
          />
        </BlotterWrapper>
      )}
      disabled={!blotter.visible}
      isLiveRatesVisible={liveRates.visible}
    >
      <TearOff
        id="liveRates"
        dragTearOff={false}
        externalWindowProps={addLayoutToConfig(externalWindowDefault.liveRatesRegion, liveRates)}
        render={(popOut, tornOff) => (
          <WorkspaceWrapper data-qa="shell-route__workspace-wrapper">
            <OverflowScroll>
              <WorkspaceContainer
                onPopoutClick={popOut}
                tornOff={tornOff}
                tearable={!lastRemainingService}
              />
            </OverflowScroll>
          </WorkspaceWrapper>
        )}
        tornOff={!liveRates.visible}
      />
    </Resizer>
  )

  const aside = (
    <AnalyticsWrapper data-qa="shell-route__analytics-wrapper">
      <TearOff
        id="region"
        dragTearOff
        externalWindowProps={addLayoutToConfig(externalWindowDefault.analyticsRegion, analytics)}
        render={(popOut, tornOff) => (
          <AnalyticsContainer
            onPopoutClick={popOut}
            tornOff={tornOff}
            tearable={!lastRemainingService}
          />
        )}
        tornOff={!analytics.visible}
      />
    </AnalyticsWrapper>
  )

  const statusBar = (
    <StatusBar>
      {footer}
      <ContactUsButton />
      <StatusButton />
    </StatusBar>
  )

  const modals = (
    <>
      <UsersModal />
      <ReconnectModal />
    </>
  )

  return (
    <DefaultLayout header={header} body={body} aside={aside} footer={statusBar} after={modals} />
  )
}

export default ShellRoute
