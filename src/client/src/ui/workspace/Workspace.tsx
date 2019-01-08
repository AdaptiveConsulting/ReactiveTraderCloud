import React from 'react'
import { TearOff } from 'rt-components'
import { styled } from 'rt-theme'
import SpotTileContainer from '../spotTile/SpotTileContainer'
import { PortalProps } from './selectors'
import { CurrencyOptions } from './workspaceHeader/types'

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
  tileView: string
  currencyView: CurrencyOptions
}

const Workspace: React.SFC<Props> = ({ spotTiles = [], tileView }) => (
  <WorkspaceItems>
    {spotTiles.map(({ key, portalProps }) => (
      <TearOff
        id={key}
        portalProps={{ ...portalProps, tileView }}
        render={(popOut, tornOff) => (
          <WorkspaceItem>
            <SpotTileContainer id={key} tileView={tileView} onPopoutClick={popOut} tornOff={tornOff} tearable />
          </WorkspaceItem>
        )}
        key={key}
      />
    ))}
  </WorkspaceItems>
)

export default Workspace
