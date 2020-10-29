import React, { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Resizer, TearOff } from 'rt-components'
import { externalWindowDefault } from 'rt-platforms'
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
import { addLayoutToConfig } from './addLayoutToConfig'

interface Props {
  header?: React.ReactChild
  footer?: React.ReactChild
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

  useEffect(() => {
    window.document.dispatchEvent(
      new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true,
      })
    )
  }, [])

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
