import React from 'react'

import { Resizer, TearOff } from 'rt-components'
import { externalWindowDefault, ExternalWindow } from 'rt-platforms'
import { AnalyticsContainer } from '../widgets/analytics'
import { BlotterContainer } from '../widgets/blotter'
import StatusBar from '../widgets/status-bar'
import StatusButton from '../widgets/status-connection'
import { WorkspaceContainer } from '../widgets/workspace'

import ReconnectModal from '../components/reconnect-modal'
import DefaultLayout from '../layouts/DefaultLayout'
import { BlotterWrapper, AnalyticsWrapper, WorkspaceWrapper, OverflowScroll } from './styled'
import { analyticsSelector, blotterSelector } from '../layouts/selectors'
import { WindowPosition } from 'rt-platforms/types'
import { useSelector } from 'react-redux'

interface Props {
  header?: React.ReactChild
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

const ShellRoute: React.FC<Props> = ({ header }) => {
  const blotter = useSelector(blotterSelector)
  const analytics = useSelector(analyticsSelector)

  return (
    <DefaultLayout
      header={header}
      body={
        <Resizer
          defaultHeight={30}
          component={() => (
            <BlotterWrapper data-qa="shell-route__blotter-wrapper">
              <TearOff
                id="blotter"
                dragTearOff={false}
                externalWindowProps={addLayoutToConfig(
                  externalWindowDefault.blotterRegion,
                  blotter,
                )}
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
      }
      aside={
        <AnalyticsWrapper data-qa="shell-route__analytics-wrapper">
          <TearOff
            id="region"
            dragTearOff={false}
            externalWindowProps={addLayoutToConfig(
              externalWindowDefault.analyticsRegion,
              analytics,
            )}
            render={(popOut, tornOff) => (
              <AnalyticsContainer onPopoutClick={popOut} tornOff={tornOff} tearable />
            )}
            tornOff={!analytics.visible}
          />
        </AnalyticsWrapper>
      }
      footer={
        <StatusBar>
          <StatusButton />
        </StatusBar>
      }
      after={<ReconnectModal />}
    />
  )
}

export default ShellRoute
