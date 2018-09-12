import React from 'react'
import { TearOff } from 'rt-components'
import { styled } from 'rt-theme'
import ConnectedSpotTileContainer from '../spotTile/SpotTileContainer'
import { PortalProps } from './selectors'

const WorkspaceHeader = styled.div`
  display: flex;
  align-items: center;
  height: 3.5rem;
  color: ${p => p.theme.shell.textColor};
  font-size: 1rem;
`

const WorkspaceItems = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  grid-gap: 0.25rem;
`

const WorkspaceItem = styled.div`
  flex-grow: 1;
  flex-basis: 20rem;
`

interface SpotTile {
  key: string
  portalProps: PortalProps
}

interface Props {
  spotTiles: SpotTile[]
}

const Workspace: React.SFC<Props> = ({ spotTiles = [] }) => (
  <React.Fragment>
    <WorkspaceHeader>
      <div>Live Rates</div>
    </WorkspaceHeader>
    <WorkspaceItems>
      {spotTiles.map(({ key, portalProps }) => (
        <TearOff
          id={key}
          portalProps={portalProps}
          render={(popOut, tornOff) => (
            <WorkspaceItem>
              <ConnectedSpotTileContainer id={key} onPopoutClick={popOut} tornOff={tornOff} />
            </WorkspaceItem>
          )}
          key={key}
        />
      ))}
    </WorkspaceItems>
  </React.Fragment>
)

export default Workspace
