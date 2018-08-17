import React from 'react'
import SplitPane from 'react-split-pane'

import { TearOff } from 'rt-components'
import { WorkspaceContainer } from 'ui/workspace'

import { ShellContainer } from 'shell'
import { AnalyticsContainer } from 'ui/analytics'
import { BlotterContainer } from 'ui/blotter'

import SidebarRegionContainer from 'shell/sidebar'

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

const DefaultLayout = () => (
  <ShellContainer>
    <SplitPane minSize={300} size={600} maxSize={-50} split="horizontal" style={{ position: 'relative' }}>
      <WorkspaceContainer />
      <TearOff
        id="blotter"
        portalProps={portalProps.blotterRegion}
        render={(popOut, tornOff) => <BlotterContainer onPopoutClick={popOut} tornOff={tornOff} />}
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
  </ShellContainer>
)

export default DefaultLayout
