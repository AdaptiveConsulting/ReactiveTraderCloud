import React, { useState } from 'react'
import { TearOff } from 'rt-components'
import styled from 'styled-components/macro'
import SpotTileContainer from '../spotTile/SpotTileContainer'
import { WorkspaceHeader, TileView } from './workspaceHeader'
import { ExternalWindowProps } from './selectors'
import { useLocalStorage } from 'rt-util'

const WorkspaceItems = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-gap: 0.25rem;
`

const WorkspaceItem = styled.div`
  flex-grow: 1;
  flex-basis: 20rem;
`

interface SpotTile {
  key: string
  externalWindowProps: ExternalWindowProps
  tornOff: boolean
}

interface Props {
  spotTiles: SpotTile[]
  currencyOptions: string[]
  canPopout: boolean
  onPopoutClick?: () => void
}

const ALL = 'ALL'

const Workspace: React.FC<Props> = ({
  spotTiles = [],
  currencyOptions,
  canPopout,
  onPopoutClick,
}) => {
  const [currency, setCurrencyOption] = useState(ALL)
  const [tileView, setTileView] = useLocalStorage('tileView', TileView.Analytics)

  return (
    <div data-qa="workspace__tiles-workspace">
      <WorkspaceHeader
        canPopout={canPopout}
        currencyOptions={currencyOptions}
        currency={currency}
        defaultOption={ALL}
        onPopoutClick={onPopoutClick}
        onCurrencyChange={setCurrencyOption}
        onTileViewChange={setTileView}
        tileView={tileView as TileView}
      />
      <WorkspaceItems data-qa="workspace__tiles-workspace-items">
        {spotTiles
          .filter(({ key }) => key.includes(currency) || currency === ALL)
          .map(({ key, externalWindowProps, tornOff }) => (
            <TearOff
              id={key}
              key={key}
              dragTearOff
              externalWindowProps={externalWindowProps}
              render={(popOut, isTornOff) => (
                <WorkspaceItem>
                  <SpotTileContainer
                    id={key}
                    tileView={tileView as TileView}
                    onPopoutClick={popOut}
                    tornOff={isTornOff}
                    tearable
                  />
                </WorkspaceItem>
              )}
              tornOff={tornOff}
            />
          ))}
      </WorkspaceItems>
    </div>
  )
}

export default Workspace
