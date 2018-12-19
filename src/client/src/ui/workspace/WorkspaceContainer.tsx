import React from 'react'
import { connect } from 'react-redux'
import { Loadable } from 'rt-components'
import { GlobalState } from 'StoreTypes'
import { selectExecutionStatus, selectSpotTiles } from './selectors'
import Workspace from './Workspace'
import WorkspaceHeader from './WorkspaceHeader'

type WorkspaceContainerStateProps = ReturnType<typeof mapStateToProps>
type WorkspaceContainerProps = WorkspaceContainerStateProps

const WorkspaceContainer = ({ status, ...props }: WorkspaceContainerProps) => (
  <WorkspaceHeader>
    <Loadable status={status} render={() => <Workspace {...props} />} message="Pricing Disconnected" />
  </WorkspaceHeader>
)

const mapStateToProps = (state: GlobalState) => ({
  spotTiles: selectSpotTiles(state),
  status: selectExecutionStatus(state),
})

export default connect(mapStateToProps)(WorkspaceContainer)
