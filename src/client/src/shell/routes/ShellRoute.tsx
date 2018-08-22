import React from 'react'
import { AnalyticsContainer } from 'ui/analytics'

import SplitPane from 'react-split-pane'

import { TearOff } from 'rt-components'
import { styled } from 'rt-theme'
import { BlotterContainer } from 'ui/blotter'
import StatusBar from 'ui/status-bar'
import { WorkspaceContainer } from 'ui/workspace'

import ReconnectModal from '../components/reconnect-modal'
import SidebarRegionContainer from '../components/sidebar'

import DefaultLayout from 'shell/layouts/DefaultLayout'

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

export const ShellRoute: React.SFC<{ header: React.ReactChild }> = ({ header }) => (
  <DefaultLayout
    header={header}
    body={
      <SplitPane minSize={300} size={600} maxSize={-50} split="horizontal" style={{ position: 'relative' }}>
        <WorkspaceContainer />
        <BlotterWrapper>
          <TearOff
            id="blotter"
            portalProps={portalProps.blotterRegion}
            render={(popOut, tornOff) => <BlotterContainer onPopoutClick={popOut} tornOff={tornOff} />}
          />
        </BlotterWrapper>
      </SplitPane>
    }
    aside={
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
    }
    footer={
      <StatusBarContainer>
        <StatusBar />
      </StatusBarContainer>
    }
    after={<ReconnectModal />}
  />
)

const BlotterWrapper = styled.div`
  height: 100%;
  padding: 0 0.5rem 0 1rem;
`

const StatusBarContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
`

export default ShellRoute
