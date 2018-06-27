import * as React from 'react'
import { BlotterContainer } from '../blotter'
import FooterContainer from '../footer/FooterContainer'
import { Modal } from '../modal'
import SidebarRegionContainer from '../sidebar'
import { WorkspaceContainer } from '../workspace/'

import * as classnames from 'classnames'
import { connect } from 'react-redux'
import SplitPane from 'react-split-pane'
import { Dispatch } from 'redux'
import RegionWrapper, { Region, RegionActions } from '../common/regions'
import TradeNotificationContainer from '../notification/TradeNotificationContainer'
import '../styles/css/index.css'
import { TearOff } from '../tearoff'

export interface ShellProps {
  sessionExpired: boolean
  showSplitter: boolean
  reconnect: () => void
}

type ShellDispatchProps = ReturnType<typeof mapDispatchToProps>

class Shell extends React.Component<ShellProps & ShellDispatchProps> {
  state = {
    gridDocument: null,
    blotterRegionTearOff: false
  }

  popout = (region: string) => {
    this.setState({ [region]: true }, () => this.props.onPopout(regionSettings[region]))
  }

  popIn = (region: string) => {
    this.setState({ [region]: false }, () => this.props.onPopin(regionSettings[region]))
  }

  portalProps = {
    blotterRegion: {
      name: 'blotter',
      title: 'Blotter',
      width: 850,
      height: 450,
      onUnload: () => this.popIn('blotterRegionTearOff'),
      url: 'about:Blotter'
    }
  }

  appVersion: string = process.env.REACT_APP_VERSION // version from package.json exported in webpack.config.js

  render() {
    const { sessionExpired, showSplitter } = this.props
    const { blotterRegionTearOff } = this.state

    return (
      <div
        className={classnames({
          shell__browser_wrapper: !this.context.openFin
        })}
      >
        <div className="shell__splash">
          <span className="shell__splash-message">
            {this.appVersion}
            <br />Loading...
          </span>
        </div>
        <div className="shell__container">
          <Modal shouldShow={sessionExpired} title="Session expired">
            <div>
              <div>Your 15 minute session expired, you are now disconnected from the server.</div>
              <div>Click reconnect to start a new session.</div>
              <button className="btn shell__button--reconnect" onClick={this.props.reconnect}>
                Reconnect
              </button>
            </div>
          </Modal>

          <SplitPane
            minSize={300}
            size={600}
            split="horizontal"
            style={{ position: 'relative' }}
            className={showSplitter ? '' : 'soloPane1'}
          >
            <WorkspaceContainer />
            <TearOff
              tornOff={blotterRegionTearOff}
              portalProps={this.portalProps.blotterRegion}
              render={() => (
                <div className="shell__blotter-container">
                  <div className="shell__blotter">
                    <BlotterContainer
                      onPopoutClick={() => this.popout('blotterRegionTearOff')}
                      tornOff={blotterRegionTearOff}
                    />
                  </div>
                </div>
              )}
            />
          </SplitPane>
          <RegionWrapper region="analytics">
            <SidebarRegionContainer />
          </RegionWrapper>
        </div>
        <div className="shell__footer">
          <FooterContainer />
          <TradeNotificationContainer />
        </div>
      </div>
    )
  }
}

interface Regions {
  [regionName: string]: Region
}

const regionSettings: Regions = {
  blotterRegionTearOff: {
    id: 'blotter'
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onPopout: region => dispatch(RegionActions.popoutOpened(region)),
  onPopin: region => dispatch(RegionActions.popoutClosed(region))
})

export default connect(
  null,
  mapDispatchToProps
)(Shell)
