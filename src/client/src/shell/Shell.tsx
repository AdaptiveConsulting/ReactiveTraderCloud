import classnames from 'classnames'
import React from 'react'
import SplitPane from 'react-split-pane'
import { Environment, withEnvironment } from 'rt-components'
import { TearOff } from 'rt-components'

import { AnalyticsContainer } from 'ui/analytics'
import { BlotterContainer } from 'ui/blotter'
import Footer from 'ui/footer'

import { WorkspaceContainer } from 'ui/workspace'

import Header from './Header'
import ReconnectModal from './ReconnectModal'
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
      <Header />
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
    <ReconnectModal shouldShow={sessionExpired} reconnect={reconnect} />
    <div className="shell__footer">
      <Footer />
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
