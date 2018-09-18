import React from 'react'

import { Resizer, TearOff } from 'rt-components'
import { styled } from 'rt-theme'

import { AnalyticsContainer } from '../../ui/analytics'
import { BlotterContainer } from '../../ui/blotter'
import StatusBar from '../../ui/status-bar'
import { WorkspaceContainer } from '../../ui/workspace'

import ReconnectModal from '../components/reconnect-modal'
import DefaultLayout from '../layouts/DefaultLayout'

export const ShellRoute: React.SFC<{ header: React.ReactChild }> = ({ header }) => (
  <DefaultLayout
    header={header}
    body={
      <Resizer
        defaultHeight={30}
        component={() => (
          <BlotterWrapper>
            <TearOff
              id="blotter"
              portalProps={portalProps.blotterRegion}
              render={(popOut, tornOff) => <BlotterContainer onPopoutClick={popOut} tornOff={tornOff} tearable />}
            />
          </BlotterWrapper>
        )}
      >
        <WorkspaceWrapper>
          <WorkspaceContainer />
        </WorkspaceWrapper>
      </Resizer>
    }
    aside={
      <AnalyticsWrapper>
        <TearOff
          id="region"
          portalProps={portalProps.analyticsRegion}
          render={(popOut, tornOff) => <AnalyticsContainer onPopoutClick={popOut} tornOff={tornOff} tearable />}
        />
      </AnalyticsWrapper>
    }
    footer={<StatusBar />}
    after={<ReconnectModal />}
  />
)

const portalProps = {
  blotterRegion: {
    title: 'Blotter',
    config: {
      name: 'blotter',
      width: 850,
      height: 450,
      url: '/blotter',
    },
  },
  analyticsRegion: {
    title: 'Analytics',
    config: {
      name: 'analytics',
      width: 400,
      height: 800,
      url: '/analytics',
    },
  },
}

const Wrapper = styled.div`
  user-select: none;
`

const WorkspaceWrapper = styled(Wrapper)`
  padding: 0 0.5rem 0 1rem;
  height: 100%;
  overflow: scroll;
`

const AnalyticsWrapper = styled(Wrapper)`
  padding: 0.5rem;
  overflow: hidden;

  @media (max-width: 750px) {
    display: none;
  }
`

const BlotterWrapper = styled(Wrapper)`
  padding: 0 0.5rem 0 1rem;
  height: 100%;
`

export default ShellRoute
