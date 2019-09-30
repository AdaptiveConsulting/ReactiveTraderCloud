import React, { useState } from 'react'
import { TearOff } from 'rt-components'
import { styled } from 'rt-theme'
import SpotTileContainer from '../spotTile/SpotTileContainer'
import { WorkspaceHeader, TileViews } from './workspaceHeader'
import { appendTileViewToUrl } from './utils'
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
  tornOff: boolean
}

interface Props {
  spotTiles: SpotTile[]
  currencyOptions: string[]
}

const ALL = 'ALL'

const Workspace: React.FC<Props> = ({ spotTiles = [], currencyOptions }) => {
  const [currency, setCurrencyOption] = useState(ALL)
  const [tileView, setTileView] = useState(TileViews.Normal)

  return (
    <div data-qa="workspace__tiles-workspace">
      <WorkspaceHeader
        currencyOptions={currencyOptions}
        currency={currency}
        defaultOption={ALL}
        tileView={tileView}
        onCurrencyChange={setCurrencyOption}
        onTileViewChange={setTileView}
      />
      <WorkspaceItems data-qa="workspace__tiles-workspace-items">
        {spotTiles
          .filter(({ key }) => key.includes(currency) || currency === 'ALL')
          .map(({ key, externalWindowProps, tornOff }) => (
            <TearOff
              id={key}
              key={key}
              dragTearOff={true}
              externalWindowProps={appendTileViewToUrl(externalWindowProps, tileView)}
              render={(popOut, isTornOff) => (
                <WorkspaceItem>
                  <SpotTileContainer
                    id={key}
                    tileView={tileView}
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
