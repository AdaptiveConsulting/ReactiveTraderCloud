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
import { displayAnalyticsSelector, displayBlotterSelector } from '../layouts/selectors'
import { connect } from 'react-redux'

interface Props {
  header?: React.ReactChild
  displayBlotter: boolean
  displayAnalytics: boolean
}

class ShellRoute extends PureComponent<Props> {
  render() {
    const { header, displayBlotter, displayAnalytics } = this.props
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
                  externalWindowProps={externalWindowDefault.blotterRegion}
                  render={(popOut, tornOff) => (
                    <BlotterContainer onPopoutClick={popOut} tornOff={tornOff} tearable />
                  )}
                  tornOff={!displayBlotter}
                />
              </BlotterWrapper>
            )}
            disabled={!displayBlotter}
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
              externalWindowProps={externalWindowDefault.analyticsRegion}
              render={(popOut, tornOff) => (
                <AnalyticsContainer onPopoutClick={popOut} tornOff={tornOff} tearable />
              )}
              tornOff={!displayAnalytics}
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
  displayBlotter: displayBlotterSelector(state),
  displayAnalytics: displayAnalyticsSelector(state),
})

export default connect(mapStateToProps)(ShellRoute)
