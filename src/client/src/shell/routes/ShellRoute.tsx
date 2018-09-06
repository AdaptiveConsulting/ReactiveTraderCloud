import React from 'react'
import { AnalyticsContainer } from '../../ui/analytics'

import { TearOff } from 'rt-components'
import { styled } from 'rt-theme'
import { BlotterContainer } from '../../ui/blotter'
import StatusBar from '../../ui/status-bar'
import { WorkspaceContainer } from '../../ui/workspace'

import ReconnectModal from '../components/reconnect-modal'

import DefaultLayout from '../layouts/DefaultLayout'

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
      <React.Fragment>
        <WorkspaceWrapper>
          <WorkspaceContainer />
        </WorkspaceWrapper>

        <BlotterWrapper>
          <TearOff
            id="blotter"
            portalProps={portalProps.blotterRegion}
            render={(popOut, tornOff) => <BlotterContainer onPopoutClick={popOut} tornOff={tornOff} />}
          />
        </BlotterWrapper>
      </React.Fragment>
    }
    aside={
      <AnalyticsWrapper>
        <TearOff
          id="region"
          portalProps={portalProps.analyticsRegion}
          render={(popOut, tornOff) => <AnalyticsContainer onPopoutClick={popOut} tornOff={tornOff} />}
        />
      </AnalyticsWrapper>
    }
    footer={<StatusBar />}
    after={<ReconnectModal />}
  />
)

const WorkspaceWrapper = styled.div`
  padding: 0 0.5rem 0 1rem;
  overflow-y: auto;
  grid-row: 1 / 4;

  @media (max-width: 750px) {
    grid-column: 1 / 3;
  }
`

const AnalyticsWrapper = styled.div`
  padding: 0.375rem 1.25rem 0 0;
  overflow: hidden;
  grid-row: 1 / 6;

  @media (max-width: 750px) {
    display: none;
  }
`

const BlotterWrapper = styled.div`
  padding: 0 0.5rem 0 1rem;
  grid-row: 4 / 6;

  @media (max-width: 750px) {
    grid-column: 1 / 3;
  }
`

export default ShellRoute
