import React from 'react'
import { connect } from 'react-redux'
import { Loadable } from 'rt-components'
import { GlobalState } from 'StoreTypes'
import { selectExecutionStatus, selectSpotTiles, selectSpotCurrencies } from './selectors'
import Workspace from './Workspace'

const mapStateToProps = (state: GlobalState) => ({
  spotTiles: selectSpotTiles(state),
  status: selectExecutionStatus(state),
  currencyOptions: selectSpotCurrencies(state),
})

type Props = ReturnType<typeof mapStateToProps>

const WorkspaceContainer: React.FC<Props> = props => (
  <Loadable
    status={props.status}
    render={() => <Workspace {...props} />}
    message="Pricing Disconnected"
  />
)

export default connect(mapStateToProps)(WorkspaceContainer)
