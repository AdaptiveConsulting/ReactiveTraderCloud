import React from 'react'
import { TearOff } from 'rt-components'
import { styled } from 'rt-theme'
import SpotTileContainer from '../spotTile/SpotTileContainer'
import { ExternalWindowProps } from './selectors'

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
  externalWindowProps: ExternalWindowProps
}

interface Props {
  spotTiles: SpotTile[]
}

const Workspace: React.FC<Props> = ({ spotTiles = [] }) => (
  <WorkspaceItems>
    {spotTiles.map(({ key, externalWindowProps }) => (
      <TearOff
        id={key}
        externalWindowProps={externalWindowProps}
        render={(popOut, tornOff) => (
          <WorkspaceItem>
            <SpotTileContainer id={key} onPopoutClick={popOut} tornOff={tornOff} tearable />
          </WorkspaceItem>
        )}
        key={key}
      />
    ))}
  </WorkspaceItems>
)

export default Workspace
