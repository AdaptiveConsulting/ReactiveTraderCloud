import * as React from 'react'
import { Modal } from '../modal'
import FooterContainer from '../footer/FooterContainer'
import SidebarRegionContainer from '../sidebar/SidebarRegionContainer'
import { WorkspaceContainer } from '../workspace/'
import { BlotterContainer } from '../blotter'

import RegionWrapper from '../common/regions/RegionWrapper'
import * as classnames from 'classnames'
import TradeNotificationContainer from '../notification/TradeNotificationContainer'
import * as PropTypes from 'prop-types'
const SplitPane = require('react-split-pane')
import '../styles/scss/index.scss'

export interface ShellProps {
  sessionExpired: boolean
  showSplitter: boolean
  onReconnectClick: () => void
  reconnect: () => void
}

export default class Shell extends React.Component<ShellProps, {}> {
  static contextTypes = {
    openFin: PropTypes.object
  }
  props: ShellProps
  appVersion: string = __VERSION__ // version from package.json exported in webpack.config.js

  render() {
    const { sessionExpired, showSplitter } = this.props
    return (
      <div className={classnames({ shell__browser_wrapper: !this.context.openFin })}>
        <div className="shell__splash">
          <span className="shell__splash-message">{this.appVersion}<br/>Loading...</span>
        </div>
        <div className="shell__container">
          <Modal shouldShow={sessionExpired} title="Session expired">
            <div>
              <div>Your 15 minute session expired, you are now disconnected from the server.</div>
              <div>Click reconnect to start a new session.</div>
              <button className="btn shell__button--reconnect"
                      onClick={this.props.reconnect}>Reconnect
              </button>
            </div>
          </Modal>

          {/*we do not show the split view if the blotter is popped out*/}
          { showSplitter ? this.renderSplitView() : this.renderTiles()}

          <RegionWrapper region="analytics">
            <SidebarRegionContainer/>
          </RegionWrapper>
        </div>
        <div className="shell__footer">
          <FooterContainer/>
          <TradeNotificationContainer/>
        </div>
      </div>
    )
  }

  private renderTiles = ():JSX.Element => {
    return (<div className="shell_workspace_blotter">
      <WorkspaceContainer/>
    </div>)
  }

  private renderSplitView = ():JSX.Element => {
    return (<SplitPane minSize={300} size={ 600 } split="horizontal" style={{position: 'relative'}}>
      <WorkspaceContainer/>
      <div className="shell__blotter-container"><RegionWrapper region="blotter">
        <div className="shell__blotter">
          <BlotterContainer/>
        </div>
      </RegionWrapper>
      </div>
    </SplitPane>)
  }
}
