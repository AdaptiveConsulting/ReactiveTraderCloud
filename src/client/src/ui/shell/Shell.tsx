import * as React from 'react'
import { Modal } from '../modal'
import FooterContainer from '../footer/FooterContainer'
import SidebarRegionContainer from '../sidebar/SidebarRegionContainer'
import { WorkspaceContainer } from '../workspace/'
import { BlotterContainer } from '../blotter'
import { connect } from 'react-redux'
import { reconnect } from './actions'
import './shell.scss'
import '../common/styles/_base.scss'
import '../common/styles/_fonts.scss'
import RegionWrapper from '../../redux/regions/RegionWrapper'
import * as classnames from 'classnames'

export interface ShellProps {
  sessionExpired: boolean
  onReconnectClick: () => void
  reconnect: () => void
}

class ShellContainer extends React.Component<ShellProps, {}> {
  props: ShellProps
  appVersion: string = __VERSION__ // version from package.json exported in webpack.config.js

  static contextTypes = {
    openFin: React.PropTypes.object,
  }

  render() {
    const { sessionExpired } = this.props
    return (
      <div className={classnames({ 'shell__browser_wrapper': !this.context.openFin })}>
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
          <div className="shell_workspace_blotter">
            <WorkspaceContainer/>
            <RegionWrapper region="blotter">
              <div className="shell__blotter">
                <BlotterContainer/>
              </div>
            </RegionWrapper>
          </div>
          <RegionWrapper region="analytics">
            <SidebarRegionContainer/>
          </RegionWrapper>
        </div>
        <div className="shell__footer">
          <FooterContainer/>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ connectionStatus }) {
  const sessionExpired = connectionStatus.connection !== 'connected'
  return { sessionExpired }
}

export default connect(mapStateToProps, { reconnect })(ShellContainer)
