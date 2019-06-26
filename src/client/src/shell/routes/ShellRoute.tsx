import React from 'react'

import { Resizer, TearOff, externalWindowDefault, ExternalWindow } from 'rt-components'

import { AnalyticsContainer } from '../../ui/analytics'
import { BlotterContainer } from '../../ui/blotter'
import StatusBar from '../../ui/status-bar'
import StatusButton from '../../ui/status-connection'
import { WorkspaceContainer } from '../../ui/workspace'

import ReconnectModal from '../components/reconnect-modal'
import DefaultLayout from '../layouts/DefaultLayout'
import { BlotterWrapper, AnalyticsWrapper, WorkspaceWrapper, OverflowScroll } from './styled'
import { analyticsSelector, blotterSelector } from '../layouts/selectors'
import { WindowPosition } from '../layouts'
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
            <BlotterWrapper>
              <TearOff
                id="blotter"
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
          <WorkspaceWrapper>
            <OverflowScroll>
              <WorkspaceContainer />
            </OverflowScroll>
          </WorkspaceWrapper>
        </Resizer>
      }
      aside={
        <AnalyticsWrapper>
          <TearOff
            id="region"
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
