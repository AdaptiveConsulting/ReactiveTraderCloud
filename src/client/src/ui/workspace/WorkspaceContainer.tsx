import React, { FC, useState } from 'react'
import { connect } from 'react-redux'
import { Loadable } from 'rt-components'
import { GlobalState } from 'StoreTypes'
import { selectExecutionStatus, selectSpotTiles, selectSpotCurrencies } from './selectors'
import { styled } from 'rt-theme'
import Workspace from './Workspace'
import { WorkspaceHeader, TileViews } from './workspaceHeader'

type Props = ReturnType<typeof mapStateToProps>

const WorkSpaceWrapper = styled.div`
  height: 100%;
`

const ALL = 'ALL'

const WorkspaceContainer: FC<Props> = ({ status, spotTiles, children, currencyOptions }) => {
  const [currency, setCurrencyOption] = useState(ALL)
  const [tileView, setTileView] = useState(TileViews.Normal)
  return (
    <WorkSpaceWrapper>
      <WorkspaceHeader
        currencyOptions={currencyOptions}
        currency={currency}
        defaultOption={ALL}
        tileView={tileView}
        onCurrencyChange={setCurrencyOption}
        onTileViewChange={setTileView}
      />
      <Loadable
        status={status}
        render={() => <Workspace children={children} spotTiles={spotTiles} currency={currency} tileView={tileView} />}
        message="Pricing Disconnected"
      />
    </WorkSpaceWrapper>
  )
}
const mapStateToProps = (state: GlobalState) => ({
  spotTiles: selectSpotTiles(state),
  status: selectExecutionStatus(state),
  currencyOptions: selectSpotCurrencies(state),
})

export default connect(mapStateToProps)(WorkspaceContainer)
