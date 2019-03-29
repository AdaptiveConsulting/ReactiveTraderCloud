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

interface Props {
  header?: React.ReactChild
}

interface State {
  displayBlotter: boolean
}

class ShellRoute extends PureComponent<Props, State> {
  state = {
    displayBlotter: true,
  }

  showBlotter = () => this.setState({ displayBlotter: true })

  hideBlotter = () => this.setState({ displayBlotter: false })

  render() {
    const { header } = this.props
    const { displayBlotter } = this.state
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
                  render={(popOut, tornOff) => <BlotterContainer onPopoutClick={popOut} tornOff={tornOff} tearable />}
                  popIn={this.showBlotter}
                  popOut={this.hideBlotter}
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
              render={(popOut, tornOff) => <AnalyticsContainer onPopoutClick={popOut} tornOff={tornOff} tearable />}
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

export default ShellRoute
