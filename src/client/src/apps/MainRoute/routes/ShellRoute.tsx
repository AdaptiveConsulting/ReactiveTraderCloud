import React from 'react'

import { Resizer, TearOff } from 'rt-components'
import { externalWindowDefault, ExternalWindow, WindowPosition } from 'rt-platforms'
import { AnalyticsContainer } from '../widgets/analytics'
import { BlotterContainer } from '../widgets/blotter'
import StatusBar from '../widgets/status-bar'
import StatusButton from '../widgets/status-connection'
import { WorkspaceContainer } from '../widgets/workspace'

import ReconnectModal from '../components/reconnect-modal'
import DefaultLayout from '../layouts/DefaultLayout'
import { BlotterWrapper, AnalyticsWrapper, WorkspaceWrapper, OverflowScroll } from './styled'
import { analyticsSelector, blotterSelector } from '../layouts/selectors'
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

  const body = (
    <Resizer
      defaultHeight={30}
      component={() => (
        <BlotterWrapper data-qa="shell-route__blotter-wrapper">
          <TearOff
            id="blotter"
            dragTearOff={true}
            externalWindowProps={addLayoutToConfig(
              externalWindowDefault.blotterRegion,
              blotter,
            )}
            render={(popOut, tornOff) => (
              <BlotterContainer onPopoutClick={popOut} tornOff={tornOff} tearable/>
            )}
            tornOff={!blotter.visible}
          />
        </BlotterWrapper>
      )}
      disabled={!blotter.visible}
    >
      <WorkspaceWrapper data-qa="shell-route__workspace-wrapper">
        <OverflowScroll>
          <WorkspaceContainer/>
        </OverflowScroll>
      </WorkspaceWrapper>
    </Resizer>
  );

  const aside = (
    <AnalyticsWrapper data-qa="shell-route__analytics-wrapper">
      <TearOff
        id="region"
        dragTearOff={true}
        externalWindowProps={addLayoutToConfig(
          externalWindowDefault.analyticsRegion,
          analytics,
        )}
        render={(popOut, tornOff) => (
          <AnalyticsContainer onPopoutClick={popOut} tornOff={tornOff} tearable/>
        )}
        tornOff={!analytics.visible}
      />
    </AnalyticsWrapper>
  );

  const footer = (
    <StatusBar>
      <StatusButton/>
    </StatusBar>
  );

  return (
    <DefaultLayout
      header={header}
      body={body}
      aside={aside}
      footer={footer}
      after={<ReconnectModal/>}
    />
  )
}

export default ShellRoute
