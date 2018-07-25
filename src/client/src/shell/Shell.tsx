import classnames from 'classnames'
import React from 'react'
import SplitPane from 'react-split-pane'
import { Environment, withEnvironment } from 'rt-components'
import { TearOff } from 'rt-components'
import { AnalyticsContainer } from '../ui/analytics/index'
import { BlotterContainer } from '../ui/blotter'
import FooterContainer from '../ui/footer/FooterContainer'
import '../ui/styles/css/index.css'
import { WorkspaceContainer } from '../ui/workspace'
import { Modal } from './modal'
import SidebarRegionContainer from './sidebar'

export interface ShellProps {
  sessionExpired: boolean
  showSplitter: boolean
  reconnect: () => void
}

const appVersion: string = process.env.REACT_APP_VERSION // version from package.json exported in webpack.config.js

const Shell: React.SFC<ShellProps & { environment: Environment }> = ({
  sessionExpired,
  showSplitter,
  reconnect,
  environment
}) => (
  <div
    className={classnames({
      shell__browser_wrapper: !environment.isRunningDesktop
    })}
  >
    <div className="shell__splash">
      <span className="shell__splash-message">
        {appVersion}
        <br />Loading...
      </span>
    </div>
    <div className="shell__container">
      <Modal shouldShow={sessionExpired} title="Session expired">
        <div>
          <div>Your 15 minute session expired, you are now disconnected from the server.</div>
          <div>Click reconnect to start a new session.</div>
          <button className="btn shell__button--reconnect" onClick={reconnect}>
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
          id="blotter"
          portalProps={portalProps.blotterRegion}
          render={(popOut, tornOff) => (
            <div className="shell__blotter-container">
              <div className="shell__blotter">
                <BlotterContainer onPopoutClick={popOut} tornOff={tornOff} />
              </div>
            </div>
          )}
        />
      </SplitPane>
      <TearOff
        id="region"
        portalProps={portalProps.analyticsRegion}
        render={(popOut, tornOff) => (
          <SidebarRegionContainer
            tornOff={tornOff}
            renderContent={() => <AnalyticsContainer onPopoutClick={popOut} tornOff={tornOff} />}
          />
        )}
      />
    </div>
    <div className="shell__footer">
      <FooterContainer />
    </div>
  </div>
)

const portalProps = {
  blotterRegion: {
    title: 'Blotter',
    config: {
      name: 'blotter',
      width: 850,
      height: 450,
      url: 'about:Blotter'
    }
  },
  analyticsRegion: {
    title: 'Analytics',
    config: {
      name: 'analytics',
      width: 400,
      height: 800,
      url: 'about:Analytics'
    }
  }
}

export default withEnvironment(Shell)
