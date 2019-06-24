import React, { PureComponent } from 'react'

import { Resizer, TearOff, externalWindowDefault } from 'rt-components'

import { AnalyticsContainer } from '../../ui/analytics'
import { BlotterContainer } from '../../ui/blotter'
import StatusBar from '../../ui/status-bar'
import StatusButton from '../../ui/status-connection'
import { WorkspaceContainer } from '../../ui/workspace'

import ReconnectModal from '../components/reconnect-modal'
import DefaultLayout from '../layouts/DefaultLayout'
import { BlotterWrapper, AnalyticsWrapper, WorkspaceWrapper, OverflowScroll } from './styled'
import { GlobalState } from '../../StoreTypes'
import { analyticsSelector, blotterSelector } from '../layouts/selectors'
import { TileLayoutState } from '../layouts'
import { ExternalWindow } from './../../rt-components/platform/externalWindowDefault'
import { connect } from 'react-redux'

interface Props {
  header?: React.ReactChild
  blotter: TileLayoutState
  analytics: TileLayoutState
}

const addLayoutToConfig = (windowConfig: ExternalWindow, layout: TileLayoutState) => {
  return {
    ...windowConfig,
    config: {
      ...windowConfig.config,
      x: layout.x,
      y: layout.y,
    },
  }
}

class ShellRoute extends PureComponent<Props> {
  render() {
    const { header, blotter, analytics } = this.props
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
}

const mapStateToProps = (state: GlobalState) => ({
  blotter: blotterSelector(state),
  analytics: analyticsSelector(state),
})

export default connect(mapStateToProps)(ShellRoute)
